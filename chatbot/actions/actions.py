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

# Thông tin kết nối MongoDB
mongo_url = "mongodb+srv://nguyendat16111210:8SZuXNP8TzhjtGgt@cluster0.pj4bngd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
db_name = "test"

# Kết nối đến MongoDB
client = MongoClient(mongo_url)
db = client[db_name]

class ActionSearchJobs(Action):
    def name(self) -> Text:
        return "action_search_jobs"

    def run(self, dispatcher: CollectingDispatcher, 
            tracker: Tracker, 
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        try:
            experience_year = tracker.get_slot('experience_year')
            position = tracker.get_slot('position')
            skill = tracker.get_slot('skill')
            location = tracker.get_slot('location')

            if experience_year is None:
                dispatcher.utter_message(text="Vui lòng cung cấp số năm kinh nghiệm.")
                return []
            
            print(experience_year)
            print(position)
            print(skill)
            print(location)

        except Exception as e:
            dispatcher.utter_message(text=f"Có lỗi xảy ra khi truy vấn dữ liệu: {str(e)}")

        finally:
            client.close()

        return []



class ActionSearchJobByLocation(Action):
    def name(self) -> Text:
        return "action_job_search_by_location"

    def run(self, dispatcher: CollectingDispatcher, 
            tracker: Tracker, 
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        try:
            location = tracker.get_slot('location')

            print(location)

            if not location:
                dispatcher.utter_message(template="utter_ask_location")
                return []
            
            location_lower = location.lower()

            if location_lower in ["sài gòn", "thành phố hồ chí minh", "tp hcm", "hcm", "tp.hcm", "hồ chí minh", "sg"]:
                city_name = "Thành phố Hồ Chí Minh"
            elif location_lower in ["hà nội", "hn", "hanoi", "ha noi",]:
                city_name = "Thành phố Hà Nội"
            elif location_lower in ["đà nẵng", "danang", "da nang", "đn", "đà nẽng", 'dn']:
                city_name = "Thành phố Đà Nẵng"
            else:
                city_name = location

            Job = db['jobs']
            jobs = Job.aggregate([
                {
                    "$lookup": {
                        "from": "addresses",
                        "localField": "workRegion",
                        "foreignField": "_id",
                        "as": "address_info"
                    }
                },
                {
                    "$unwind": "$address_info"
                },
                {
                    "$match": {
                        "address_info.province": city_name
                    }
                }
            ])

            jobsResult = []
            for doc in jobs:
                job_info = {
                    "recruitmentTitle": doc.get("recruitmentTitle"),
                    "skills": doc.get("skills"),
                    "companyLogo": None
                }

                employer_id = doc.get("employerId")
                if employer_id:
                    employer_doc = db.employers.find_one({"_id": employer_id})
                    if employer_doc:
                        job_info["companyLogo"] = employer_doc.get("companyLogo")

                jobsResult.append(job_info)
            
            payload = {
                "text": f"Có {len(jobsResult)} công việc tại {city_name}: ",
                "jobs": jobsResult
            }

            dispatcher.utter_message(json_message=payload)

        except Exception as e:
            dispatcher.utter_message(text=f"Có lỗi xảy ra khi truy vấn dữ liệu: {str(e)}")

        finally:
            client.close()

        return []
    
class ActionInquireCompaniesByEmployeeCount(Action):
    def name(self) -> Text:
        return "action_inquire_companies_by_employee_count"

    def run(self, dispatcher: CollectingDispatcher, 
            tracker: Tracker, 
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        try:

            employee_count = tracker.get_slot('employee_count')

            print(employee_count)

            if not employee_count:
                dispatcher.utter_message(template="utter_ask_employee_count")
                return []
            
            # size_map = {
            #     "100": "100 - 499 nhân viên",
            #     "500": "500 - 1000 nhân viên",
            #     "1000": "1000+ nhân viên",
            #     "3000+": "3000+ nhân viên",
            #     "5000+": "5000+ nhân viên",
            # }
            
            # company_size = size_map.get(employee_count)
            # if not company_size:
            #     dispatcher.utter_message(text="Số lượng nhân viên không hợp lệ. Vui lòng nhập lại.")
            #     return []

            # Employer = db['employers']
            # companies = Employer.find({"companySize": company_size})

            # unique_companies = []
            # for company in companies:
            #     unique_companies.append({
            #         "companyName": company.get("companyName"),
            #         "companyIndustry": company.get("companyIndustry"),
            #         "companyLogo": company.get("companyLogo"),
            #         "websiteUrl": company.get("websiteUrl")
            #     })

            # if unique_companies:
            #     payload = {
            #         "text": f"Các công ty có số lượng nhân viên {employee_count} là:",
            #         "employers": unique_companies
            #     }
            #     dispatcher.utter_message(json_message=payload)
            # else:
            #     dispatcher.utter_message(text=f"Không tìm thấy công ty nào có số lượng nhân viên {employee_count}.")

        except Exception as e:
            dispatcher.utter_message(text=f"Có lỗi xảy ra khi truy vấn dữ liệu: {str(e)}")

        finally:
            client.close()

        return []
    
class ActionSearchJobByExperienceYear(Action):
    def name(self) -> Text:
        return "action_search_jobs_by_experience"

    def run(self, dispatcher: CollectingDispatcher, 
            tracker: Tracker, 
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        try:

            experience_year = tracker.get_slot('experience_year')

            if experience_year is None:
                dispatcher.utter_message(text="Vui lòng cung cấp số năm kinh nghiệm.")
                return []
            
            print(experience_year)

            experience_year = int(experience_year)

            if(experience_year == 0): 
                experience_year = 0.5

            Job = db['jobs']
            jobs = Job.find({
                "experience": {"$lte": experience_year}
            })

            jobsResult = []
            for doc in jobs:
                job_info = {
                    "_id": str(doc.get("_id")),
                    "recruitmentTitle": doc.get("recruitmentTitle"),
                    "skills": doc.get("skills"),
                    "companyLogo": None
                }

                employer_id = doc.get("employerId")
                if employer_id:
                    employer_doc = db.employers.find_one({"_id": employer_id})
                    if employer_doc:
                        job_info["companyLogo"] = employer_doc.get("companyLogo")

                jobsResult.append(job_info)
            
            payload = {
                "text": f"Có {len(jobsResult)} công việc dành cho {experience_year} năm kinh nghiệm: ",
                "jobs": jobsResult
            }

            dispatcher.utter_message(json_message=payload)

        except Exception as e:
            dispatcher.utter_message(text=f"Có lỗi xảy ra khi truy vấn dữ liệu: {str(e)}")

        finally:
            client.close()

        return []