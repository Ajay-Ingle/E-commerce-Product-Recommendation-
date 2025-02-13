from flask import Flask, request, jsonify
from flask_cors import CORS
import json

app = Flask(__name__)
CORS(app)

# Load JSON data
def load_data(filename):
    with open(filename, "r") as file:
        return json.load(file)

# API to recommend products based on purchase & search history
@app.route("/recommend", methods=["POST"])
def recommend():
    data = request.json
    user_id = data.get("user_id")

    # Load data
    users = load_data("users.json")
    products = load_data("products.json")
    purchases = load_data("purchase_history.json")
    searches = load_data("search_history.json")

    # Find user info
    user = next((u for u in users if u["user_id"] == user_id), None)

    if not user:
        return jsonify({"error": "User not found"}), 404

    # Get user interests
    user_interests = set(user.get("interests", []))

    # Get user purchase & search history
    user_purchases = next((p["purchased"] for p in purchases if p["user_id"] == user_id), [])
    user_searches = next((s["searched"] for s in searches if s["user_id"] == user_id), [])

    # Find recommended products
    recommended_products = [
        p for p in products
        if p["category"] in user_interests or p["name"] in user_purchases or p["name"] in user_searches
    ]

    return jsonify({"recommended": recommended_products})

if __name__ == "__main__":
    app.run(debug=True, port=5000)
