import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
// import LoadingScreen from "./LoadingScreen";
import "./Loader.css";
const Loader = () => {
  return (
    <div
      style={{
        position: "absolute",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(255, 255, 255, 0.5)",
      }}
    >
      {/* <CircularProgress sx={{ marginLeft: { lg: 32, md: 32, xs: 0 }, color: '#6184C3' }} /> */}
      <div class="loader"></div>
    </div>
  );
};

export default Loader;
