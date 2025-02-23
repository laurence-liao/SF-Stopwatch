from flask import Flask, jsonify
from flask_cors import CORS
import numpy as np
import json

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes


@app.route("/api/heatmap-data", methods=["GET"])
def get_heatmap_data():
    # Read the JSON file
    with open("backend/heatmap_data/heatmap_data.json", "r") as file:
        heatmap_data = json.load(file)

    return jsonify(heatmap_data)


if __name__ == "__main__":
    app.run(debug=True, port=5000)
