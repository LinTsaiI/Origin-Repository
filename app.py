from flask import *
from flask_jwt_extended import JWTManager
from routes.api_attractions import api_attractions
from routes.api_user import api_user
from routes.api_booking import api_booking
from routes.api_order import api_order
import os
app=Flask(__name__)
jwt = JWTManager(app)   # 啟用 JWT
app.secret_key = os.urandom(24)
app.config["JSON_AS_ASCII"] = False
app.config["TEMPLATES_AUTO_RELOAD"] = True
app.config['JSON_SORT_KEYS'] = False
app.config['JWT_TOKEN_LOCATION'] = ['cookies']   # 設定存放 JWT 的位置，預設是 headers
app.config['JWT_COOKIE_SECURE'] = False

app.register_blueprint(api_attractions)
app.register_blueprint(api_user)
app.register_blueprint(api_booking)
app.register_blueprint(api_order)

# Pages
@app.route("/")
def index():
	return render_template("index.html")
@app.route("/attraction/<id>")
def attraction(id):
	return render_template("attraction.html")
@app.route("/booking")
def booking():
	return render_template("booking.html")
@app.route("/thankyou")
def thankyou():
	return render_template("thankyou.html")


app.run(host='0.0.0.0', port=3000, debug=True)
