from models.db_pool import connection_pool

# Model: 搜尋含有關鍵字的景點
def get_keyword_attractions(page, keyword):
  db = connection_pool.get_connection()
  cursor = db.cursor()
  cursor.execute('''
        SELECT taipei_attractions.*,
              (SELECT GROUP_CONCAT(url) FROM attraction_imgs GROUP BY attraction_id HAVING attraction_id=taipei_attractions.id) AS images
        FROM taipei_attractions
        WHERE name LIKE concat('%', %s, '%') LIMIT %s, 13;
    ''', (keyword, page*12))
  results = cursor.fetchall()
  cursor.close()
  db.close()
  return results   # 得到一個結果 list，其中資料為 tuple 型態


# Model: 根據頁數取得景點資訊
def get_attractions_without_keyword(page):
  db = connection_pool.get_connection()
  cursor = db.cursor()
  cursor.execute('''
      SELECT taipei_attractions.*,
            (SELECT GROUP_CONCAT(url) FROM attraction_imgs GROUP BY attraction_id HAVING attraction_id=taipei_attractions.id) AS images
      FROM taipei_attractions
      ORDER BY id LIMIT %s, %s;
  ''', (page*12, 13))
  results = cursor.fetchall()
  cursor.close()
  db.close()
  return results   # 取13個景點資料


# Model: 根據 id 取得景點資訊
def get_attraction_by_id(attractionId):
  db = connection_pool.get_connection()
  cursor = db.cursor()
  cursor.execute('''
      SELECT taipei_attractions.*,
            (SELECT GROUP_CONCAT(url) FROM attraction_imgs GROUP BY attraction_id
            HAVING attraction_id=taipei_attractions.id)
            AS images
      FROM taipei_attractions
      WHERE taipei_attractions.id=%s;
    ''', (attractionId,))
  result = cursor.fetchall()
  cursor.close()
  db.close()
  return result