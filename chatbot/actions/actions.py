from rasa_sdk import Action
from rasa_sdk.events import SlotSet
from pymongo import MongoClient

def connect_to_mongodb():
    try:
        client = MongoClient("mongodb+srv://nguyendat16111210:8SZuXNP8TzhjtGgt@cluster0.pj4bngd.mongodb.net/")
        if client:
            db = client.your_database_name  # Thay "your_database_name" bằng tên cơ sở dữ liệu của bạn
            print("Connected to MongoDB successfully.")
            return db
        else:
            raise Exception("MongoDB connection failed.")
    except Exception as e:
        print(f"Failed to connect to MongoDB. Error: {str(e)}")
        raise Exception("MongoDB connection failed.")

def query_data_from_mongodb(collection_name, query):
    try:
        db = connect_to_mongodb()
        if db:
            collection = db[collection_name]
            result = collection.find(query)
            return result
        else:
            raise Exception("MongoDB connection not available.")
    except Exception as e:
        print(f"Error querying MongoDB. Error: {str(e)}")
        raise Exception("Error querying MongoDB.")
    
class GetAllUsersAction(Action):
    def name(self):
        return "action_get_all_users"

    def run(self, dispatcher, tracker, domain):
        try:
            db = connect_to_mongodb()
            if db:
                query = {}  # Truy vấn tất cả người dùng
                result = query_data_from_mongodb("user", query)  # Sử dụng collection "user"

                print("result", result)

                # Xử lý kết quả và gửi phản hồi về cho người dùng
                if result and isinstance(result, list):
                    user_data = [f"{index + 1}. {document}" for index, document in enumerate(result)]
                    if user_data:
                        response_message = f"Here is the list of all users:\n{', '.join(user_data)}"
                    else:
                        response_message = "No users found."
                else:
                    response_message = "Error querying user data from MongoDB."

                dispatcher.utter_message(response_message)
            else:
                dispatcher.utter_message("Failed to connect to MongoDB.")
        except Exception as e:
            # Xử lý trường hợp lỗi kết nối đến MongoDB
            dispatcher.utter_message(f"An error occurred: {str(e)}")

        return []
    


connect_to_mongodb()