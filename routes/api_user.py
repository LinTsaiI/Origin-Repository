from flask import Blueprint, request, jsonify, make_response
from routes.db_pool import connection_pool

api_user = Blueprint('api_user', __name__)

@api_user('/api/user', methods=['GET'])
def get_user:


@api_user('/api/user', methods=['POST'])
def signup:


@api_user('/api/user', methods=['PATCH'])
def signin:

@api_user('api/user', methods=['DELETE'])
def signout: