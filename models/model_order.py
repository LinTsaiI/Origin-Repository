from models.db_pool import connection_pool

# 建立付款訂單
def create_order(order_id, member_id, contact_name, contact_email, contact_phone, attraction_id, date, time, price):
  db = connection_pool.get_connection()
  cursor = db.cursor()
  cursor.execute('''
    INSERT INTO `order`(order_id, member_id, contact_name, contact_email, contact_phone, attraction_id, date, time, price)
    VALUES(%s, %s, %s, %s, %s, %s, %s, %s, %s);
  ''', (order_id, member_id, contact_name, contact_email, contact_phone, attraction_id, date, time, price))
  cursor.close()
  db.commit()
  db.close()

# 付款成功，變更 status 為已付款
def pay_successfully(order_id):
  db = connection_pool.get_connection()
  cursor = db.cursor()
  cursor.execute('''
    UPDATE `order`
    SET status=0
    WHERE order_id=%s;
  ''', (order_id, ))
  cursor.close()
  db.commit()
  db.close()

# 取得付款/未付款訂單資訊
def get_order_info_from_db(order_id, member_id):
  db = connection_pool.get_connection()
  cursor = db.cursor()
  cursor.execute('''
    SELECT `order`.*, taipei_attractions.name, taipei_attractions.address, (
      SELECT url FROM attraction_imgs WHERE attraction_id=taipei_attractions.id LIMIT 1) AS image
    FROM `order`
    LEFT JOIN taipei_attractions
    ON `order`.attraction_id = taipei_attractions.id
    WHERE order_id=%s AND member_id=%s;
  ''', (order_id, member_id))
  order_info = cursor.fetchone()
  cursor.close()
  db.close()
  if not order_info:
    return None
  else:
    return order_info

# Model: 刪除 booking table 中已經完成付款的預定訂單
def delete_exist_booking(member_id, attraction_id, date, time):
  db = connection_pool.get_connection()
  cursor = db.cursor()
  cursor.execute('''
    DELETE FROM booking WHERE member_id=%s AND attraction_id=%s AND date=%s AND time=%s;
  ''', (member_id, attraction_id, date, time))
  cursor.close()
  db.commit()
  db.close()
