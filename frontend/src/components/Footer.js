import React from "react";
import { Container } from "react-bootstrap";

function Footer() {
  return (
    <div
      style={{
        backgroundColor: "#24272B", // Dark background for contrast
        height: "12vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        textAlign: "center",
        padding: "40px 0px", // Added top/bottom padding for better spacing
        textShadow: "2px 2px 4px rgba(0,0,0,0.7)", // Text shadow for better contrast
      }}>
      <Container>
        <p
          style={{
            fontSize: "1.2rem",
            lineHeight: "1.6",
            fontWeight: "normal",
            maxWidth: "900px", // Increased width for better readability
            margin: "0 auto", // Center the text
            padding: "0 15px", // Added padding to prevent text from touching the edges
          }}>
          Visualizing the distribution of traffic stops across San Francisco to
          provide valuable insights for urban mobility and public safety. This
          platform aims to foster transparency, support informed
          decision-making, and drive meaningful discussions for a safer, more
          efficient city.
        </p>
      </Container>
    </div>
  );
}

export default Footer;
