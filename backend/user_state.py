#Root Directory in System Path
import sys, os
root_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '../'))
if root_path not in sys.path:
    sys.path.append(root_path)

from flask import Blueprint, jsonify, request
from werkzeug.security import generate_password_hash, check_password_hash
from backend.central import calculate_level, collection

login_bp = Blueprint('login', __name__)
logout_bp = Blueprint('logout', __name__)
register_bp = Blueprint('register', __name__)

@login_bp.route('/login', methods=['POST'])
def login():
    print(f"\n🟢 User initiated login request...")
    data = request.get_json()
    username = data["username"]
    password = data["password"]
    if not username or not password:
        return jsonify({'error': 'Missing required fields'}), 400

    document = collection.find_one({"username": username})
    if document is None: collection.find_one({"email": username})
    if document is None:
        return jsonify({"error": "User Not Found"}), 401
    elif not check_password_hash(document.get("password"), password):
        return jsonify({"error": "Password is Incorrect"}), 401
    else:
        return jsonify({"user_id": document["user_id"],"user_email": document["email"], "username": document["username"]}), 200

@register_bp.route('/register', methods=['POST'])
def register():
    print(f"\n🟢 User initiated register request...")
    data = request.get_json()
    if not data.get("username"):
        print("Registration failed")
        return jsonify({'error': 'Registration failed or cancelled.'}), 401
    username = data["username"]
    email = data["email"]
    phone = data["phone"]
    referral = data.get("referral_code")
    if not username or not email:
        return jsonify({'error': 'Missing required fields'}), 400

    if collection.find_one({"$or": [{"username": username}, {"email": email}, {"phone": phone}]}):
        return jsonify({"error": "User already exists with the same username, email, or phone"}), 409

    if referral:
        referrer = collection.find_one({"referral_code": referral})
        if referrer:
            new_points = referrer.get("points", 0) + 50
            new_level = calculate_level(new_points)
            collection.update_one( {"_id": referrer["_id"]}, {"$set": {"points": new_points, "level": new_level}})

    import uuid
    data["user_id"] = str(uuid.uuid4())
    lower = data["username"].lower().replace(" ", "")
    data["referral_code"] = lower + "2025"
    data["donations"] = 0
    data["points"] = 0
    data["level"] = 1
    data["password"] = generate_password_hash(data["password"])
    data.pop("userType", None)
    collection.insert_one(data)
    return jsonify({"message": "Registration Successful"}), 200