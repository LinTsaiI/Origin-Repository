from models.db_pool import connection_pool

# Model: 建立新的預定
def create_booking_into_db(name, email, attraction_id, date, time, price):
  db = connection_pool.get_connection()
  cursor = db.cursor()
  cursor.execute('''
    INSERT INTO booking(name, email, attraction_id, date, time, price)
    VALUES(%s, %s, %s, %s, %s, %s);
  ''', (name, email, attraction_id, date, time, price))
  cursor.close()
  db.commit()
  db.close()

# Model: 取得已建立的行程
def get_booking_from_db(email):
  db = connection_pool.get_connection()
  cursor = db.cursor()
  cursor.execute('''
    SELECT attraction_id, date, time, price FROM booking WHERE email=%s
  ''', (email,))
  booking_info = cursor.fetchone()
  if not booking_info:
    cursor.close()
    db.close()
    return None
  else:
    cursor.execute('''
      SELECT name, address,
        (SELECT url FROM attraction_imgs
        WHERE attraction_id=taipei_attractions.id LIMIT 1)
        AS image
      FROM taipei_attractions
      WHERE taipei_attractions.id=%s
    ;''', (booking_info[0],))
    attraction_info = cursor.fetchone()
    cursor.close()
    db.close()
    return [booking_info, attraction_info]


# Model: 刪除已建立的行程
def delete_booking_from_db(email):
  db = connection_pool.get_connection()
  cursor = db.cursor()
  cursor.execute('DELETE FROM booking WHERE email=%s;', (email,))
  cursor.close()
  db.commit()
  db.close()


# SELECT attraction_id, date, time, price FROM booking WHERE email = 'abc@gmail.com'
# SELECT id, name, address, (SELECT url FROM attraction_imgs WHERE attraction_id=taipei_attractions.id LIMIT 1) AS image FROM taipei_attractions WHERE taipei_attractions.id=booking.attraction_id) 

