import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
// import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import "./assets/css/bootstrap_override.scss";
import "./assets/css/global.css";
import { BrowserRouter } from "react-router-dom";
import { SnackbarProvider, useSnackbar } from "notistack";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

function SnackbarCloseButton({ snackbarKey }) {
  const { closeSnackbar } = useSnackbar();

  return (
    <button
      onClick={() => closeSnackbar(snackbarKey)}
      style={{ border: "none", background: "none" }}
    >
      <i className={faTimes} ></i>
    </button>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <SnackbarProvider
      autoHideDuration={7000}
      action={(snackbarKey) => (
        <SnackbarCloseButton snackbarKey={snackbarKey} />
      )}
    >
      <App />
    </SnackbarProvider>
  </BrowserRouter>
);
