import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import Header from "./Header.js";
import Footer from "./Footer.js";
import Heatmap from "./Heatmap.js";

const Home = () => {
  return (
    <div className="">
      <Header />
      <Heatmap/>
      {/* <Footer /> */}
    </div>
  );
};

export default Home;
