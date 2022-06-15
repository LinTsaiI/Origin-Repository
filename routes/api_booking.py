from flask import Blueprint, request, jsonify
from flask_jwt_extended import *
from models.model_booking import create_booking_into_db, get_booking_from_db, delete_booking_from_db
from views.view_booking import create_booking_list

api_booking = Blueprint('api_booking', __name__)


# Controller: 查詢預定行程(購物車商品)
@api_booking.route('/api/booking', methods=['GET'])
@jwt_required(optional=True)
def get_booking_info():
  try:
    current_identity = get_jwt_identity()
    if not current_identity:
      return jsonify({
          "error": True,
          "message": "未登入"
      }), 403
    else:
      user_data = get_jwt()
      member_id = user_data['id']
      data = get_booking_from_db(member_id)
      if not data:
        return jsonify({
          "data": None
        })
      else:
        booking_info = create_booking_list(data)
        return jsonify({
            "data": booking_info
        }), 200

  except Exception as e:
    print(e)

# Controller: 新增一個預定
@api_booking.route('/api/booking', methods=['POST'])
@jwt_required(optional=True)
def create_booking():
  try:
    current_identity = get_jwt_identity()
    if not current_identity:
      return jsonify({
          "error": True,
          "message": "未登入"
      }), 403
    
    attraction_id = request.json.get('attractionId')
    date = request.json.get('date')
    time = request.json.get('time')
    price = request.json.get('price')
    if not date:
      return jsonify({
          "error": True,
          "message": "請選擇預定日期"
      }), 400
    else:
      user_data = get_jwt()
      member_id = user_data['id']
      create_booking_into_db(member_id, attraction_id, date, time, price)
      return jsonify({
          "ok": True
      }), 200
  
  except Exception as e:
    print(e)
    return jsonify({
        "error": True,
        "message": "系統性錯誤，請稍後再試"
    }), 500

# Controller: 刪除已預定行程
@api_booking.route('/api/booking/<bookingId>', methods=['DELETE'])
@jwt_required(optional=True)
def delete_booking(bookingId):
  try:
    current_identity = get_jwt_identity()
    if not current_identity:
      return jsonify({
          "error": True,
          "message": "未登入"
      }), 403
    else:
      user_data = get_jwt()
      member_id = user_data['id']
      delete_booking_from_db(member_id, bookingId)
      return jsonify({
          "ok": True
      }), 200

  except Exception as e:
    print(e)