import pandas as pd
import folium as folium
from folium.plugins import HeatMapWithTime

columns_needed = ['stop_datetime', 'latitude', 'longitude', 'reason_for_stop','perceived_age_group','perceived_gender','perceived_race_ethnicity']
df = pd.read_csv("backend/data.csv", usecols=columns_needed,nrows=10000,low_memory=False)
df = df[df['reason_for_stop'] == 'Traffic violation']

df['stop_datetime'] = pd.to_datetime(df['stop_datetime'])

df['date'] = df['stop_datetime'].dt.date
df['hour'] = df['stop_datetime'].dt.hour

df['longitude'] = pd.to_numeric(df['longitude'], errors='coerce')
df['latitude'] = pd.to_numeric(df['latitude'], errors='coerce')
df = df.dropna(subset=['longitude', 'latitude'])

df = df.sort_values(by=['date', 'hour'])

time_groups = df.groupby(['date', 'hour'])

heatmap_data = []
time_labels = []

for (date, hour), group in time_groups:
    heatmap_data.append(group[['latitude', 'longitude']].values.tolist())
    time_labels.append(f"{date} - {hour}:00")


sf_map = folium.Map(location=[37.7749, -122.4194], zoom_start=12)

HeatMapWithTime(heatmap_data, index=time_labels, radius=10, auto_play=True, max_opacity=0.6).add_to(sf_map)

sf_map.save("sf_stops_heatmap_with_time.html")