import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet.heat";

const HeatmapLayer = ({ points, dataType }) => {
  const map = useMap();
  // Function to set the radius and value based on the dataType
  const getHeatmapOptions = (dataType) => {
    switch (dataType) {
      case "overall":
        return { radius: 10, blur: 15, maxZoom: 17, value: 0.2 }; // Default for overall
      case "yearly":
        return { radius: 12, blur: 15, maxZoom: 17, value: 0.4 }; // Increase value for yearly
      case "half_year":
        return { radius: 14, blur: 15, maxZoom: 17, value: 0.6 }; // Increase value for half-year
      case "monthly":
        return { radius: 16, blur: 15, maxZoom: 17, value: 0.8 }; // Increase value for monthly
      default:
        return { radius: 12, blur: 15, maxZoom: 17, value: 0.2 }; // Fallback default
    }
  };

  const heatmapOptions = getHeatmapOptions(dataType);

  useEffect(() => {
    if (!map || points.length === 0) return;

    const heatLayer = L.heatLayer(
      points.map(({ latitude, longitude }) => [
        latitude,
        longitude,
        heatmapOptions.value,
      ]),
      {
        radius: heatmapOptions.radius,
        blur: heatmapOptions.blur,
        maxZoom: heatmapOptions.maxZoom,
      }
    ).addTo(map);
    return () => {
      map.removeLayer(heatLayer);
    };
  }, [map, points]);

  return null;
};

