from flask import jsonify

# View: 生成景點列表
def attractions_list(attraction_data):
  attractions_list = []
  for data in attraction_data:
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
def response(attraction_data, page):
  number = len(attraction_data)
  if not number:   # 沒有對應的關鍵字，或非有效頁數
    return jsonify({
        "nextpage": None,
        "data": None
    }), 200
  elif number <= 12:   # 結果不超過 12 個表沒有下一頁
    return jsonify({
        "nextpage": None,
        "data": attractions_list(attraction_data)
    }), 200
  elif number > 12:   # 取到 13 個表示有下一頁
    return jsonify({
        "nextpage": page+1,
        "data": attractions_list(attraction_data[0:12])
    }), 200


# view: 搜尋景點 id，回應給前端的訊息
def response_one(attraction_data):
  if attraction_data:
    # 只會有一個景點，取 attractions_list 裡的第一個 {}
    return jsonify({
        "data": attractions_list(attraction_data)[0]
    }), 200
  elif not attraction_data:
    return jsonify({
        "error": True,
        "message": "查無此景點"
    }), 400
