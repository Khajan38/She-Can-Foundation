#Root Directory in System Path
import sys, os
root_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '../'))
if root_path not in sys.path:
    sys.path.append(root_path)

import pymongo
from dotenv import load_dotenv
load_dotenv()
mongo_uri = os.getenv("MONGO_URI")
if not mongo_uri: raise ValueError("MONGO_URI not set in environment variables")
mongo_client = pymongo.MongoClient(mongo_uri)
db = mongo_client["She-Can-Foundation"]
collection = db["interns"]

def calculate_level(points):
    level_scale = [(1, 0), (2, 100), (3, 250), (4, 500), (5, 1000), (6, 2000)]
    level = 1
    for lvl, req_points in level_scale:
        if points >= req_points: level = lvl
        else: break
    return level