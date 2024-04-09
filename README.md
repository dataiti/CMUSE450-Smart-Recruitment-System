## CMUSE450-Capstone1-Smart-Recruitment-System
# đối với server
cd server -> npm install -> npm start 
# đối với client
cd client -> npm install --force -> npm start
# đối với employer
cd employer -> npm install -> npm start
# đối với admin
cd admin -> npm install -> npm start
# đối với chatbot server
bật 2 terminal để chạy server và chạy actions
terminal 1: cd chatbot -> python -m rasa run --endpoints endpoints.yml --model models --enable-api --cors "*"
terminal 2: cd chatbot -> python -m rasa run actions --actions actions
