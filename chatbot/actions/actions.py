from typing import Any, Text, Dict, List
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
from pymongo import MongoClient
import json
from datetime import datetime
import requests
from pymongo.collection import Collection
from pymongo.errors import ServerSelectionTimeoutError
from bson.json_util import dumps
import re

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
        cursor = db['users'].find()

        # Gửi thông tin tới người dùng
        user_data = "\n".join([f"{index + 1}. {document}" for index, document in enumerate(cursor)])
        dispatcher.utter_message(text=f"Here is the list of all users:\n{user_data}")

        return []

class ActionFindJobAtCompany(Action):
    def name(self) -> Text:
        return "action_find_job_at_company"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        company_entity = next(tracker.get_latest_entity_values("company"), None)

        api_url = f"http://localhost:5000/api/v1/job/get-list-jobs?companyName={company_entity}"

        try:
            response = requests.get(api_url)

            if response.status_code == 200:
                data = response.json()

                json_message = {
                    "response_type": "job_list",
                    "entities": company_entity,
                    "jobs": data,
                }
                dispatcher.utter_message(json_message=json_message)
            else:
                dispatcher.utter_message(text="API trả về mã lỗi không thành công")
        except Exception as e:
            dispatcher.utter_message(text="Có lỗi xảy ra khi gọi API")

        return []


class ActionListCompanyInSystem(Action):
    def name(self) -> Text:
        return "action_list_company_in_system"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        try:
            mongo_url = "mongodb+srv://nguyendat16111210:8SZuXNP8TzhjtGgt@cluster0.pj4bngd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
            db_name = "test"

            client = MongoClient(mongo_url)
            db = client[db_name]

            Employer: Collection = db['employers'] 

            employers = Employer.find({}, {"companyName": 1, "companyLogo": 1, "_id": 1})

            company_list = []
            for company in employers:
                company_info = {
                    "_id": str(company["_id"]),
                    "companyName": company["companyName"],
                    "companyLogo": company["companyLogo"]
                }
                company_list.append(company_info)
            
            payload = {
                "type": "employer_list",
                "text": "Danh sách các công ty đăng ký hoạt động trên hệ thống:",
                "employers": company_list
            }

            dispatcher.utter_message(json_message=payload)

        except Exception as e:
            error_message = {"recipient_id": "bot", "text": f"Có lỗi xảy ra khi truy vấn dữ liệu: {str(e)}"}
            dispatcher.utter_message(json_message=error_message)

        finally:
            client.close()

        return []
    
class ActionRecruitmentTrendInSystem(Action):
    def name(self) -> Text:
        return "action_recruitment_trend_in_system"

    def shorten_id(self, id):
        switcher = {
            "Back-end Developer": "BE",
            "Full-stack Developer": "Full-stack",
            "UI/UX Designer": "UI/UX",
            "Mobile App Developer": "Mobile",
            "Android Developer": "Android",
            "Mobile Developer (Native App/React Native)": "Mobile",
            "AI Engineer": "AI"
        }
        return switcher.get(id, id) 

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        try:
            mongo_url = "mongodb+srv://nguyendat16111210:8SZuXNP8TzhjtGgt@cluster0.pj4bngd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
            db_name = "test"

            client = MongoClient(mongo_url)
            db = client[db_name]
            job_collection = db['jobs']

            pipeline = [
                {"$unwind": "$skills"},
                {"$group": {"_id": "$skills", "value": {"$sum": 1}}},
                {"$sort": {"value": -1}},
                {"$limit": 7}
            ]

            skillsTrends = list(job_collection.aggregate(pipeline))

            for trend in skillsTrends:
                trend["_id"] = self.shorten_id(trend["_id"])

            pipeline = [
                {"$unwind": "$jobPosition"},
                {"$group": {"_id": "$jobPosition", "value": {"$sum": 1}}},
                {"$sort": {"value": -1}},
                {"$limit": 7}
            ]

            jobPositionsTrends = list(job_collection.aggregate(pipeline))

            for trend in jobPositionsTrends:
                trend["_id"] = self.shorten_id(trend["_id"])

            payload = {
                "text": "Theo dữ liệu được thống kê trên hệ thống, xu hướng các công nghệ và theo vị trí trên hệ thống như sau: ",
                "charts": [skillsTrends, jobPositionsTrends]
            }

            dispatcher.utter_message(json_message=payload)

        except Exception as e:
            error_message = {"recipient_id": "bot", "text": f"Có lỗi xảy ra khi truy vấn dữ liệu: {str(e)}"}
            dispatcher.utter_message(json_message=error_message)

        finally:
            client.close()

        return []

class ActionSearchJob(Action):
    def name(self) -> Text:
        return "action_search_job"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        try:
            mongo_url = "mongodb+srv://nguyendat16111210:8SZuXNP8TzhjtGgt@cluster0.pj4bngd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
            client = MongoClient(mongo_url, serverSelectionTimeoutMS=5000)
            db = client.test
            job_collection = db.jobs 

            job_type = next(tracker.get_latest_entity_values("job_type"), None)
            skill = next(tracker.get_latest_entity_values("skill"), None)

            job_type_regex = re.compile(f".*{job_type}.*", re.IGNORECASE) if job_type else None
            skill_regex = re.compile(f".*{skill}.*", re.IGNORECASE) if skill else None

            title_options = {}
            if job_type_regex:
                title_options['$regex'] = job_type_regex
            if skill_regex:
                title_options['$regex'] = skill_regex

            query = {}
            if title_options:
                query['recruitmentTitle'] = title_options

            result = job_collection.find(query)

            jobsResult = []
            for doc in result:
                title = {
                    "recruitmentTitle": doc.get("recruitmentTitle"),
                    "skills": doc.get("skills"),
                    "companyLogo": None
                }

                employer_id = doc.get("employerId")
                if employer_id:
                    employer_doc = db.employers.find_one({"_id": employer_id})
                    if employer_doc:
                        title["companyLogo"] = employer_doc.get("companyLogo")

                jobsResult.append(title)
            
            payload = {
                "text": "Theo dữ liệu được thống kê trên hệ thống, xu hướng các công nghệ và theo vị trí trên hệ thống như sau: ",
                "jobs": jobsResult
            }

            dispatcher.utter_message(json_message=payload)

            

        except ServerSelectionTimeoutError:
            dispatcher.utter_message(text="Không thể kết nối đến cơ sở dữ liệu")

        except Exception as e:
            error_message = f"Có lỗi xảy ra khi truy vấn dữ liệu: {str(e)}"
            dispatcher.utter_message(text=error_message)

        finally:
            client.close()

        return []