from mysql.connector import pooling

connection_pool = pooling.MySQLConnectionPool(
    pool_name='taipei_day_trip_pool',
    pool_size=5,
    pool_reset_session=True,
    host='localhost',
    port=3306,
    user='root',
    password='mysqlpassword',
    database='taipei_day_trip'
)
