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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

function SnackbarCloseButton({ snackbarKey }) {
  const { closeSnackbar } = useSnackbar();

  return (
    // <button
    //   type="button"
    //   className="btn-close"
    //   aria-label="Close"
    //   onClick={() => closeSnackbar(snackbarKey)}
    // ></button>
    <button onClick={() => closeSnackbar(snackbarKey)} style={{ border: "none", background: "none" }}>
      <FontAwesomeIcon icon={faTimes} />
    </button>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Provider store={store}>
      <SnackbarProvider
        autoHideDuration={5000}
        action={(snackbarKey) => <SnackbarCloseButton snackbarKey={snackbarKey} />}
      >
        <App />
      </SnackbarProvider>
    </Provider>
  </BrowserRouter>
);
