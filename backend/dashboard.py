#Root Directory in System Path
import sys, os
root_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '../'))
if root_path not in sys.path:
    sys.path.append(root_path)

import pymongo
from dotenv import load_dotenv
from flask import Blueprint, jsonify, request
from werkzeug.security import generate_password_hash, check_password_hash
load_dotenv()
mongo_uri = os.getenv("MONGO_URI")
if not mongo_uri: raise ValueError("MONGO_URI not set in environment variables")

def calculate_level(points):
    level_scale = [(1, 0), (2, 100), (3, 250), (4, 500), (5, 1000), (6, 2000)]
    level = 1
    for lvl, req_points in level_scale:
        if points >= req_points: level = lvl
        else: break
    return level

getData_bp = Blueprint('getData', __name__)

@getData_bp.route('/getData', methods=['GET'])
def getData():
    username = request.args.get("username")
    if not username:
        return jsonify({'error': 'Missing required fields'}), 400

    mongo_client = pymongo.MongoClient(mongo_uri)
    db = mongo_client["She-Can-Foundation"]
    collection = db["interns"]
    document = collection.find_one({"username": username}, {"_id": 0, "username": 1, "referral_code": 1, "level": 1, "points": 1, "donations": 1})
    mongo_client.close()
    if not document:
        return jsonify({'error': 'User not found'}), 404
    return jsonify(document)

@getData_bp.route('/getPoints', methods=['GET'])
def getPoints():
    username = request.args.get("username")
    if not username:
        return jsonify({'error': 'Missing required fields'}), 400

    mongo_client = pymongo.MongoClient(mongo_uri)
    db = mongo_client["She-Can-Foundation"]
    collection = db["interns"]
    document = collection.find_one({"username": username}, {"_id": 0, "points": 1})
    mongo_client.close()
    if not document:
        return jsonify({'error': 'User not found'}), 404
    return jsonify(document)