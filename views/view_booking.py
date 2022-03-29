def render_booking_info(data):
    attraction_id = data[0][0]
    date = data[0][1]
    time = data[0][2]
    price = data[0][3]
    attraction_name = data[1][0]
    address = data[1][1]
    image = data[1][2]
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