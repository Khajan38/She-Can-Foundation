#Root Directory in System Path
import sys, os
root_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '../'))
if root_path not in sys.path:
    sys.path.append(root_path)

from pymongo import DESCENDING
from flask import Blueprint, jsonify, request
from backend.central import collection

getData_bp = Blueprint('getData', __name__)

@getData_bp.route('/getData', methods=['GET'])
def getData():
    username = request.args.get("username")
    if not username:
        return jsonify({'error': 'Missing required fields'}), 400
    document = collection.find_one({"username": username}, {"_id": 0, "username": 1, "referral_code": 1, "level": 1, "points": 1, "donations": 1})
    if not document:
        return jsonify({'error': 'User not found'}), 404
    return jsonify(document), 200

@getData_bp.route('/getPoints', methods=['GET'])
def getPoints():
    username = request.args.get("username")
    if not username:
        return jsonify({'error': 'Missing required fields'}), 400
    document = collection.find_one({"username": username}, {"_id": 0, "points": 1})
    if not document:
        return jsonify({'error': 'User not found'}), 404
    return jsonify(document), 200

@getData_bp.route('/getLeaderboard', methods=['GET'])
def getLeaderboard():
    try:
        top_users_cursor = collection.find().sort("points", DESCENDING).limit(10)
        top_users = list(top_users_cursor)
        ranked_users = []
        for index, user in enumerate(top_users):
            ranked_users.append({
                "rank": index + 1,
                "name": user.get("username", "Unknown"),
                "points": user.get("points", 0),
                "level": user.get("level", 0)
            })
        return jsonify(ranked_users), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500