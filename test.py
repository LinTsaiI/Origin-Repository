from datetime import datetime
import random

current_datetime = datetime.now()
random_number = str(int(round(random.random(), 5)*1000000))
order_id = current_datetime.strftime("%Y%m%d%H%M%S")+random_number
print(random_number)
