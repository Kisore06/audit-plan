import React from "react";
// import { Link } from "react-router-dom";

function Error() {
  return (
    <div className="error-page">
      <div className="error-card">
        <h1 className="error-text">404</h1>
        <p
          style={{
            margin: "0px",
            color: "#63228B",
            fontWeight: "700",
          }}
        >
          OOPS! PAGE NOT FOUND
        </p>
      </div>
    </div>
  );
}

export default Error;