const Heatmap = () => {
  const [heatmapData, setHeatmapData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [dataType, setDataType] = useState("overall"); // Default is 'overall'
  const [currentHalfYear, setCurrentHalfYear] = useState("2023_H2");
  const [currentYear, setCurrentYear] = useState("2023");
  const [currentMonth, setCurrentMonth] = useState("12_2023");

  useEffect(() => {
    fetch("http://localhost:5000/api/heatmap-data")
      .then((response) => response.json())
      .then((data) => {
        setHeatmapData(data); // Store the entire fetched data
        setFilteredData(data[dataType] || []); // Set the initial data for the default dataType
      })
      .catch((error) => {
        console.error("Error fetching heatmap data:", error);
      });
  }, []);

  // Whenever the dataType changes, filter the data accordingly
  useEffect(() => {
    if (heatmapData) {
      if (dataType === "overall") {
        setFilteredData(heatmapData[dataType] || []); // Filter based on selected dataType
      } else if (dataType === "yearly") {
        setFilteredData(heatmapData[dataType][currentYear] || []);
      } else if (dataType === "half_year") {
        setFilteredData(heatmapData[dataType][currentHalfYear] || []);
      } else if (dataType === "monthly") {
        setFilteredData(heatmapData[dataType][currentMonth] || []);
      }
    }
  }, [dataType, currentYear, currentHalfYear, currentMonth, heatmapData]);

  // Function to go back a year
  const goBackYear = () => {
    setCurrentYear((prev) => {
      const currentYear = parseInt(prev); // Convert the year to an integer
      const newYear = currentYear - 1;
      if (newYear >= 2018) {
        return String(newYear); // Only update if within bounds (2018 - 2023)
      }
      return prev; // Return previous year if out of bounds
    });
  };

  // Function to go forward a year
  const goForwardYear = () => {
    setCurrentYear((prev) => {
      const currentYear = parseInt(prev); // Convert the year to an integer
      const newYear = currentYear + 1;
      if (newYear <= 2023) {
        return String(newYear); // Only update if within bounds (2018 - 2023)
      }
      return prev; // Return previous year if out of bounds
    });
  };

  // Function to go back a half-year
  const goBackHalfYear = () => {
    setCurrentHalfYear((prev) => {
      const [year, half] = prev.split("_");
      const newHalf = half === "H1" ? "H2" : "H1"; // Toggle between H1 and H2
      let newYear = year;

      if (half === "H1") {
        newYear = String(parseInt(year) - 1); // Move to previous year if in H1
      }

      // Ensure that the user cannot go back past 2018_H2
      if (newYear === "2018" && newHalf === "H1") {
        return prev; // Stay at 2018_H2 if trying to go before that
      }

      if (parseInt(newYear) >= 2018) {
        return `${newYear}_${newHalf}`; // Only update if within bounds
      }

      return prev; // Return previous half-year if out of bounds
    });
  };

  // Function to go forward a half-year
  const goForwardHalfYear = () => {
    setCurrentHalfYear((prev) => {
      const [year, half] = prev.split("_");
      const newHalf = half === "H1" ? "H2" : "H1";
      let newYear = year;
      if (half === "H2") {
        newYear = String(parseInt(year) + 1); // Move to next year if in H2
      }
      if (parseInt(newYear) <= 2023) {
        return `${newYear}_${newHalf}`; // Only update if within bounds
      }
      return prev; // Return previous half-year if out of bounds
    });
  };

  // Function to go back a month
  const goBackMonth = () => {
    setCurrentMonth((prev) => {
      let [month, year] = prev.split("_");
      year = parseInt(year); // Convert year to integer

      // Adjust the month and year
      if (month === "01") {
        month = "12"; // Go to December
        year -= 1; // Decrease year
      } else {
        month = String(parseInt(month) - 1).padStart(2, "0"); // Decrease month and keep it two digits
      }

      // Check if the date is still within bounds (Aug 2018 to Dec 2023)
      if (
        (year > 2018 || (year === 2018 && month >= "08")) &&
        (year < 2023 || (year === 2023 && month <= "12"))
      ) {
        return `${month}_${year}`; // Return the updated month_year string
      }
      return prev; // Return previous month if out of bounds
    });
  };

  // Function to go forward a month
  const goForwardMonth = () => {
    setCurrentMonth((prev) => {
      let [month, year] = prev.split("_");
      year = parseInt(year); // Convert year to integer

      // Adjust the month and year
      if (month === "12") {
        month = "01"; // Go to January
        year += 1; // Increase year
      } else {
        month = String(parseInt(month) + 1).padStart(2, "0"); // Increase month and keep it two digits
      }

      // Check if the date is still within bounds (Aug 2018 to Dec 2023)
      if (
        (year < 2023 || (year === 2023 && month <= "12")) &&
        (year > 2018 || (year === 2018 && month >= "08"))
      ) {
        return `${month}_${year}`; // Return the updated month_year string
      }
      return prev; // Return previous month if out of bounds
    });
  };

  return (
    <div>
      <div>
        <label htmlFor="dataType">Select Data Type:</label>
        <select
          id="dataType"
          value={dataType}
          onChange={(e) => setDataType(e.target.value)}>
          <option value="overall">Overall</option>
          <option value="yearly">Yearly</option>
          <option value="half_year">Half Year</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>
      <div>
        {dataType === "half_year" && (
          <>
            <p>Current Half-Year: {currentHalfYear}</p>{" "}
            {/* Display current half-year */}
            <button onClick={goBackHalfYear}>&lt; Previous</button>
            <button onClick={goForwardHalfYear}>Next &gt;</button>
          </>
        )}

        {dataType === "yearly" && (
          <>
            <p>Current Year: {currentYear}</p> {/* Display current year */}
            <button onClick={goBackYear}>&lt; Previous</button>
            <button onClick={goForwardYear}>Next &gt;</button>
          </>
        )}

        {dataType === "monthly" && (
          <>
            <p>Current Month: {currentMonth}</p> {/* Display current month */}
            <button onClick={goBackMonth}>&lt; Previous</button>
            <button onClick={goForwardMonth}>Next &gt;</button>
          </>
        )}
      </div>

      <MapContainer
        center={[37.7749, -122.4194]} // You can set this to your desired center
        zoom={13}
        style={{
          height: "50vh", // Ensures it fills available space
          width: "100%",
        }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <HeatmapLayer
          points={filteredData}
          dataType={dataType}
        />
      </MapContainer>
    </div>
  );
};

export default Heatmap;
