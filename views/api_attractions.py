from flask import Blueprint, request, jsonify, make_response
from views.db_pool import connection_pool

api_attractions = Blueprint('api_attractions', __name__)


@api_attractions.route('/api/attractions', methods=['GET'])
def get_attraction():
  try:
    page = int(request.args.get('page', default=0))
    keyword = request.args.get('keyword', default=None)

    def get_acctractions_list(page_results):
      if not page_results:   # 若搜尋結果為空值
        return []
      else:
        attractions_list = []
        for data in page_results:
          cursor.execute(
              'SELECT url FROM attraction_imgs JOIN taipei_attractions ON attraction_id=id WHERE id=%s;', (data[0],))
          url_list = cursor.fetchall()   # list 中每個 url 為 tuple 型態
          images = []
          for item in url_list:
            images.append(item[0])
          attraction = {
              "id": data[0],
              "name": data[1],
              "category": data[2],
              "description": data[3],
              "address": data[4],
              "transport": data[5],
              "mrt": data[6],
              "latitude": data[7],
              "longitude": data[8],
              "images": images
          }
          attractions_list.append(attraction)
        return attractions_list

    # 先確認是否有 keyword，若有則依查詢到的結果數量判斷是否有下一頁
    if keyword:
      db = connection_pool.get_connection()
      cursor = db.cursor()
      cursor.execute('''SELECT * FROM taipei_attractions WHERE name LIKE concat('%', %s, '%');''', (keyword,))
      results = cursor.fetchall()   # 得到一個結果 list，其中資料為 tuple 型態
      n = len(results)   # 符合 keyword 的景點數量
      # 若找不到關鍵字，回傳空 data
      if n == 0:
        body = jsonify(
          {
            "nextpage": None,
            "data": []
          }
        )
        response = make_response(body, 200)
        response.headers['Content-Type'] = 'application/json'
        return response

      if n > 0 and n//12 < 1:   # 有符合 keyword 但結果不超過 12個 (只會顯示 page 0)，一次回傳所有符合的景點資料
        page_results = results
        body = jsonify(
          {
            "nextpage": None,
            "data": get_acctractions_list(page_results)
          }
        )
        response = make_response(body, 200)
        response.headers['Content-Type'] = 'application/json'
        return response
      
      elif n//12 > 0:   # 表示符合 keyword 的超過 12 個，有下一頁
        if page < n//12:   # page 不在最後一頁
          page_results = results[page*12:page*12+12]
          body = jsonify(
            {
              "nextpage": page+1,
              "data": get_acctractions_list(page_results)
            }
          )
          response = make_response(body, 200)
          response.headers['Content-Type'] = 'application/json'
          return response

        elif page >= n/12:   # page 在最後一頁，或要求的頁面超過最後一頁(不存在)
          page_results = results[page*12:page*12+12]
          body = jsonify(
            {
              "nextpage": None,
              "data": get_acctractions_list(page_results)
            }
          )
          response = make_response(body, 200)
          response.headers['Content-Type'] = 'application/json'
          return response
    
    # 若沒有 keyword (預設為 None)，則依 page 決定顯示的項目及是否有下一頁
    elif not keyword:
      db = connection_pool.get_connection()
      cursor = db.cursor()
      cursor.execute('SELECT * FROM taipei_attractions WHERE id>%s AND id<%s;', (page*12, page*12+14))
      results = cursor.fetchall()   # 取13個景點資料
      if not results:   # 非有效頁數取得的 results 為 None
        body = jsonify(
          {
            "nextpage": None,
            "data": []
          }
        )
        response = make_response(body, 200)
        response.headers['Content-Type'] = 'application/json'
        return response
      elif len(results) <= 12:   # 取到12個或不足12個，表示沒有下一頁，只顯示 page 0
        page_results = results
        body = jsonify(
          {
            "nextpage": None,
            "data": get_acctractions_list(page_results)
          }
        )
        response = make_response(body, 200)
        response.headers['Content-Type'] = 'application/json'
        return response

      elif len(results) > 12:   # 取到13個，表示還有下一頁
        page_results = results[0:12]   # 只取12個顯示
        body = jsonify(
          {
            "nextpage": page+1,
            "data": get_acctractions_list(page_results)
          }
        )
        response = make_response(body, 200)
        response.headers['Content-Type'] = 'application/json'
        return response


  except:
    body = jsonify(
      {
        "error": True,
        "message": "系統性錯誤，請稍後再試"
      }
    )
    response = make_response(body, 500)
    response.headers['Content-Type'] = 'application/json'
    return response
  

  finally:
    cursor.close()
    db.close()



@api_attractions.route('/api/attraction/<attractionId>', methods=['GET'])
def get_attraction_by_id(attractionId):
  try:
    db = connection_pool.get_connection()
    cursor = db.cursor()
    cursor.execute('SELECT * FROM taipei_attractions WHERE id=%s;', (attractionId,))
    data = cursor.fetchone()
    if data:
      cursor.execute('SELECT url FROM attraction_imgs WHERE attraction_id=%s;' ,(attractionId,))
      url_list = cursor.fetchall()   # list 中每個 url 為 tuple 型態
      images = []
      for item in url_list:
        images.append(item[0])    # 原型態為 tuple，取第 0 個位置的資料即為網址 string
      body = jsonify(
        {
          "data": {
            "id": data[0],
            "name": data[1],
            "category": data[2],
            "description": data[3],
            "address": data[4],
            "transport": data[5],
            "mrt": data[6],
            "latitude": data[7],
            "longitude": data[8],
            "images": images
          }
        }
      )
      response = make_response(body, 200)
      response.headers['Content-Type'] = 'application/json'
      return response
    elif not data:
      body = jsonify(
        {
          "error": True,
          "message": "查無此景點"
        }
      )
      response = make_response(body, 400)
      response.headers['Content-Type'] = 'application/json'
      return response

  except:
    body = jsonify(
      {
        "error": True,
        "message": "系統性錯誤，請稍後再試"
      }
    )
    response = make_response(body, 500)
    response.headers['Content-Type'] = 'application/json'
    return response
  
  finally:
    cursor.close()
    db.close()

