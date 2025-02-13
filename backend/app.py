from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import json

app = Flask(__name__)
CORS(app)

# Function to load JSON data
def load_data(filename):
    if not os.path.exists(filename):
        return []
    with open(filename, "r") as file:
        return json.load(file)

# Function to save JSON data
def save_data(filename, data):
    with open(filename, "w") as file:
        json.dump(data, file, indent=4)

# Path to the JSON file
PREFERENCES_FILE = "preference.json"

@app.route("/save-preferences", methods=["POST"])
def save_preferences():
    try:
        data = request.get_json()
        selected_products = data.get("selectedProducts", [])

        # Save to JSON file
        with open(PREFERENCES_FILE, "w") as f:
            json.dump({"selectedProducts": selected_products}, f, indent=4)

        return jsonify({"message": "Preferences saved successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Function to update search history
def update_search_history(user_id, search_query):
    search_history = load_data("search_history.json")

    # Check if user exists in history
    user_entry = next((entry for entry in search_history if entry["user_id"] == user_id), None)

    if user_entry:
        user_entry["searched"].insert(0, search_query)  # Prepend instead of append
        user_entry["searched"] = user_entry["searched"][:5]  # Keep only the last 5 searches
    else:
        search_history.insert(0, {"user_id": user_id, "searched": [search_query]})  # Prepend new user entry


    save_data("search_history.json", search_history)

# Function to update purchase history
# def update_purchase_history(user_id, purchased_item):
#     purchase_history = load_data("purchase_history.json")

#     # Check if user exists in history
#     user_entry = next((entry for entry in purchase_history if entry["user_id"] == user_id), None)

#     if user_entry:
#         user_entry["purchases"].insert(0, purchased_item)  # Prepend new purchase at the start
#         user_entry["purchases"] = user_entry["purchases"][:5]  # Keep only the last 5 purchases

#     else:
#         purchase_history.insert(0, {"user_id": user_id, "purchases": [purchased_item]})  # Add new user entry

#     save_data("purchase_history.json", purchase_history)
@app.route("/get_purchase_history", methods=["POST"])
def get_purchase_history():
    data = request.json
    user_id = data.get("user_id")

    purchase_history = load_data("purchase_history.json")
    user_entry = next((entry for entry in purchase_history if entry["user_id"] == user_id), None)

    return jsonify({"purchase_history": user_entry["purchases"] if user_entry else []})




# Function to update user preferences based on browsing/purchases
def update_user_preferences(user_id, category):
    users = load_data("users.json")

    # Find the user
    user_entry = next((u for u in users if u["user_id"] == user_id), None)

    if user_entry:
        if category not in user_entry["interests"]:
            user_entry["interests"].append(category)  # Add new category preference
    else:
        users.append({"user_id": user_id, "interests": [category]})

    save_data("users.json", users)

# API to log search history
@app.route("/log_search", methods=["POST"])
def log_search():
    data = request.json
    user_id = data.get("user_id")
    search_query = data.get("search_query")

    update_search_history(user_id, search_query)
    return jsonify({"message": "Search logged successfully"})

# API to log purchase history
@app.route("/log_purchase", methods=["POST"])
def log_purchase():
    data = request.json
    user_id = data.get("user_id")
    purchased_item = data.get("purchased_item")
    category = data.get("category")

    update_purchase_history(user_id, purchased_item)
    update_user_preferences(user_id, category)
    return jsonify({"message": "Purchase logged successfully"})



# API to recommend products based on purchase & search history
@app.route("/recommend", methods=["POST"])
def recommend():
    data = request.json
    user_id = data.get("user_id")

    # Load data
    users = load_data("users.json")
    products = load_data("product.json")
    purchases = load_data("purchase_history.json")
    searches = load_data("search_history.json")

    # Find user info
    user = next((u for u in users if u["user_id"] == user_id), None)

    if not user:
        return jsonify({"error": "User not found"}), 404

    # Handle Cold Start Users
    if not user_purchases and not user_searches:
        recommended_products = [p for p in products if p["category"] in user_interests]

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

@app.route('/')  # Define a route
def hello_world():
    return "Hello, World!"  # Return response

if __name__ == "__main__":
    app.run(debug=True, port=5000)
