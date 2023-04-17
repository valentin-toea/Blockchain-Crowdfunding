import React from "react";
import { BallTriangle } from "react-loader-spinner";

const LoadingWrapper: React.FC = ({ children }) => {
  return (
    <div>
      <div style={{ position: "absolute", left: "50%", right: "50%" }}>
        <BallTriangle
          height="100"
          width="100"
          color="grey"
          ariaLabel="loading-indicator"
        />
      </div>
      {children}
    </div>
  );
};

export default LoadingWrapper;
