import React from "react";
import { Container } from "react-bootstrap";

function Header() {
  return (
    <div
      style={{
        backgroundColor: "#00517C", // Light gray background
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "20vh", // Optimal height for a header
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#2D3748", // Dark gray text for contrast
        padding: "20px 15px", // Adequate padding
        fontFamily: "'Inter', sans-serif", // Modern sans-serif font
      }}>
      <Container>
        <h1
          className="text-center"
          style={{
            fontSize: "3.5rem", // Large but not overwhelming
            fontWeight: "600", // Semi-bold for emphasis
            letterSpacing: "1.5px", // Slight letter spacing
            textTransform: "uppercase", // Uppercase for a modern look
            margin: "0", // Remove default margin
            color: "#FFFFFF", // Slightly lighter gray for the text
          }}>
          SF StopWatch
        </h1>
      </Container>
    </div>
  );
}

export default Header;  