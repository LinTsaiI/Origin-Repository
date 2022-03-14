from flask import Blueprint, request, jsonify, make_response
from routes.db_pool import connection_pool

api_order = Blueprint('api_order', __name__)

@api_order('/api/order', methods=['POST'])
def create_orders:


@api_order('/api/order', methods=['GET'])
def get_order_id: