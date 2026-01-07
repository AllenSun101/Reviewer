from flask import Flask, request, Response
from flask_cors import CORS
import db
from search import score_locations
from bson import json_util

app = Flask(__name__)
CORS(app)

@app.route("/CreateUser", methods=["POST"])
def create_user():
    data = request.get_json()
    email = data.get("email")
    name = data.get("name")
    users = db.get_collection("Users")

    account = users.find_one({"email": email})

    if not account:
        account = users.insert_one({"name": name, "email": email, "reviews": []})

    return {"status": "success", "account": account}

@app.route("/GetUserProfile", methods=["GET"])
def get_user_profile():
    email = request.args.get("email")
    users = db.get_collection("Users")
    account = users.find_one({"email": email})

    if not account:
        return {"status": "fail"}
    return {"status": "success", "account": account}

@app.route("/AddPlace", methods=["POST"])
def add_place():
    data = request.get_json()
    name = data.get("name")
    address = data.get("address")
    categories = data.get("categories")
    places = db.get_collection("Places")
    
    place = places.find_one({"address": address})

    if place:
        return {"status": "fail"}
    
    places.insert_one({"name": name, "address": address, "categories": categories, "reviews": [], 
                       "review_keywords": {}})
    return {"status": "success"}

@app.route("/ModifyPlace", methods=["POST"])
def modify_place():
    data = request.get_json()
    name = data.get("name")
    address = data.get("address")
    categories = data.get("categories")
    places = db.get_collection("Places")
    
    place = places.find_one({"address": address})

    if place:
        places.update_one({"name": name, "address": address, "categories": categories})
    else:
        places.insert_one({"name": name, "address": address, "categories": categories, "reviews": [], 
                       "review_keywords": {}})
    return {"status": "success"}

@app.route("/GetAddSearchResults", methods=["GET"])
def get_add_search_results():
    place = request.args.get("place")
    locations = list(db.get_collection("Places").find())
    locations_scored = [x[0] for x in score_locations(place, locations)]
    return Response(
        json_util.dumps(locations_scored),
        mimetype="application/json"
    )

@app.route("/GetRatingSearchResults", methods=["GET"])
def get_rating_search_results():
    preference_weights = request.args.get("preference_weights")
    place = request.args.get("place")
    locations = db.get_collection("Places").distinct("name")
    most_similar_locations = score_locations(place, locations)

    # Preference weights
    # weight * keyword

    # if not exact keyword match, find similar
    # also have to account for semantic similarities
    # if no data at all, drop the weight, or we can do confidence interval based on what's available

    return 0

@app.route("/AddReview", methods=["POST"])
def add_review():
    data = request.get_json()
    keywords = data.get("keywords")
    review = data.get("review")
    name = data.get("name")
    email = data.get("email")

    users = db.get_collection("Users")
    user = users.find_one({"email": email})
    user["reviews"].append([keywords, review])
    users.update_one({"email": email}, user)

    places = db.get_collection("Places")
    place = places.find_one({"name": name})
    review_keywords = place["review_keywords"]

    for keyword, rating in keywords.items():
        if keyword in review_keywords:
            review_keywords[keyword].append(rating)
        else:
            review_keywords[keyword] = [rating]
    
    place["review_keywords"] = review_keywords
    places.update_one({"name": name}, place)

    return {"status": "success"}

@app.route("/ModifyReview", methods=["POST"])
def modify_review():
    data = request.get_json()
    keywords = data.get("keywords")
    review = data.get("review")
    name = data.get("name")
    email = data.get("email")

    # update user reviews
    # update review keywords with differences in user review

@app.route('/')
def home():
    return "Hello, Flask!"

if __name__ == '__main__':
    app.run(debug=True)
