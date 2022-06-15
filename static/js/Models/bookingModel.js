// Model: 取得預定行程資訊
function getBookingInfo() {
  return fetch('/api/booking', {
    method: 'GET',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
      'X-csrf-token': document.cookie.split('csrf_access_token=')[1]
    }
  })
    .then(response => response.json())
    .then(result => bookingInfo = result)
}
