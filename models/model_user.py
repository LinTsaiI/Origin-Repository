from models.db_pool import connection_pool

# Model: 確認 email 是否已存在
def is_member(email):
  db = connection_pool.get_connection()
  cursor = db.cursor()
  cursor.execute('SELECT email FROM member WHERE email=%s;', (email,))
  data = cursor.fetchone()
  cursor.close()
  db.close()
  return data

# Model: 將新的 user 加入 member 表單
def create_user(name, email, password):
  db = connection_pool.get_connection()
  cursor = db.cursor()
  cursor.execute('INSERT INTO member(name, email, password) VALUES (%s, %s, %s);', (name, email, password))
  cursor.close()
  db.commit()
  db.close()

# Model: 取得 user id
def get_user_id(email):
  db = connection_pool.get_connection()
  cursor = db.cursor()
  cursor.execute('SELECT id FROM member WHERE email=%s;', (email,))
  id = cursor.fetchone()[0]
  cursor.close()
  db.close()
  return id

# Model: 確認 email 及 password 是否正確
def authenticate_user(email, password):
  db = connection_pool.get_connection()
  cursor = db.cursor()
  cursor.execute('SELECT id, email, password FROM member WHERE email=%s AND password=%s;', (email, password))
  data = cursor.fetchone()
  cursor.close()
  db.close()
  return data