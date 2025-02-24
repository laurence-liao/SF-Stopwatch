# SF Stopwatch
## Inspiration
We decided to pursue this project because stories of law enforcement making traffic stops purely off perceived characteristics constantly go viral on social media, and we wanted to test the validity of these claims to see whether these were merely case-specific incidents or indicative of a pattern that applied to the entire system as a whole. Furthermore, we wanted to see if there were factors beyond a person’s characteristics that would increase the likelihood of them being pulled over.

## What it does
Our web-app displays the number of traffic stops that have occurred between 2018-2023 in San Francisco. It has options for users to see how the number of traffic stops changes by time, race, gender, and age. Users are able to see areas in San Francisco that are more enforced and where to be more cautious while driving. 

## How we built it
For our exploratory data analysis, we used R and the tidyverse and ggplot libraries to preprocess our data and create our visualizations. For our web-app, we used React and Flask to create the frontend and the Folium and Leaflet.js Python library to create our heatmap. 

## Challenges we ran into
We initially spent too much time deciding on what we wanted our topic to be on, giving us less time to finish our project. This was also all of our first times participating in a datathon. 

## Accomplishments that we're proud of
We're proud of the web-app that we were able to make and the data visualizations we created in our exploratory data analysis. We were able to analyze a dataset and produce actionable insights upon it that can be useful for others. Despite our different backgrounds and experience levels, we were able to work together and create a fully-functional app start to end. 

## What's next for SF Stopwatch
In the future, we want to implement real-time data, where live traffic incidents are added into the app, alternative routes suggested to users where there are (predicted) large amounts of traffic stops in an area, legal insights to indicate common traffic violations in areas (ex: high stop sign enforcement zone), and community entries where members are able to report risky spots. 
