import * as React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Snackbar = () => {
  return (
    <ToastContainer
      newestOnTop={true}
      position="bottom-left"
      limit={5}
      autoClose={10000}
    />
  );
};

export default Snackbar;
