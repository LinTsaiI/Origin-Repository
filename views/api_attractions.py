from flask import Blueprint, request, jsonify, make_response
from views.db_pool import connection_pool

api_attractions = Blueprint('api_attractions', __name__)


def get_acctractions_list(page_results):
  if not page_results:   # 若搜尋結果為空值
    return []
  else:
    db = connection_pool.get_connection()
    cursor = db.cursor()
    attractions_list = []
    for data in page_results:
      cursor.execute(
          'SELECT url FROM attraction_imgs JOIN taipei_attractions ON attraction_id=id WHERE id=%s;', (data[0],))
      url_list = cursor.fetchall()   # list 中每個 url 為 tuple 型態
      # cursor.close()
      # db.close()
      images = []
      for item in url_list:
        images.append(item[0])   # 原型態為 tuple，取第 0 個位置的資料即為網址 string
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

def ok_body(nextpage, data):
  body = jsonify(
      {
          "nextpage": nextpage,
          "data": data
      }
  )
  return body

def error_body(message):
  body = jsonify(
      {
          "error": True,
          "message": message
      }
  )
  return body

def response(body, status):
  response = make_response(body, status)
  response.headers['Content-Type'] = 'application/json'
  return response


@api_attractions.route('/api/attractions', methods=['GET'])
def get_attraction():
  try:
    page = int(request.args.get('page', default=0))
    keyword = request.args.get('keyword', default=None)

    # 先確認是否有 keyword，若有則依查詢到的結果數量判斷是否有下一頁
    if keyword:
      db = connection_pool.get_connection()
      cursor = db.cursor()
      cursor.execute('''SELECT * FROM taipei_attractions WHERE name LIKE concat('%', %s, '%');''', (keyword,))
      results = cursor.fetchall()   # 得到一個結果 list，其中資料為 tuple 型態
      n = len(results)   # 符合 keyword 的景點數量
      # 若找不到關鍵字，回傳空 data
      if n == 0:
        body = ok_body(None, [])
        return response(body, 200)

      if n > 0 and n//12 < 1:   # 有符合 keyword 但結果不超過 12個 (只會顯示 page 0)，一次回傳所有符合的景點資料
        data = get_acctractions_list(results)
        body = ok_body(None, data)
        return response(body, 200)
      
      elif n//12 > 0:   # 表示符合 keyword 的超過 12 個，有下一頁
        if page < n//12:   # page 不在最後一頁
          data = get_acctractions_list(results[page*12:page*12+12])
          body = ok_body(page+1, data)
          return response(body, 200)

        elif page >= n/12:   # page 在最後一頁，或要求的頁面超過最後一頁(不存在)
          data = get_acctractions_list(results[page*12:page*12+12])
          body = ok_body(None, data)
          return response(body, 200)
    
    # 若沒有 keyword (預設為 None)，則依 page 決定顯示的項目及是否有下一頁
    elif not keyword:
      db = connection_pool.get_connection()
      cursor = db.cursor()
      cursor.execute('SELECT * FROM taipei_attractions ORDER BY id LIMIT %s, %s;', (page*12, 13))
      results = cursor.fetchall()   # 取13個景點資料
      number = len(results)
      if not results:   # 非有效頁數取得的 results 為 None
        body = ok_body(None, [])
        return response(body, 200)

      elif number <= 12:   # 取到12個或不足12個，表示沒有下一頁，只顯示 page 0
        data = get_acctractions_list(results)
        body = ok_body(None, data)
        return response(body, 200)

      elif number > 12:   # 取到13個，表示還有下一頁
        data = get_acctractions_list(results[0:12])   # 只顯示12個
        body = ok_body(page+1, data)
        return response(body, 200)

  except:
    message = "系統性錯誤，請稍後再試"
    body = error_body(message)
    return response(body, 500)

  finally:
    cursor.close()
    db.close()


@api_attractions.route('/api/attraction/<attractionId>', methods=['GET'])
def get_attraction_by_id(attractionId):
  try:
    db = connection_pool.get_connection()
    cursor = db.cursor()
    cursor.execute('SELECT * FROM taipei_attractions WHERE id=%s;', (attractionId,))
    result = cursor.fetchall()
    if result:
      data = get_acctractions_list(result)[0]   # 只會有一個景點，取 attractions_list 裡的第一個 {}
      body = jsonify(
        {
          "data": data
        }
      )
      return response(body, 200)

    elif not result:
      message = "查無此景點"
      body = error_body(message)
      return response(body, 400)

  except:
    message = "系統性錯誤，請稍後再試"
    body = error_body(message)
    return response(body, 500)
  
  finally:
    cursor.close()
    db.close()

