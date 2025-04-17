import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div style={{ padding: "2rem" }}>
      <h2>Page Not Found</h2>
      <p>
        The page you are looking for does not exist. Go back to{" "}
        <Link to="/">Home</Link>.
      </p>
    </div>
  );
};

export default NotFound;
