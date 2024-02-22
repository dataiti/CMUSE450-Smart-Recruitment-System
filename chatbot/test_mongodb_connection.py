from pymongo import MongoClient

# Thông tin kết nối MongoDB
mongo_url = "mongodb+srv://nguyendat16111210:8SZuXNP8TzhjtGgt@cluster0.pj4bngd.mongodb.net/"
db_name = "Capstone1-project"

# Kết nối đến MongoDB
client = MongoClient(mongo_url)
db = client[db_name]

# Collection cần truy vấn
collection_name = "job"

# Thực hiện truy vấn để lấy tất cả documents trong collection 'job'
cursor = db[collection_name].find()

# In kết quả
print(f"Danh sách tất cả các documents trong collection '{collection_name}':")
for document in cursor:
    print(document)
