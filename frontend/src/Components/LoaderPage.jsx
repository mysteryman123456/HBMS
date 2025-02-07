import React from "react";
import { FadeLoader } from "react-spinners";

const LoaderPage = () => {
  return (
    <div
      style={{
        width: "100%",
        height: "70vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <FadeLoader color="dimgrey" />
    </div>
  );
};

export default LoaderPage;
