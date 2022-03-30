from models.db_pool import connection_pool

# Model: 建立新的預定
def create_booking_into_db(member_id, attraction_id, date, time, price):
  db = connection_pool.get_connection()
  cursor = db.cursor()
  cursor.execute('''
    INSERT INTO booking(member_id, attraction_id, date, time, price)
    VALUES(%s, %s, %s, %s, %s);
  ''', (member_id, attraction_id, date, time, price))
  cursor.close()
  db.commit()
  db.close()

# Model: 取得已建立的行程
def get_booking_from_db(member_id):
  db = connection_pool.get_connection()
  cursor = db.cursor()
  cursor.execute('''
    SELECT booking.*, taipei_attractions.name, taipei_attractions.address, (
      SELECT url FROM attraction_imgs WHERE attraction_id=taipei_attractions.id LIMIT 1) AS image
    FROM booking
    LEFT JOIN taipei_attractions
    ON booking.attraction_id = taipei_attractions.id
    WHERE member_id =%s;
  ''', (member_id,))
  booking_info = cursor.fetchone()
  cursor.close()
  db.close()
  if not booking_info:
    return None
  else:
    return booking_info


# Model: 刪除已建立的行程
def delete_booking_from_db(member_id):
  db = connection_pool.get_connection()
  cursor = db.cursor()
  cursor.execute('DELETE FROM booking WHERE member_id=%s;', (member_id,))
  cursor.close()
  db.commit()
  db.close()


# SELECT booking.*, taipei_attractions.name, taipei_attractions.address, (SELECT GROUP_CONCAT(url) FROM attraction_imgs GROUP BY attraction_id HAVING attraction_id=taipei_attractions.id LIMIT 1) AS image FROM booking LEFT JOIN taipei_attractions ON booking.attraction_id = taipei_attractions.id WHERE member_id = 16

# SELECT booking.*, taipei_attractions.name, taipei_attractions.address, (SELECT url FROM attraction_imgs WHERE attraction_id=taipei_attractions.id LIMIT 1) AS image FROM booking LEFT JOIN taipei_attractions ON booking.attraction_id = taipei_attractions.id WHERE member_id = 16
