def render_booking_info(data):
    attraction_id = data[2]
    date = data[3]
    time = data[4]
    price = data[5]
    attraction_name = data[6]
    address = data[7]
    image = data[8]
    booking_info = {
        "attraction": {
            "id": attraction_id,
            "name": attraction_name,
            "address": address,
            "image": image
        },
        "date": str(date),
        "time": time,
        "price": price
    }
    return booking_info

def render_order_info(data):
    if not data:
        return None
    else:
        order_id = data[1]
        contact_name = data[3]
        contact_email = data[4]
        contact_phone = data[5]
        attraction_id = data[6]
        date = data[7]
        time = data[8]
        price = data[9]
        status = data[10]
        attraction_name = data[12]
        address = data[13]
        image = data[14]
        order_info = {
            "number": order_id,
            "price": price,
            "trip": {
                "attraction": {
                    "id": attraction_id,
                    "name": attraction_name,
                    "address": address,
                    "image": image
                },
                "date": str(date),
                "time": time
            },
            "contact": {
                "name": contact_name,
                "email": contact_email,
                "phone": contact_phone
            },
            "status": status
        }
        return order_info