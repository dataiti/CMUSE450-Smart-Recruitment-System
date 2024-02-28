from flask import Flask, render_template, request, jsonify
import requests

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')  # Trả về trang chính của ứng dụng


# Route để gửi tin nhắn từ người dùng đến Rasa
@app.route('/send_message', methods=['POST'])
def send_message():
    message = request.json['message']

    # Gửi yêu cầu POST đến Rasa Server
    response = requests.post('http://localhost:5005/webhooks/rest/webhook', json={"message": message})

    # Lấy phản hồi từ Rasa Server
    bot_response = response.json()[0]['text']

    return jsonify(bot_response)
if __name__ == "__main__":
    app.run(debug=True)
