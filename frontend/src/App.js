import React, { useState, useEffect } from "react";
import "./App.css";
import Home from "./components/Home";
import "bootstrap/dist/css/bootstrap.min.css";
import Preloader from "./components/Pre";

import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import "./index.css";
import "./App.css";

function App() {
  const [load, updateLoad] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      updateLoad(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Router>
      <Preloader load={load} />
      <div
        className="App"
        id={load ? "no-scroll" : "scroll"}>
        {/* <Navbar /> */}
        <Routes>
          <Route
            path="/"
            element={<Home />}
          />
          <Route
            path="*"
            element={<Navigate to="/" />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
