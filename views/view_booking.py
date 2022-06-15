def create_booking_list(data):
    booking_list_combine =[]
    for booking in data:
        booking_id = booking[0]
        attraction_id = booking[2]
        date = booking[3]
        time = booking[4]
        price = booking[5]
        attraction_name = booking[7]
        address = booking[8]
        image = booking[9]
        booking_info = {
            "id": booking_id,
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
        booking_list_combine.append(booking_info)
    return booking_list_combine
