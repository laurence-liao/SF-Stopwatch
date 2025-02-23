import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import Header from "./Header.js";
import Footer from "./Footer.js";

function Home() {
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
          </Col>
        </Row>
      </Container>
      <Footer />
    </div>
  );
}

export default Home;
