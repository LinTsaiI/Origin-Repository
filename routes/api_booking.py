from flask import Blueprint, request, jsonify, session
from models.model_booking import create_booking_into_db, get_booking_from_db, delete_booking_from_db

api_booking = Blueprint('api_booking', __name__)


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
        attraction_id = data[0][0]
        date = data[0][1]
        time = data[0][2]
        price = data[0][3]
        attraction_name = data[1][0]
        address = data[1][1]
        image = data[1][2]
        return jsonify({
            "data": {
                "attraction": {
                    "id": attraction_id,
                    "name": attraction_name,
                    "address": address,
                    "image": image
                },
                "date": str(date),
                "time": time,
                "price": price
            }
        }), 200

  except Exception as e:
    print(e)


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