from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# Sample user purchase data
data = {
    "User": [101, 101, 102, 103, 103],
    "Product": ["A", "B", "A", "C", "D"]
}
df = pd.DataFrame(data)

# Create User-Item Matrix
user_item_matrix = df.pivot_table(index='User', columns='Product', aggfunc=lambda x: 1, fill_value=0)

# Compute similarity
similarity_matrix = cosine_similarity(user_item_matrix)

# Function to recommend products for a given user
def get_recommendations(user_id):
    if user_id not in user_item_matrix.index:
        return ["Popular Product 1", "Popular Product 2"]  # Cold start handling

    user_index = user_item_matrix.index.tolist().index(user_id)
    similar_users = similarity_matrix[user_index].argsort()[::-1][1:3]  # Get top similar users
    recommended_products = set()

    for user in similar_users:
        recommended_products.update(user_item_matrix.iloc[user].index[user_item_matrix.iloc[user] > 0])

    return list(recommended_products)[:5]

# API endpoint
@app.route('/recommend/<int:user_id>', methods=['GET'])
def recommend(user_id):
    recommendations = get_recommendations(user_id)
    return jsonify({"user_id": user_id, "recommendations": recommendations})

if __name__ == '__main__':
    app.run(debug=True)
