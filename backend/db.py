import os
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_DB")
DB_NAME = os.getenv("DB_NAME")

client = MongoClient(MONGO_URI, server_api=ServerApi('1'))
db = client[DB_NAME]

def get_collection(name):
    return db[name]
