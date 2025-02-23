from flask import Flask, jsonify, request
from flask_cors import CORS
import numpy as np
import json
import pandas as pd

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

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

df["stop_datetime"] = pd.to_datetime(df["stop_datetime"], format="%Y-%m-%d %H:%M:%S")


df["date"] = df["stop_datetime"].dt.date
df["hour"] = df["stop_datetime"].dt.hour
df["year"] = df["stop_datetime"].dt.year
df["month"] = df["stop_datetime"].dt.month
df["day"] = df["stop_datetime"].dt.day

# Filter out rows with missing longitude or latitude
df["longitude"] = pd.to_numeric(df["longitude"], errors="coerce")
df["latitude"] = pd.to_numeric(df["latitude"], errors="coerce")
df = df.dropna(subset=["longitude", "latitude"])


def filter_heatmap_data(age_group=None, race=None, gender=None):
    filtered_df = df.copy()

    if age_group:
        filtered_df = filtered_df[filtered_df["perceived_age_group"] == age_group]
    if race:
        filtered_df = filtered_df[filtered_df["perceived_race_ethnicity"] == race]
    if gender:
        filtered_df = filtered_df[filtered_df["perceived_gender"] == gender]

    return filtered_df


def filterByTime(df):
    all_data = {}

    # 1. Overall Data (Single JSON)
    overall_data = [
        {
            "latitude": row["latitude"],
            "longitude": row["longitude"],
            "time_label": row["stop_datetime"].strftime("%Y-%m-%d %H:%M:%S"),
        }
        for _, row in df.iterrows()
    ]
    all_data["overall"] = overall_data

    # 2. Data Separated by Year (2018 - 2023)
    years = range(2018, 2024)
    year_data = {}
    for year in years:
        year_data[year] = [
            {
                "latitude": row["latitude"],
                "longitude": row["longitude"],
                "time_label": row["stop_datetime"].strftime("%Y-%m-%d %H:%M:%S"),
            }
            for _, row in df[df["year"] == year].iterrows()
        ]
    all_data["yearly"] = year_data

    # 3. Data Separated by Half-Year (e.g., 2018 H1: Jan-Jun, 2018 H2: Jul-Dec)
    half_year_ranges = [
        ((2018, 7, 1), (2018, 12, 31)),  # H2 for 2018
        ((2019, 1, 1), (2019, 6, 30)),  # H1 for 2019
        ((2019, 7, 1), (2019, 12, 31)),  # H2 for 2019
        ((2020, 1, 1), (2020, 6, 30)),  # H1 for 2020
        ((2020, 7, 1), (2020, 12, 31)),  # H2 for 2020
        ((2021, 1, 1), (2021, 6, 30)),  # H1 for 2021
        ((2021, 7, 1), (2021, 12, 31)),  # H2 for 2021
        ((2022, 1, 1), (2022, 6, 30)),  # H1 for 2022
        ((2022, 7, 1), (2022, 12, 31)),  # H2 for 2022
        ((2023, 1, 1), (2023, 6, 30)),  # H1 for 2023
        ((2023, 7, 1), (2023, 12, 31)),  # H2 for 2023
    ]

    half_year_data = {}
    for start_date, end_date in half_year_ranges:
        start = pd.Timestamp(f"{start_date[0]}-{start_date[1]}-{start_date[2]}")
        end = pd.Timestamp(f"{end_date[0]}-{end_date[1]}-{end_date[2]}")

        half_year_data[f"{start_date[0]}_H{start_date[1]//6+1}"] = [
            {
                "latitude": row["latitude"],
                "longitude": row["longitude"],
                "time_label": row["stop_datetime"].strftime("%Y-%m-%d %H:%M:%S"),
            }
            for _, row in df[
                (df["stop_datetime"] >= start) & (df["stop_datetime"] <= end)
            ].iterrows()
        ]
    all_data["half_year"] = half_year_data

    # Define the monthly ranges
    month_ranges = [
        (2018, 8, 1, 2018, 12, 31),  # August 2018 - December 2018
        (2019, 1, 1, 2019, 12, 31),  # Full year of 2019
        (2020, 1, 1, 2020, 12, 31),  # Full year of 2020
        (2021, 1, 1, 2021, 12, 31),  # Full year of 2021
        (2022, 1, 1, 2022, 12, 31),  # Full year of 2022
        (2023, 1, 1, 2023, 12, 31),  # Full year of 2023
    ]

    month_data = {}

    # Loop over the ranges and generate data for each month
    for (
        start_year,
        start_month,
        start_day,
        end_year,
        end_month,
        end_day,
    ) in month_ranges:
        start_date = pd.Timestamp(f"{start_year}-{start_month}-{start_day}")
        end_date = pd.Timestamp(f"{end_year}-{end_month}-{end_day}")

        # Generate all months between the start and end date
        current_date = start_date
        while current_date <= end_date:
            # Change the month label to numeric format (e.g., "01_2023", "02_2023", ...)
            month_label = current_date.strftime("%m_%Y")  # Numeric month format
            month_data[month_label] = [
                {
                    "latitude": row["latitude"],
                    "longitude": row["longitude"],
                    "time_label": row["stop_datetime"].strftime("%Y-%m-%d %H:%M:%S"),
                }
                for _, row in df[
                    (df["stop_datetime"] >= current_date)
                    & (df["stop_datetime"] < current_date + pd.DateOffset(months=1))
                ].iterrows()
            ]
            # Move to the next month
            current_date += pd.DateOffset(months=1)

    # Now `month_data` contains all the months with the correct data
    all_data["monthly"] = month_data  # Add monthly data to the existing all_data
    return jsonify(all_data)


@app.route("/api/heatmap-data", methods=["GET"])
def get_heatmap_data():
    # Read the JSON file
    with open("backend/heatmap_data/heatmap_data.json", "r") as file:
        heatmap_data = json.load(file)

    return jsonify(heatmap_data)


@app.route("/api/filter-heatmap", methods=["GET"])
def get_filtered_heatmap():
    """Filters data based on query parameters for age, race, and age group."""
    age_group = request.args.get("age")  # Example: "26-35"
    race = request.args.get("race")  # Example: "White"
    gender = request.args.get("gender")

    filtered_data = filter_heatmap_data(age_group, race, gender)

    return filterByTime(filtered_data)


if __name__ == "__main__":
    app.run(debug=True, port=5000)
