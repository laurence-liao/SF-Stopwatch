from flask import Flask, jsonify
from flask_cors import CORS
import numpy as np

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes


@app.route("/api/heatmap-data", methods=["GET"])
def get_heatmap_data():
    # Example: Randomly generate heatmap data for demo purposes
    heatmap_data = [
        {
            "latitude": 37.7749,
            "longitude": -122.4194,
            "value": np.random.randint(1, 100),
        },
        {
            "latitude": 37.7750,
            "longitude": -122.4195,
            "value": np.random.randint(1, 100),
        },
        {
            "latitude": 37.7751,
            "longitude": -122.4196,
            "value": np.random.randint(1, 100),
        },
    ]
    return jsonify(heatmap_data)


if __name__ == "__main__":
    app.run(debug=True, port=5000)
