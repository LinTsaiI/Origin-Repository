from flask import Blueprint, request, jsonify, make_response
from routes.db_pool import connection_pool

api_booking = Blueprint('api_booking', __name__)


@api_user('/api/booking', methods=['GET'])
def get_booking:


@api_user('/api/booking', methods=['POST'])
def create_booking:


@api_user('api/booking', methods=['DELETE'])
def delete_booking:
