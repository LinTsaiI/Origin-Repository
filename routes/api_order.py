from flask import Blueprint, request, jsonify
from flask_jwt_extended import *
from models.model_order import create_order, pay_successfully, get_order_info_from_db, change_booking_status
from views.view_order import render_order_info
import requests
from datetime import datetime
import random
from dotenv import dotenv_values

api_order = Blueprint('api_order', __name__)
config = dotenv_values('.env')

# 生成訂單編號
def generate_order_id():
  current_datetime = datetime.now()
  random_number = str(int(round(random.random()*1000000, 6)))
  order_id = current_datetime.strftime("%Y%m%d%H%M%S")+'-'+random_number
  return order_id

# 建立一個付款訂單
@api_order.route('/api/order', methods=['POST'])
@jwt_required(optional=True)
def create_orders():
  try:
    current_identity = get_jwt_identity()
    if not current_identity:
      return jsonify({
          "error": True,
          "message": "未登入"
      }), 403

    prime = request.json.get('prime')
    order = request.json.get('order')
    total_price = order['price']
    trip_list = order['trip']
    contact_name = order['contact']['name']
    contact_email = order['contact']['email']
    phone_number = order['contact']['phone']
    if not prime or not contact_name or not contact_email or not phone_number:
      return jsonify({
          "error": True,
          "message": "訂單建立失敗，請確認資訊輸入正確再重新送出"
      }), 400
    else:
      user_data = get_jwt()
      member_id = user_data['id']
      order_id = generate_order_id()
      booking_id_list = []
      for item in trip_list:
        booking_id = item['id']
        attraction_id = item['attraction']['id']
        date = item['date']
        time = item['time']
        price = item['price']
        create_order(order_id, member_id, contact_name, contact_email, phone_number, booking_id, attraction_id, date, time, price, total_price)
        booking_id_list.append(booking_id)
      headers = {
          "Content-Type": "application/json",
          "x-api-key": config['TAPPAY_PARTNER_KEY']
      }
      payload = {
          "prime": prime,
          "partner_key": config['TAPPAY_PARTNER_KEY'],
          "merchant_id": "triptracks_CTBC",
          "details": "台北一日遊訂購行程",
          "amount": total_price,
          "cardholder": {
              "phone_number": phone_number,
              "name": contact_name,
              "email": contact_email,
          }
      }
      response = requests.post('https://sandbox.tappaysdk.com/tpc/payment/pay-by-prime', json=payload, headers=headers)
      if response.json()['status'] != 0:
        for booking_id in booking_id_list:
          change_booking_status(member_id)
        return jsonify({
            "data": {
                "number": order_id,
                "payment": {
                    "status": 1,
                    "message": "付款失敗，請確認資訊後再重新付款"
                }
            }
        }), 200
      else:
        pay_successfully(order_id)
        for booking_id in booking_id_list:
          change_booking_status(member_id)
        return jsonify({
            "data": {
                "number": order_id,
                "payment": {
                    "status": 0,
                    "message": "付款成功"
                }
            }
        }), 200

  except Exception as e:
    print(e)
    return jsonify({
        "error": True,
        "message": "系統性錯誤，請稍後再試"
    }), 500
    

# 取得單筆訂單資訊
@api_order.route('/api/order/<order_id>', methods=['GET'])
@jwt_required(optional=True)
def get_order_info(order_id):
  current_identity = get_jwt_identity()
  if not current_identity:
    return jsonify({
        "error": True,
        "message": "未登入"
    }), 403
  else:
    user_data = get_jwt()
    member_id = user_data['id']
    order_info = get_order_info_from_db(member_id, order_id)
  return jsonify({
      "data": render_order_info(order_info)
  }), 200


# 取得會員的所有訂單資訊
@api_order.route('/api/order', methods=['GET'])
@jwt_required(optional=True)
def get_member_order():
  current_identity = get_jwt_identity()
  if not current_identity:
    return jsonify({
        "error": True,
        "message": "未登入"
    }), 403
  else:
    user_data = get_jwt()
    member_id = user_data['id']
    order_info = get_order_info_from_db(member_id)
    return jsonify({
        "data": render_order_info(order_info)
    }), 200
