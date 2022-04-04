from flask import Blueprint, request, jsonify
from flask_jwt_extended import *
from models.model_order import create_order, pay_successfully, get_order_info_from_db, delete_exist_booking
from views.view_booking import render_order_info
import requests
from datetime import datetime
import random

api_order = Blueprint('api_order', __name__)

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
    price = order['price']
    attraction_id = order['trip']['attraction']['id']
    date = order['trip']['date']
    time = order['trip']['time']
    contact_name = order['contact']['name']
    contact_email = order['contact']['email']
    phone_number = order['contact']['phone']
    if not prime or not contact_name or not contact_email or not phone_number:
      return jsonify({
          "error": True,
          "message": "訂單建立失敗，請確認資訊輸入正確再重新建立訂單"
      }), 400
    else:
      user_data = get_jwt()
      member_id = user_data['id']
      current_datetime = datetime.now()
      random_number = str(int(round(random.random()*1000000, 6)))
      order_id = current_datetime.strftime("%Y%m%d%H%M%S")+'-'+random_number
      create_order(order_id, member_id, contact_name, contact_email, phone_number, attraction_id, date, time, price)
      headers = {
          "Content-Type": "application/json",
          "x-api-key": "partner_6ID1DoDlaPrfHw6HBZsULfTYtDmWs0q0ZZGKMBpp4YICWBxgK97eK3RM"
      }
      payload = {
          "prime": prime,
          "partner_key": "partner_6ID1DoDlaPrfHw6HBZsULfTYtDmWs0q0ZZGKMBpp4YICWBxgK97eK3RM",
          "merchant_id": "GlobalTesting_CTBC",
          "details": "台北一日遊訂購行程",
          "amount": price,
          "cardholder": {
              "phone_number": phone_number,
              "name": contact_name,
              "email": contact_email,
          }
      }
      response = requests.post('https://sandbox.tappaysdk.com/tpc/payment/pay-by-prime', json=payload, headers=headers)
      if response.json()['status'] != 0:
        delete_exist_booking(member_id, attraction_id, date, time)
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
        delete_exist_booking(member_id, attraction_id, date, time)
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
    


@api_order.route('/api/order/<order_id>', methods=['GET'])
@jwt_required(optional=True)
def get_order_id(order_id):
  current_identity = get_jwt_identity()
  if not current_identity:
    return jsonify({
        "error": True,
        "message": "未登入"
    }), 403
  else:
    user_data = get_jwt()
    member_id = user_data['id']
    order_info = get_order_info_from_db(order_id, member_id)
  return jsonify({
    "data": render_order_info(order_info)
  }), 200