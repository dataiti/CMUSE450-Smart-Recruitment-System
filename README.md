### Intelligence IT Job Finding - The Recruitment System support with Chatbot

**Mô tả dự án**:  

The agile product backlog in Scrum is a prioritized features list, containing short descriptions of all functionalities desired in the product. When applying Scrum, it’s not necessary to start a project with a lengthy, upfront effort to document all requirements. Typically, a Scrum team and its product owner begin by writing down everything they can think of for agile backlog prioritization. This agile product backlog is almost always more than enough for a first sprint. The Scrum product backlog is then allowed to grow and change as more is learned about the product.

  - **Công nghệ sử dụng**: NodeJS, ReactJS, MongoDB, Javascript, Python, Rasa, Socket.io, ExpressJS, Redux Toolkit Query, Material-Tailwind, ...
  
  - **Host**:

    + Server:         http://localhost:5000

    + Chatbot server: http://localhost:5005

    + Client:         http://localhost:3000

    + Employer:       http://localhost:3001

    + Admin:          http://localhost:3002
  
  - **Tool sử dụng**: Jira, Figma, Google Driver, Postman, VS Code, Git, ...
  
  - **Ảnh màn hình**: 
  ![image](https://github.com/dataiti/CMUSE450-Capstone1-Smart-Recruitment-System/assets/104474689/795579f9-d77b-4b19-937e-b112e757bebc)

## Version
Pip:    pip 24.0
Python: Python 3.9.0
Node:   v18.18.0
## Cách cài đặt
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
