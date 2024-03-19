import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import "./assets/css/bootstrap_override.scss";
import "./assets/css/global.css";
import store from "./redux/store.js";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { SnackbarProvider, useSnackbar } from "notistack";

function SnackbarCloseButton({ snackbarKey }) {
  const { closeSnackbar } = useSnackbar();

  return (
    <button
      type="button"
      className="btn-close"
      aria-label="Close"
      onClick={() => closeSnackbar(snackbarKey)}
    ></button>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Provider store={store}>
      <SnackbarProvider
        autoHideDuration={3000}
        action={(snackbarKey) => <SnackbarCloseButton snackbarKey={snackbarKey} />}
      >
        <App />
      </SnackbarProvider>
    </Provider>
  </BrowserRouter>
);
