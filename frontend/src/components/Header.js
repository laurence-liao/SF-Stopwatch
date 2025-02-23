import React from "react";
import { Container } from "react-bootstrap";
import Spongebob from "../Assets/spongebob.jpg"; // Make sure this path is correct

function Header() {
  return (
    <div
      style={{
        backgroundImage: `url(${Spongebob})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "20vh", // Minimum height (will grow if content is more)
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        textShadow: "2px 2px 4px rgba(0,0,0,0.7)",
      }}>
      <Container>
        <h1 className="text-center">Traffic Data Analysis</h1>
      </Container>
    </div>
  );
}

export default Header;
