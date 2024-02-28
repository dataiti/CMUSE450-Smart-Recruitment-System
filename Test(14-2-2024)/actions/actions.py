from typing import Any, Text, Dict, List
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
from pymongo import MongoClient

class ActionGetAllUsers(Action):
    def name(self) -> Text:
        return "action_get_all_users"

    def run(self, dispatcher: CollectingDispatcher, tracker: Tracker, domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        # Thông tin kết nối MongoDB
        mongo_url = "mongodb+srv://nguyendat16111210:8SZuXNP8TzhjtGgt@cluster0.pj4bngd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
        db_name = "test"

        # Kết nối đến MongoDB
        client = MongoClient(mongo_url)
        db = client[db_name]

        # Truy vấn tất cả documents trong collection "user"
        # cursor = db['users'].find()

        cursor = db['users'].find({"firstName":"Thế Duyệt"})

        # Gửi thông tin tới người dùng
        user_data = "\n".join([f"{index + 1}. {document}" for index, document in enumerate(cursor)])
        dispatcher.utter_message(text=f"Here is the list of all users:\n{user_data}")

        return []