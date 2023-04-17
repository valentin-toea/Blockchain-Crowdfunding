import { Loader } from "@mantine/core";
import React from "react";

interface LoadingBlockProps {
  loading: boolean;
  style?: object;
}

const LoadingBlock: React.FC<LoadingBlockProps> = ({
  loading,
  children,
  style,
}) => {
  return (
    <div style={{ ...style, position: "relative" }}>
      {loading && (
        <div
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0,0,0,0.05)",
            borderRadius: 12,
            zIndex: 2,
          }}
        >
          <div
            style={{
              width: "auto",
              padding: 30,
            }}
          >
            <Loader size="xl" color="violet" />
          </div>
        </div>
      )}
      {children}
    </div>
  );
};

export default LoadingBlock;
