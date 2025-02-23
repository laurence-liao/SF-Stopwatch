import matplotlib.pyplot as plt
import pandas as pd
import numpy as np
from sklearn.svm import OneClassSVM
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score
import matplotlib.pyplot as plt

df = pd.read_csv("backend/data.csv", nrows=1000, low_memory=False)


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

# Convert duration_of_stop to numeric (handle errors if any non-numeric values exist)
df["duration_of_stop"] = pd.to_numeric(df["duration_of_stop"], errors="coerce")

# Group by race and calculate the mean stop duration
avg_duration = df.groupby("perceived_race_ethnicity")["duration_of_stop"].mean()

# Display results
print(avg_duration)
