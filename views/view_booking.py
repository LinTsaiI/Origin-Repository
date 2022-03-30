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