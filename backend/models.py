from flask import Flask, jsonify, request
from flask_cors import CORS
import numpy as np
import json
import pandas as pd

columns_needed = [
    "stop_datetime",
    "latitude",
    "longitude",
    "perceived_race_ethnicity",
    "perceived_gender",
    "perceived_age_group",
]
df = pd.read_csv(
    "backend/sf_traffic_data_cleaned.csv", usecols=columns_needed, low_memory=False
)

# Get unique groups for each column
ethnicity_groups = df["perceived_race_ethnicity"].unique().tolist()
gender_groups = df["perceived_gender"].unique().tolist()
age_groups = df["perceived_age_group"].unique().tolist()

# Print the results
print("Ethnicity Groups:", ethnicity_groups)
print("Gender Groups:", gender_groups)
print("Age Groups:", age_groups)
