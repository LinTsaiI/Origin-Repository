# View: 生成行程列表
def trip_list(trips):
    trip_list = []
    for item in trips:
        trip = {
            "attraction": {
                "id": item[7],
                "name": item[14],
                "address": item[15],
                "image": item[16]
            },
            "date": str(item[8]),
            "time": item[9],
            "price": item[10]
        }
        trip_list.append(trip)
    return trip_list


# 畫出單一訂單編號的內容
def render_order_info(data):
    if not data:
        return None
    else:
        order_list = []
        for item in data:
            order_id = item[1]
            contact_name = item[3]
            contact_email = item[4]
            contact_phone = item[5]
            total_price = item[11]
            status = item[12]
            order_info = {
                "number": order_id,
                "total_price": total_price,
                "trip": {
                    "attraction": {
                        "id": item[7],
                        "name": item[14],
                        "address": item[15],
                        "image": item[16]
                    },
                    "date": str(item[8]),
                    "time": item[9],
                    "price": item[10]
                },
                "contact": {
                    "name": contact_name,
                    "email": contact_email,
                    "phone": contact_phone
                },
                "status": status
            }
            order_list.append(order_info)
        return order_list
