from flask import Flask, jsonify, request
from flask_cors import CORS
import numpy as np
import json
import pandas as pd
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, accuracy_score
from sklearn.linear_model import LogisticRegression
import seaborn as sns
import matplotlib.pyplot as plt

from sklearn.model_selection import StratifiedKFold, GridSearchCV
from sklearn.ensemble import RandomForestClassifier

param_grid = {
    "n_estimators": [50, 100],  # Reduced number of estimators
    "max_depth": [None, 10],  # Reduced depth options
    "min_samples_split": [2, 5],  # Reduced split options
    "min_samples_leaf": [1, 2],  # Reduced leaf options
    "bootstrap": [True],  # Keep it simple
}

columns_needed = [
    "stop_datetime",
    "latitude",
    "longitude",
    "perceived_race_ethnicity",
    "perceived_gender",
    "perceived_age_group",
    "results_of_stop",
]
df = pd.read_csv(
    "backend/sf_traffic_data_cleaned.csv", usecols=columns_needed, low_memory=False
)
# Convert 'stop_datetime' to datetime format
df["stop_datetime"] = pd.to_datetime(df["stop_datetime"])

# Extract time-related features
df["year"] = df["stop_datetime"].dt.year
df["month"] = df["stop_datetime"].dt.month
df["hour"] = df["stop_datetime"].dt.hour
df["weekday"] = df["stop_datetime"].dt.weekday
df["minute"] = df["stop_datetime"].dt.minute

# Group into 4-hour bins
df["hour_group"] = (df["hour"] // 4) * 4

# Weekday/Weekend indicator (1 for weekend, 0 for weekday)
df["is_weekend"] = (df["weekday"] >= 5).astype(int)

# Cyclic encoding for hour
df["hour_sin"] = np.sin(2 * np.pi * df["hour"] / 24)
df["hour_cos"] = np.cos(2 * np.pi * df["hour"] / 24)


# Season based on month
def get_season(month):
    if month in [12, 1, 2]:
        return "Winter"
    elif month in [3, 4, 5]:
        return "Spring"
    elif month in [6, 7, 8]:
        return "Summer"
    else:
        return "Fall"


df["season"] = df["month"].apply(get_season)

df.drop(columns=["stop_datetime"], inplace=True)

# One-hot encode categorical variables: 'season', 'hour_group', 'weekday', etc.
df_encoded = pd.get_dummies(
    df, columns=["season", "hour_group", "weekday"], drop_first=True
)


# Define a function to group results_of_stop into categories
def group_stop_results(row):
    result = row["results_of_stop"]

    # Define groupings based on the unique combinations you provided
    if "Citation for infraction" in result:
        return "Citations"
    elif "Warning" in result:
        return "Warnings"
    elif "Custodial arrest" in result:
        return "Arrests"
    elif "In-field cite and release" in result:
        return "In-Field Citations & Release"
    elif "Field interview card completed" in result:
        return "Field Interviews / Cards"
    elif "Psychiatric hold" in result:
        return "Psychiatric Holds"
    elif "Noncriminal or caretaking transport" in result:
        return "Noncriminal or Caretaking Transport"
    elif "Contacted U.S. Department of Homeland Security" in result:
        return "Contact with Authorities"
    else:
        return "Other Miscellaneous Actions"


# Apply the function to the 'results_of_stop' column
df["stop_group"] = df.apply(group_stop_results, axis=1)

# Filter out the rare categories before encoding
df = df[
    ~df["stop_group"].isin(
        [
            "Contact with Authorities",
            "Psychiatric Holds",
            "Noncriminal or Caretaking Transport",
            "Field Interviews / Cards",
        ]
    )
]

# One-hot encode the 'stop_group' column
stop_group_encoded = pd.get_dummies(df["stop_group"], prefix="stop_group")

# One-hot encode the categorical columns: 'perceived_age_group', 'race', 'gender'
age_encoded = pd.get_dummies(df["perceived_age_group"], prefix="age")
race_encoded = pd.get_dummies(df["perceived_race_ethnicity"], prefix="race")
gender_encoded = pd.get_dummies(df["perceived_gender"], prefix="gender")

# Concatenate all the one-hot encoded columns to the original dataframe
df_encoded = pd.concat(
    [df_encoded, stop_group_encoded, age_encoded, race_encoded, gender_encoded], axis=1
)

# Drop the original categorical columns if they are no longer needed
df_encoded.drop(
    columns=[
        "perceived_age_group",
        "perceived_race_ethnicity",
        "perceived_gender",
        "results_of_stop",
    ],
    inplace=True,
)

df_encoded = df_encoded.dropna()
# Define the features (X) and target (y)
X = df_encoded.drop(
    columns=[
        "stop_group_Citations",
        "stop_group_Warnings",
        "stop_group_Arrests",
        "stop_group_In-Field Citations & Release",
        "stop_group_Other Miscellaneous Actions",
    ]
)
y = df_encoded[
    [
        "stop_group_Citations",
        "stop_group_Warnings",
        "stop_group_Arrests",
        "stop_group_In-Field Citations & Release",
        "stop_group_Other Miscellaneous Actions",
    ]
].idxmax(axis=1)

# Split the data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

stratified_kfold = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)

# Initialize and train the Random Forest Classifier
rf = RandomForestClassifier(n_estimators=100, random_state=42)
grid_search = GridSearchCV(
    estimator=rf, param_grid=param_grid, cv=stratified_kfold, n_jobs=-1, verbose=2
)

# Fit GridSearchCV to the data
grid_search.fit(X_train, y_train)

# Print the best parameters
print(f"Best parameters: {grid_search.best_params_}")

# Evaluate on the test set
y_pred = grid_search.predict(X_test)
print(f"Accuracy: {accuracy_score(y_test, y_pred)}")
print("\nClassification Report:")
print(classification_report(y_test, y_pred))


importances = grid_search.best_estimator_.feature_importances_
feature_names = X_train.columns

# Sort feature importance values
indices = np.argsort(importances)[::-1]

# Print sorted feature importance
for i in range(len(feature_names)):
    print(f"{feature_names[indices[i]]}: {importances[indices[i]]:.4f}")

# Plot feature importance
plt.figure(figsize=(10, 6))
sns.barplot(x=importances[indices], y=[feature_names[i] for i in indices])
plt.xlabel("Feature Importance")
plt.ylabel("Feature Name")
plt.title("Feature Importance in Random Forest")
plt.show()

"""
# Initialize the Logistic Regression model
log_reg = LogisticRegression(max_iter=1000, multi_class="multinomial", solver="lbfgs")

# Train the model
log_reg.fit(X_train, y_train)

# Make predictions
y_pred = log_reg.predict(X_test)

# Evaluate the model
print(f"Accuracy: {accuracy_score(y_test, y_pred)}")
print("\nClassification Report:")
print(classification_report(y_test, y_pred))
"""
