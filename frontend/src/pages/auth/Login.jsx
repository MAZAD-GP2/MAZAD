import React, { useEffect, useState } from "react";
import "/src/assets/css/auth.css";
import { useSnackbar } from "notistack";
import { useDispatch, useSelector } from "react-redux";
import * as api from "../../api/index";
import { Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false); // Track login status
  let isAdmin = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoggingIn(true); // Set login status to true when login button is clicked
    await api
      .login({ usernameOrEmail, password })
      .then((result) => {
        localStorage.setItem("userToken", result.data.token);
        result.data.isAdmin ? dispatch({ type: "isAdmin" }) : dispatch({ type: "notAdmin" });
        enqueueSnackbar("Login Successfully", { variant: "success" });
        setUsernameOrEmail("");
        setPassword("");
        setTimeout(() => {
          navigate("/");
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
    <div className="position-absolute d-flex justify-content-center align-items-center w-100 h-100" id="main-container">
      <div className="card px-1 py-4 w-50" id="form-container">
        <div className="d-flex flex-row align-items-center justify-content-center">
          <div className="col-sm-12 col-md-3 col-lg-4 text-center" id="logo-container">
            <h1>
              <i>_MAZAD_</i>
            </h1>
          </div>

          <div id="seperator" style={{ height: 270.72 }}></div>

          <form className="card-body" onSubmit={handleSubmit}>
            <h1 className="information py-2">WELCOME BACK</h1>
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
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-sm-12 form-group">
                  <input
                    className="form-control"
                    type="password"
                    placeholder="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <a href="/forgot-password" className="blockquote-footer">
                    Forgot Password?
                  </a>
                </div>
              </div>

              <div className="d-flex flex-row align-items-center justify-content-start gap-3 mt-3">
                <button
                  className="col-auto px-4 btn btn-secondary btn-block confirm-button"
                  disabled={isLoggingIn} // Disable button while logging in
                >
                  {isLoggingIn ? <Spinner animation="border" size="sm" /> : "Submit"}
                </button>
                <a href="/register" className="terms col-6">
                  Don't have an account
                </a>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
