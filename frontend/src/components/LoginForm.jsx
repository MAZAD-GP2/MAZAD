import React, { useState } from "react";
import { Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSnackbar } from "notistack";
import * as api from "../api/index";
import "../assets/css/auth.css";

const LoginForm = ({ next = null }) => {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false); // Track login status
  const [showPassword, setShowPassword] = useState(false); // password visibility
  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoggingIn(true); // Set login status to true when login button is clicked
    await api
      .login({ usernameOrEmail, password })
      .then((result) => {
        localStorage.setItem("user", JSON.stringify(result.data));
        enqueueSnackbar("Login Successful", { variant: "success" });
        setUsernameOrEmail("");
        setPassword("");
        setTimeout(() => {
          // get url parameter next
          if (next) window.location.href = next;

          const urlParams = new URLSearchParams(window.location.search);
          const urlNext = urlParams.get("next");
          if (urlNext) window.location.href = urlNext;
          else window.location.href = "/home";
        }, 1000);
      })
      .catch((err) => {
        enqueueSnackbar(err.response.data.message, {
          variant: "error",
        });
      })
      .finally(() => {
        setIsLoggingIn(false); // Set login status back to false after login attempt is complete
      });
  };
  return (
    <form className="card-body" onSubmit={handleSubmit}>
      <div className="col-sm-12 col-md-12 col-lg-9 d-flex flex-column gap-3">
        <div className="row">
          <div className="col-sm-12 form-group">
            <input
              className="form-control"
              type="text"
              placeholder="Username or Email"
              value={usernameOrEmail}
              onChange={(e) => setUsernameOrEmail(e.target.value)}
              required
              autoFocus
            />
          </div>
        </div>
        <div className="row">
          <div className="col-sm-12 form-group position-relative d-flex">
            <input
              className="form-control"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="btn btn-toggle-password position-absolute"
              style={{ right: "10px", border: "0" }}
              onClick={() => setShowPassword(!showPassword)}
            >
              <FontAwesomeIcon
                style={{ opacity: "0.7" }}
                icon={
                  showPassword ? "fa-regular fa-eye" : "fa-regular fa-eye-slash"
                }
              />
            </button>
          </div>
        </div>

        <a href="/forgot-password" className="blockquote-footer">
          Forgot Password?
        </a>

        <div className="d-flex flex-row align-items-center justify-content-start gap-3">
          <button
            className="col-auto px-4 btn btn-secondary btn-block confirm-button text-white"
            disabled={isLoggingIn} // Disable button while logging in
          >
            {isLoggingIn ? <Spinner animation="border" size="sm" /> : "Submit"}
          </button>
          <a
            href="/register"
            style={{ cursor: "pointer" }}
            className="terms col-6"
          >
            Don't have an account
          </a>
        </div>
      </div>
    </form>
  );
};

export default LoginForm;
