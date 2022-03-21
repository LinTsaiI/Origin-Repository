from flask import Blueprint, request, jsonify, make_response, session
from models.model_user import is_member, create_user, get_user_id, authenticate_user
from models.db_pool import connection_pool
api_user = Blueprint('api_user', __name__)


@api_user.route('/api/user', methods=['GET'])
def get_user():
  if 'email' not in session:
      return make_response(jsonify({
          "data": None
      }), 200)
  else:
    id = session['id']
    name = session['name']
    email = session['email']
    return make_response(jsonify({
        "data": {
            "id": id,
            "name": name,
            "email": email
        }
    }), 200)


@api_user.route('/api/user', methods=['POST'])
def signup():
  try:
    name = request.json.get('name')
    email = request.json.get('email')
    password = request.json.get('password')
    data = is_member(email)
    if data:
      return make_response(jsonify({
          "error": True,
          "message": "Email已經被註冊"
      }), 400)
    else:
      create_user(name, email, password)
      id = get_user_id(email)
      session['id'] = id
      session['name'] = name
      session['email'] = email
      session['password'] = password
      return make_response(jsonify({
          "ok": True
      }), 200)
  
  except Exception as e:
    print(e)
    return make_response(jsonify({
        "error": True,
        "message": "系統性錯誤，請稍後再試"
    }), 500)


@api_user.route('/api/user', methods=['PATCH'])
def signin():
  try:
    email = request.json.get('email')
    password = request.json.get('password')
    if email != '' and password != '':
      data = authenticate_user(email, password)
      if data:
        session['id'] = data[0]
        session['name'] = data[1]
        session['email'] = data[2]
        return make_response(jsonify({
            "ok": True
        }), 200)
      else:
        return make_response(jsonify({
            "error": True,
            "message": "帳號或密碼輸入錯誤"
        }), 400)
  except Exception as e:
    print(e)
    return make_response(jsonify({
        "error": True,
        "message": "系統性錯誤，請稍後再試"
    }), 500)


@api_user.route('/api/user', methods=['DELETE'])
def signout():
  session.pop('id', None)
  session.pop('name', None)
  session.pop('email', None)
  return make_response(jsonify({
      "ok": True
  }), 200)
