from flask import Blueprint, request, jsonify, session
from models.model_user import is_member, create_user, get_user_id, authenticate_user
api_user = Blueprint('api_user', __name__)

# Controller: 查詢會員資料
@api_user.route('/api/user', methods=['GET'])
def get_user():
  if 'email' not in session:
      return jsonify({
          "data": None
      }), 200
  else:
    member_id = session['id']
    name = session['name']
    email = session['email']
    return jsonify({
        "data": {
            "id": member_id,
            "name": name,
            "email": email
        }
    }), 200


# Controller: 註冊會員
@api_user.route('/api/user', methods=['POST'])
def signup():
  try:
    name = request.json.get('name')
    email = request.json.get('email')
    password = request.json.get('password')
    data = is_member(email)
    if data:
      return jsonify({
          "error": True,
          "message": "Email已經被註冊"
      }), 400
    else:
      create_user(name, email, password)
      member_id = get_user_id(email)
      session['id'] = member_id
      session['name'] = name
      session['email'] = email
      session['password'] = password
      return jsonify({
          "ok": True
      }), 200
  
  except Exception as e:
    print(e)
    return jsonify({
        "error": True,
        "message": "系統性錯誤，請稍後再試"
    }), 500


# Controller: 登入會員系統
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
        return jsonify({
            "ok": True
        }), 200
      else:
        return jsonify({
            "error": True,
            "message": "帳號或密碼輸入錯誤"
        }), 400
  except Exception as e:
    print(e)
    return jsonify({
        "error": True,
        "message": "系統性錯誤，請稍後再試"
    }), 500


# Controller: 登出會員系統
@api_user.route('/api/user', methods=['DELETE'])
def signout():
  session.pop('id', None)
  session.pop('name', None)
  session.pop('email', None)
  return jsonify({
      "ok": True
  }), 200
