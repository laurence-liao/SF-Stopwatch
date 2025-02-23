import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet.heat";
import { Container, Row, Col } from "react-bootstrap";

const HeatmapLayer = ({ points, dataType }) => {
  const map = useMap();

  const getHeatmapOptions = (dataType) => {
    switch (dataType) {
      case "overall":
        return { radius: 10, blur: 15, maxZoom: 17, value: 0.2 };
      case "yearly":
        return { radius: 12, blur: 15, maxZoom: 17, value: 0.4 };
      case "half_year":
        return { radius: 14, blur: 15, maxZoom: 17, value: 0.6 };
      case "monthly":
        return { radius: 16, blur: 15, maxZoom: 17, value: 0.8 };
      default:
        return { radius: 12, blur: 15, maxZoom: 17, value: 0.2 };
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

    const canvas = heatLayer._canvas;
    if (canvas) {
      canvas.willReadFrequently = true;
    }

    return () => {
      map.removeLayer(heatLayer);
    };
  }, [map, points]);

  return null;
};

const Heatmap = () => {
  const [heatmapData, setHeatmapData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [dataType, setDataType] = useState("overall");
  const [currentHalfYear, setCurrentHalfYear] = useState("2023_H2");
  const [currentYear, setCurrentYear] = useState("2023");
  const [currentMonth, setCurrentMonth] = useState("12_2023");
  const [age, setAge] = useState("");
  const [race, setRace] = useState("");
  const [gender, setGender] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:5000/api/heatmap-data")
      .then((response) => response.json())
      .then((data) => {
        setHeatmapData(data);
        setFilteredData(data[dataType] || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching heatmap data:", error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const fetchFilteredData = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (age) queryParams.append("age", age);
        if (race) queryParams.append("race", race);
        if (gender) queryParams.append("gender", gender);

        const response = await fetch(
          `http://localhost:5000/api/filter-heatmap?${queryParams.toString()}`
        );
        const data = await response.json();
        if (dataType === "overall") {
          setFilteredData(data[dataType] || []);
        } else if (dataType === "yearly") {
          setFilteredData(data[dataType][currentYear] || []);
        } else if (dataType === "half_year") {
          setFilteredData(data[dataType][currentHalfYear] || []);
        } else if (dataType === "monthly") {
          setFilteredData(data[dataType][currentMonth] || []);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching filtered heatmap data:", error);
        setLoading(false);
      }
    };

    if (age || race || gender) {
      fetchFilteredData();
    }
    if (heatmapData) {
      if (dataType === "overall") {
        setFilteredData(heatmapData[dataType] || []);
      } else if (dataType === "yearly") {
        setFilteredData(heatmapData[dataType][currentYear] || []);
      } else if (dataType === "half_year") {
        setFilteredData(heatmapData[dataType][currentHalfYear] || []);
      } else if (dataType === "monthly") {
        setFilteredData(heatmapData[dataType][currentMonth] || []);
      }
    }
  }, [
    dataType,
    currentYear,
    currentHalfYear,
    currentMonth,
    heatmapData,
    age,
    race,
    gender,
  ]);

  const goBackYear = () => {
    setCurrentYear((prev) => {
      const currentYear = parseInt(prev);
      const newYear = currentYear - 1;
      if (newYear >= 2018) {
        return String(newYear);
      }
      return prev;
    });
  };

  const goForwardYear = () => {
    setCurrentYear((prev) => {
      const currentYear = parseInt(prev);
      const newYear = currentYear + 1;
      if (newYear <= 2023) {
        return String(newYear);
      }
      return prev;
    });
  };

  const goBackHalfYear = () => {
    setCurrentHalfYear((prev) => {
      const [year, half] = prev.split("_");
      const newHalf = half === "H1" ? "H2" : "H1";
      let newYear = year;

      if (half === "H1") {
        newYear = String(parseInt(year) - 1);
      }

      if (newYear === "2018" && newHalf === "H1") {
        return prev;
      }

      if (parseInt(newYear) >= 2018) {
        return `${newYear}_${newHalf}`;
      }

      return prev;
    });
  };

  const goForwardHalfYear = () => {
    setCurrentHalfYear((prev) => {
      const [year, half] = prev.split("_");
      const newHalf = half === "H2" ? "H1" : "H2";
      let newYear = year;
      if (half === "H2") {
        newYear = String(parseInt(year) + 1);
      }
      if (parseInt(newYear) <= 2023) {
        return `${newYear}_${newHalf}`;
      }
      return prev;
    });
  };

  const goBackMonth = () => {
    setCurrentMonth((prev) => {
      let [month, year] = prev.split("_");
      year = parseInt(year);

      if (month === "01") {
        month = "12";
        year -= 1;
      } else {
        month = String(parseInt(month) - 1).padStart(2, "0");
      }

      if (
        (year > 2018 || (year === 2018 && month >= "08")) &&
        (year < 2023 || (year === 2023 && month <= "12"))
      ) {
        return `${month}_${year}`;
      }
      return prev;
    });
  };

  const goForwardMonth = () => {
    setCurrentMonth((prev) => {
      let [month, year] = prev.split("_");
      year = parseInt(year);

      if (month === "12") {
        month = "01";
        year += 1;
      } else {
        month = String(parseInt(month) + 1).padStart(2, "0");
      }

      if (
        (year < 2023 || (year === 2023 && month <= "12")) &&
        (year > 2018 || (year === 2018 && month >= "08"))
      ) {
        return `${month}_${year}`;
      }
      return prev;
    });
  };

  return (
    <Container>
      <div className="space-y-4 my-5" style={{ display: "flex", flexDirection: "row" }}>
        <div style={{width:'30vw'}}>
          <div style={{padding:'10px'}}>
            <label htmlFor="dataType" style={{ paddingRight: "5px" }}>
              Select Data Type:
            </label>
            <select
              id="dataType"
              value={dataType}
              onChange={(e) => setDataType(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md">
              <option value="overall">Overall</option>
              <option value="yearly">Yearly</option>
              <option value="half_year">Half Year</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
  
          <div  style={{padding:'10px'}}>
            <label className="block text-gray-700" style={{ paddingRight: "5px" }}>Age Group:</label>
            <select
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md">
              <option value="">All</option>
              <option value="Under 18">Under 18</option>
              <option value="18 - 29">18-29</option>
              <option value="30 - 39">30-39</option>
              <option value="40 - 49">40-49</option>
              <option value="50 - 60">50-59</option>
              <option value="60 or over">60+</option>
            </select>
          </div>
  
          <div  style={{padding:'10px'}}>
            <label className="block text-gray-700" style={{ paddingRight: "5px" }}>Race: </label>
            <select
              value={race}
              onChange={(e) => setRace(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md">
              <option value="">All</option>
              <option value="White">White</option>
              <option value="Black/African American">Black</option>
              <option value="Asian">Asian</option>
              <option value="Hispanic/Latino(a)">Hispanic</option>
              <option value="Middle Eastern or South Asian">
                Middle Eastern or South Asian
              </option>
              <option value="Pacific Islander">Pacific Islander</option>
              <option value="Native American">Native American</option>
              <option value="Multi-racial">Other</option>
            </select>
          </div>
  
          <div style={{padding:'10px'}}>
            <label className="block text-gray-700" style={{ paddingRight: "5px" }}>Gender:</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md">
              <option value="">All</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          {dataType === "half_year" && (
            <div  style={{padding:'10px'}}>
              <p>Current Half-Year: {currentHalfYear.replace("_", "-")}</p>
              <div className="flex justify-between mt-2">
                <button
                  onClick={goBackHalfYear}
                  className="px-6 py-3 bg-gray-300 rounded-lg hover:bg-gray-500 transition duration-200">
                  &lt; Previous
                </button>
                <button
                  onClick={goForwardHalfYear}
                  className="px-6 py-3 bg-gray-300 rounded-lg hover:bg-gray-500 transition duration-200">
                  Next &gt;
                </button>
              </div>
            </div>
          )}
  
          {dataType === "yearly" && (
            <div  style={{padding:'10px'}}>
              <p>Current Year: {currentYear.replace("_", "-")}</p>
              <div className="flex justify-between mt-2">
                <button
                  onClick={goBackYear}
                  className="px-6 py-3 bg-gray-300 rounded-lg hover:bg-gray-500 transition duration-200">
                  &lt; Previous
                </button>
                <button
                  onClick={goForwardYear}
                  className="px-6 py-3 bg-gray-300 rounded-lg hover:bg-gray-500 transition duration-200">
                  Next &gt;
                </button>
              </div>
            </div>
          )}
  
          {dataType === "monthly" && (
            <div  style={{padding:'10px'}}>
              <p>Current Month: {currentMonth.replace("_", "-")}</p> {/* Replace _ with - */}
              <div className="flex justify-between mt-2">
                <button
                  onClick={goBackMonth}
                  className="px-6 py-3 bg-gray-300 rounded-lg hover:bg-gray-500 transition duration-200">
                  &lt; Previous
                </button>
                <button
                  onClick={goForwardMonth}
                  className="px-6 py-3 bg-gray-300 rounded-lg hover:bg-gray-500 transition duration-200">
                  Next &gt;
                </button>
              </div>
            </div>
          )}
        </div>
        
        <div style={{width:'70vw'}}>
        <MapContainer
          center={[37.7749, -122.4194]}
          zoom={13}
          style={{
            height: "70vh",
            width: "100%",
          }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <HeatmapLayer points={filteredData} dataType={dataType} />
        </MapContainer>
        </div>
      </div>
    </Container>
  );
};  

export default Heatmap;
