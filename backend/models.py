import pandas as pd
import numpy as np
from sklearn.svm import OneClassSVM
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score
import matplotlib.pyplot as plt

df = pd.read_csv("backend/data.csv")


# Prepare the data (use features as necessary)
X = df[
    [
        "longitude",
        "latitude",
        "perceived_race_ethnicity",
        "perceived_gender",
        "duration_of_stop",
    ]
]

# Normalize the features
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# One-Class SVM for anomaly detection (learning only from the positive class)
model = OneClassSVM(nu=0.1, kernel="rbf", gamma="scale")
model.fit(X_scaled)

# Predict anomalies (1 for normal, -1 for anomaly)
y_pred = model.predict(X_scaled)

# Results (1 indicates traffic stop-like behavior, -1 indicates outlier or no traffic stop)
print("Predictions (1: Likely Stop, -1: Unlikely Stop):", y_pred)
