import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import Header from "./Header.js";
import Footer from "./Footer.js";
import Heatmap from "./Heatmap.js";

function Home() {
  return (
    <Container
      fluid
      style={{
        height: "100vh",
        padding: 0,
        display: "flex",
        flexDirection: "column",
      }}>
      <Col style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <Header />
        <div style={{ flex: 1, overflow: "hidden" }}>
          <Row
            className="justify-content-center"
            style={{ height: "100%", margin: 0 }}>
            <Col
              className="d-flex flex-column"
              style={{ flex: 1 }}>
              <div
                className="home-content"
                style={{ flex: 1 }}>
                <Heatmap />
              </div>
            </Col>
          </Row>
        </div>
        <Footer />
      </Col>
    </Container>
  );
}

export default Home;
