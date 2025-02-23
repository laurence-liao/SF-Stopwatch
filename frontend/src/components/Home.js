import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import Header from "./Header.js";
import Footer from "./Footer.js";
import Heatmap from "./Heatmap.js";

const Home = () => {
  return (
    <Container fluid className="d-flex flex-column vh-100 p-0">
      <Header />
      <Row className="flex-grow-1 justify-content-center m-0">
        <Col className="d-flex flex-column flex-grow-1">
          <Heatmap className="p-3"/>
        </Col>
      </Row>
      {/* <Footer /> */}
    </Container>
  );
};

export default Home;
