from flask import Blueprint, request, jsonify, session
from models.model_booking import create_booking_into_db, get_booking_from_db, delete_booking_from_db
from views.view_booking import render_booking_info

api_booking = Blueprint('api_booking', __name__)


# Controller: 查詢已預定行程
@api_booking.route('/api/booking', methods=['GET'])
def get_booking_info():
  try:
    email = session['email']
    if not email:
      return jsonify({
          "error": True,
          "message": "未登入"
      }), 403
    else:
      data = get_booking_from_db(email)
      if not data:
        return jsonify({
          "data": None
        })
      else:
        booking_info = render_booking_info(data)
        return jsonify({
            "data": booking_info
        }), 200

  except Exception as e:
    print(e)

# Controller: 新增一個預定
@api_booking.route('/api/booking', methods=['POST'])
def create_booking():
  try:
    name = session['name']
    email = session['email']
    if not name or not email:
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
      create_booking_into_db(name, email, attraction_id, date, time, price)
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
@api_booking.route('/api/booking', methods=['DELETE'])
def delete_booking():
  try:
    email = session['email']
    if not email:
      return jsonify({
          "error": True,
          "message": "未登入"
      }), 403
    else:
      delete_booking_from_db(email)
      return jsonify({
          "ok": True
      }), 200

  except Exception as e:
    print(e)