from flask import Blueprint, request, jsonify

api_order = Blueprint('api_order', __name__)

@api_order('/api/order', methods=['POST'])
def create_orders():
  return


@api_order('/api/order', methods=['GET'])
def get_order_id():
  return