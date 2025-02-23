import React from "react";
import { Container } from "react-bootstrap";

function Footer() {
  return (
    <div
      style={{
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "20vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        textShadow: "2px 2px 4px rgba(0,0,0,0.7)",
      }}>
      <Container>
        <h1 className="text-center">
          This website is to analyze the locations of traffic stops
        </h1>
      </Container>
    </div>
  );
}

export default Footer;
