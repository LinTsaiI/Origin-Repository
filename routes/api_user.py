from flask import Blueprint, request, jsonify, session
from flask_jwt_extended import *
from models.model_user import is_member, create_user, get_user_id, authenticate_user
api_user = Blueprint('api_user', __name__)

# Controller: 查詢會員資料
@api_user.route('/api/user', methods=['GET'])
# 訪問此路徑需要 JWT。optional 設定 True 表示無論是否有 token 都可以訪問，設定 False 則在沒有 token 時會直接擋掉
@jwt_required(optional=True)
def get_user():
  current_identity = get_jwt_identity()   # 取得 jwt identity (email)
  if not current_identity:
      return jsonify({
          "data": None
      }), 200
  else:
    user_data = get_jwt()   # 取得 additional_claims 中的資訊
    return jsonify({
        "data": {
            "id": user_data['id'],
            "name": user_data['name'],
            "email": user_data['email']
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
      response = jsonify({
          "ok": True
      })
      user_data = {
          "id": member_id,
          "name": name,
          "email": email
      }
      access_token = create_access_token(identity=email, additional_claims=user_data)
      set_access_cookies(response, access_token)
      return response, 200
  
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
        response = jsonify({
            "ok": True
        })
        user_data = {
            "id": data[0],
            "name": data[1],
            "email": data[2]
        }
        # 確認為正確的 user 後，產生一組 token，以 email 作為 token 的識別
        # 額外附加的內容放在 additional_claims 中
        access_token = create_access_token(identity=email, additional_claims=user_data)
        # 修改 response，設定 cookie
        set_access_cookies(response, access_token)
        return response, 200
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
  response = jsonify({
      "ok": True
  })
  # 修改 response，將包含 JWT 的 cookies 及對應的 CSRF cookies 刪除
  unset_jwt_cookies(response)
  return response, 200
