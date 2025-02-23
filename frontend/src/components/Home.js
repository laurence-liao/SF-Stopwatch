import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import Header from "./Header.js";
import Footer from "./Footer.js";
import { useEffect, useState } from "react";

function Home() {
  const [heatmapData, setHeatmapData] = useState([]);

  useEffect(() => {
    // Fetch data from the Flask backend API
    fetch("http://localhost:5000/api/heatmap-data")
      .then((response) => response.json())
      .then((data) => setHeatmapData(data))
      .catch((error) => console.error("Error fetching heatmap data:", error));
  }, []);

  return (
    <div className="home-section">
      <Header />
      <Container className="home-content">
        <Row className="justify-content-center align-items-center h-100">
          <Col
            md={7}
            className="home-header opacity-background text-center">
            <h1 className="heading">Hi There!</h1>
            <h1 className="heading-name">
              Welcome to: <strong className="main-name">Bias bacon</strong>
            </h1>
            <div>
              <h1>Heatmap</h1>
              {/* Render your heatmap here using the heatmapData */}
              {heatmapData.length > 0 ? (
                <pre>{JSON.stringify(heatmapData, null, 2)}</pre>
              ) : (
                <p>Loading data...</p>
              )}
            </div>
          </Col>
        </Row>
      </Container>
      <Footer />
    </div>
  );
}

export default Home;
