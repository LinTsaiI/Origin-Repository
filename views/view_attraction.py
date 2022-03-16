from flask import jsonify, make_response

# View: 生成景點列表
def attractions_list(results):
  attractions_list = []
  for data in results:
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
        "images": data[9].split(',')
    }
    attractions_list.append(attraction)
  return attractions_list


# view: 頁面載入或查詢關鍵字，回應給前端的訊息
def response(results, page):
  number = len(results)
  if not number:   # 沒有對應的關鍵字，或非有效頁數
    return make_response(jsonify({
        "nextpage": None,
        "data": None
    }), 200)
  elif number <= 12:   # 結果不超過 12 個表沒有下一頁
    return make_response(jsonify({
        "nextpage": None,
        "data": attractions_list(results)
    }), 200)
  elif number > 12:   # 取到 13 個表示有下一頁
    return make_response(jsonify({
        "nextpage": page+1,
        "data": attractions_list(results[0:12])
    }), 200)


# view: 搜尋景點 id，回應給前端的訊息
def response_one(result):
  if result:
    # 只會有一個景點，取 attractions_list 裡的第一個 {}
    return make_response(jsonify({
        "data": attractions_list(result)[0]
    }), 200)
  elif not result:
    return make_response(jsonify({
        "error": True,
        "message": "查無此景點"
    }), 400)
