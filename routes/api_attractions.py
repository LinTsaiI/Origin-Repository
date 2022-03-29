from flask import Blueprint, request, jsonify
from models.model_attraction import get_attraction_by_id, get_keyword_attractions, get_attractions_without_keyword
from views.view_attraction import response, response_one

api_attractions = Blueprint('api_attractions', __name__)


# Controller: 取得景點資料
@api_attractions.route('/api/attractions', methods=['GET'])
def get_attractions():
  try:
    page = int(request.args.get('page', default=0))
    keyword = request.args.get('keyword', default=None)
    # 先確認是否有 keyword
    if keyword:
      results = get_keyword_attractions(page, keyword)
      return response(results, page)
    # 若沒有 keyword (預設為 None)，則依 page 決定顯示的項目
    elif not keyword:
      attraction_data = get_attractions_without_keyword(page)
      return response(attraction_data, page)

  except Exception as e:
    print(e)
    return jsonify({
        "error": True,
        "message": "系統性錯誤，請稍後再試"
    }), 500


# 根據景點 id 取得對應的景點資料
@api_attractions.route('/api/attraction/<attractionId>', methods=['GET'])
def get_one_attraction(attractionId):
  try:
    attraction_data = get_attraction_by_id(attractionId)
    return response_one(attraction_data)

  except Exception as e:
    print(e)
    return jsonify({
        "error": True,
        "message": "系統性錯誤，請稍後再試"
    }), 500
