from flask import Blueprint, request, jsonify, make_response
from routes.db_pool import connection_pool

api_booking = Blueprint('api_booking', __name__)


@api_booking.route('/api/booking', methods=['GET'])
def get_booking_info():
  return


@api_booking.route('/api/booking', methods=['POST'])
def create_booking():
  # check user signin state
  if not signin:
    return jsonify(
      {
        "error": true,
        "message": "自訂的錯誤訊息"
      }
    )
  attraction_id = request.json.get('attraction_id')
  date = request.json.get('date')
  time = request.json.get('time')
  price = request.json.get('price')
  if not date:
    return jsonify(
      {
          "error": true,
          "message": "自訂的錯誤訊息"
      }
    )
  else:
    return jsonify(
      {
        "ok": true
      }
    )

@api_booking.route('/api/booking', methods=['DELETE'])
def delete_booking():
  return
