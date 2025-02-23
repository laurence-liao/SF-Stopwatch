import React from "react";
import { Container } from "react-bootstrap";

function Header() {
  return (
    <div
      style={{
        backgroundColor: "#24272B",
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "20vh", // Increase the height to give it more space
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white", // Keep the color for text
        textShadow: "4px 4px 8px rgba(0,0,0,0.7)", // Enhance text shadow for better readability
        padding: "0 15px", // Add padding to avoid text touching the edges
        fontFamily: "'Arial', sans-serif", // Add a clean sans-serif font
      }}>
      <Container>
        <h1
          className="text-center"
          style={{
            fontSize: "4rem", // Large font size
            fontWeight: "bold", // Make it bold
            letterSpacing: "2px", // Add spacing between letters for emphasis
            textTransform: "uppercase", // Uppercase text for emphasis
            margin: "0", // Remove default margin for tighter design
          }}>
          SF StopWatch
        </h1>
      </Container>
    </div>
  );
}

export default Header;
