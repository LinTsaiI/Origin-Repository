from flask import Blueprint, request, jsonify, make_response
from models.model_attraction import get_attraction, get_keyword_attractions, get_attractions_without_keyword
from views.view_attraction import response, response_one

api_attractions = Blueprint('api_attractions', __name__)


# Controller
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
      results = get_attractions_without_keyword(page)
      return response(results, page)

  except Exception as e:
    print(e)
    return make_response(jsonify({
        "error": True,
        "message": "系統性錯誤，請稍後再試"
    }), 500)


@api_attractions.route('/api/attraction/<attractionId>', methods=['GET'])
def get_attraction_by_id(attractionId):
  try:
    result = get_attraction(attractionId)
    return response_one(result)

  except Exception as e:
    print(e)
    return make_response(jsonify({
        "error": True,
        "message": "系統性錯誤，請稍後再試"
    }), 500)
