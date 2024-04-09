### Intelligence IT Job Finding - The Recruitment System support with Chatbot

**Mô tả dự án**:  

"Intelligence IT Job Finding - The Recruitment System support with Chatbot", sử dụng thuật toán gợi ý ứng viên phù hợp với yêu cầu của nhà tuyển dụng và gợi ý công việc phù hợp cho nhà tuyển dụng, ứng viên, bên cạnh đó tích hợp bot chat để gợi ý cách viết CV cho ứng viên. Chatbots sẽ giúp cung cấp thông tin chi tiết về vị trí công việc, yêu cầu công việc và sự phù hợp về kỹ năng của ứng viên, hỗ trợ trong quá trình đánh giá kỹ năng của ứng viên bằng cách cung cấp các câu đố hoặc bài kiểm tra trực tuyến. Điều này giúp tối ưu hóa quy trình tuyển dụng và nâng cao chất lượng nguồn nhân lực trong hệ thống tuyển dụng.

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

**Version**
Pip:    pip 24.0

Python: Python 3.9.0

Node:   v18.18.0

**Cách cài đặt**

  - đối với server
    + cd server -> npm install -> npm start 
  - đối với client
    + cd client -> npm install --force -> npm start
  - đối với employer
    + cd employer -> npm install -> npm start
  - đối với admin
    + cd admin -> npm install -> npm start
  - đối với chatbot server
    + bật 2 terminal để chạy server và chạy actions
  
    + terminal 1: cd chatbot -> python -m rasa run --endpoints endpoints.yml --model models --enable-api --cors "*"
  
    + terminal 2: cd chatbot -> python -m rasa run actions --actions actions
