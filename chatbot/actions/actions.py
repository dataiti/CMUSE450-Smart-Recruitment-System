from typing import Any, Text, Dict, List
from rasa_sdk import Action, Tracker
from rasa_sdk.events import SlotSet
from rasa_sdk.executor import CollectingDispatcher
from pymongo import MongoClient
from datetime import datetime

# Thông tin kết nối MongoDB
mongo_url = "mongodb+srv://nguyendat16111210:8SZuXNP8TzhjtGgt@cluster0.pj4bngd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
db_name = "test"

# Kết nối đến MongoDB
client = MongoClient(mongo_url)
db = client[db_name]

class ActionSearchJobBySkill(Action):
    def name(self) -> Text:
        return "action_search_job_by_skill"

    def run(self, dispatcher: CollectingDispatcher, 
            tracker: Tracker, 
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        try:
            skill = tracker.get_slot('skill')
            level = tracker.get_slot('level')

            print(level)
            print(skill)

            if skill is None:
                dispatcher.utter_message(text="Vui lòng cung cấp kỹ năng cần tìm.")
                return []
            
            skill_lower = skill.lower()
            Job = db['jobs']

            current_date = datetime.now()
            query = {
                "$and": [
                    {"$or": [
                        {"recruitmentTitle": {"$regex": skill_lower, "$options": "i"}},
                        {"skills": {"$in": [skill]}}
                    ]},
                    {"applicationDeadline": {"$gte": current_date}},
                    {"isHiring": True},
                    {"status": "active"},
                ]
            }

            if level:
                query["$and"].append({"level": {"$regex": level, "$options": "i"}})

            jobs = Job.find(query)

            jobsResult = []
            for doc in jobs:
                job_info = {
                    "_id": str(doc.get("_id")),
                    "recruitmentTitle": doc.get("recruitmentTitle"),
                    "skills": doc.get("skills"),
                    "level": doc.get("level"),
                    "companyLogo": None
                }

                employer_id = doc.get("employerId")
                if employer_id:
                    employer_doc = db.employers.find_one({"_id": employer_id})
                    if employer_doc:
                        job_info["companyLogo"] = employer_doc.get("companyLogo")

                jobsResult.append(job_info)
            
            payload = {
                "text": f"Có {len(jobsResult)} công việc yêu cầu kỹ năng {skill}: ",
                "jobs": jobsResult
            }

            dispatcher.utter_message(json_message=payload)
            
            return [SlotSet("level", None)]

        except Exception as e:
            dispatcher.utter_message(text="Xin lỗi! tôi không tìm thấy gì !")

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
                dispatcher.utter_message(text="Bạn muốn tìm việc ở đâu ?")
                return []
            
            current_date = datetime.now()

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
                        "address_info.province": {"$regex": location, "$options": "i"},
                        "applicationDeadline": {"$gte": current_date},
                        "isHiring": True,
                        "status": "active"
                    }
                }
            ])

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
                "text": f"Có {len(jobsResult)} công việc tại {location} dành cho bạn: ",
                "jobs": jobsResult
            }

            dispatcher.utter_message(json_message=payload)

            return [SlotSet("location", None)]

        except Exception as e:
            dispatcher.utter_message(text="Xin lỗi! Tôi không tìm thấy gì !")

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
                dispatcher.utter_message(text="Bạn muốn tìm doanh nghiệp với số lượng nhân viên là bao nhiêu?")
                return []
            
            employee_count = int(employee_count)

            companySize = {
                "extra_small": "10 - 24 nhân viên",
                "small": "25 - 99 nhân viên",
                "medium": "100 - 499 nhân viên",
                "base": "500 - 1000 nhân viên",
                "large": "1000+ nhân viên",
                "extra_large": "3000+ nhân viên",
                "big": "5000+ nhân viên",
            }

            if employee_count >= 0 and employee_count < 25:
                employee_size = companySize["extra_small"]
            elif employee_count >= 25 and employee_count < 100:
                employee_size = companySize["small"]
            elif employee_count >= 100 and employee_count < 500:
                employee_size = companySize["medium"]
            elif employee_count >= 500 and employee_count < 1000:
                employee_size = companySize["base"]
            elif employee_count >= 1000 and employee_count < 3000:
                employee_size = companySize["large"]
            elif employee_count >= 3000 and employee_count < 5000:
                employee_size = companySize["extra_large"]
            elif employee_count >= 5000:
                employee_size = companySize["big"]
            else:
                employee_size = None
            
            if not employee_size:
                dispatcher.utter_message(text="Bạn muốn tìm công ty với quy mô nhân viên là bao nhiêu nhỉ ?")
                return []

            Employer = db['employers']
            companies = Employer.find({"companySize": employee_size})

            unique_companies = []
            for company in companies:
                unique_companies.append({
                    "companyName": company.get("companyName"),
                    "companyIndustry": company.get("companyIndustry"),
                    "companyLogo": company.get("companyLogo"),
                    "websiteUrl": company.get("websiteUrl")
                })

            if unique_companies:
                payload = {
                    "text": f"Các công ty có số lượng nhân viên {employee_count} là:",
                    "employers": unique_companies
                }
                dispatcher.utter_message(json_message=payload)
            else:
                dispatcher.utter_message(text=f"Không tìm thấy công ty nào có số lượng nhân viên {employee_count}.")

        except Exception as e:
            dispatcher.utter_message(text="Xin lỗi! Tôi không tìm thấy gì !")

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

            current_date = datetime.now()

            Job = db['jobs']
            jobs = Job.find({
                "experience": {"$lte": experience_year},
                "applicationDeadline": {"$gte": current_date},
                "isHiring": True,
                "status": "active"
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
            dispatcher.utter_message(text="Xin lỗi! Tôi không tìm thấy gì !")

        finally:
            client.close()

        return []
    
class ActionSearchJobByPosition(Action):
    def name(self) -> Text:
        return "action_search_job_by_position"

    def run(self, dispatcher: CollectingDispatcher, 
            tracker: Tracker, 
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        try:

            position_entiry = next(tracker.get_latest_entity_values("job_type"), None)
            position = tracker.get_slot('position')

            print(position)

            if position is None:
                dispatcher.utter_message(text="Bạn muốn tìm việc ở vị trí nào ?")
                return []
            
            current_date = datetime.now()

            Job = db['jobs']
            jobs = Job.find({
                "jobPosition": {"$regex": position, "$options": "i"},
                "applicationDeadline": {"$gte": current_date},
                "isHiring": True,
                "status": "active"
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
                "text": f"Có {len(jobsResult)} công việc dành cho vị trí {position}: ",
                "jobs": jobsResult
            }

            dispatcher.utter_message(json_message=payload)

        except Exception as e:
            dispatcher.utter_message(text="Xin lỗi! Tôi không tìm thấy gì !")

        finally:
            client.close()

        return []
    
class ActionSearchJobBySalary(Action):
    def name(self) -> Text:
        return "action_search_job_by_salary"

    def run(self, dispatcher: CollectingDispatcher, 
            tracker: Tracker, 
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        try:

            salary = tracker.get_slot('salary')

            print(salary)

        except Exception as e:
            dispatcher.utter_message(text="Xin lỗi! Tôi không tìm thấy gì !")

        finally:
            client.close()

        return []
    
class ActionRecuitmentTrend(Action):
    def name(self) -> Text:
        return "action_recruitment_trend"
    
    def shorten_id(self, id):
        switcher = {
            "Back-end Developer": "BE",
            "Front-end Developer": "FE",
            "DevOps Engineer": "DevOps",
            "Full-stack Developer": "Fullstack",
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

            trendAspect = tracker.get_slot('trendAspect')
            trendType = tracker.get_slot('trendType')

            if trendAspect in ["công", "nghệ", "công nghệ"]:
                trendAspect = "skills"
            
            if trendType in ["thế"]:
                trendType = "market"

            print(trendAspect)
            print(trendType)

            if not trendAspect:
                trendAspect = 'skills'

            if not trendType:
                trendType = 'system'

            if trendType == 'market':
                dispatcher.utter_message(template="utter_market_trend_by_skill")
                return []
            
            else: 
                Job = db['jobs']

                pipeline = [
                    {"$unwind": f"${trendAspect}"},
                    {"$group": {"_id": f"${trendAspect}", "value": {"$sum": 1}}},
                    {"$sort": {"value": -1}},
                    {"$limit": 7}
                ]

                recruitmentTrendChart = list(Job.aggregate(pipeline))

                for trend in recruitmentTrendChart:
                    trend["_id"] = self.shorten_id(trend["_id"])


                payload = {
                    "text": "Theo dữ liệu được thống kê trên hệ thống, xu hướng các công nghệ và theo vị trí trên hệ thống như sau: ",
                    "charts": recruitmentTrendChart
                }

                dispatcher.utter_message(json_message=payload)

        except Exception as e:
            dispatcher.utter_message(text="Xin lỗi! Tôi không tìm thấy gì !")

        finally:
            client.close()

        return []