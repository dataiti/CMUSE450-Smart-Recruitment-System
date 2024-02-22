from pymongo import MongoClient


mongo_url = "mongodb+srv://nguyendat16111210:8SZuXNP8TzhjtGgt@cluster0.pj4bngd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
db_name = "test"

client = MongoClient(mongo_url)
db = client[db_name]

cursor = db['users'].find()

for document in cursor:
    print(document)