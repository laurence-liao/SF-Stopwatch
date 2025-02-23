import React from "react";
import policeGif from "../Assets/police.gif";

function Pre(props) {
  return (
    <div id={props.load ? "preloader" : "preloader-none"}>
      {props.load && (
        <>
          <img
            src={policeGif}
            alt="Loading..."
          />{" "}
          {/* Display the GIF */}
          <p>Loading... Please wait</p> {/* Display the text */}
        </>
      )}
    </div>
  );
}

export default Pre;
