import React, { useState } from "react";
import "/src/assets/css/auth.css";
import { useSnackbar } from "notistack";
import { Spinner } from "react-bootstrap";
import * as api from "../../api/index";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isResetting, setIsResetting] = useState(false); // Track reset password status
  const [showPassword, setShowPassword] = useState(false); // password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // confirm password visibility
  const { enqueueSnackbar } = useSnackbar();

  const handlePasswordChange = (event) => {
    const value = event.target.value;
    setPassword(value);
  };

  const handleConfirmPasswordChange = (event) => {
    const value = event.target.value;
    setConfirmPassword(value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsResetting(true); // Set reset password status to true when reset password button is clicked
    const regex = /^(?=.*\d)(?=.*[a-zA-Z]).{8,}$/;
    if (!regex.test(password)) {
      enqueueSnackbar("Password must contain at least 8 characters, including letters and numbers", {
        variant: "error",
      });
      setIsResetting(false); // Set reset password status back to false
      return;
    }
    if (password !== confirmPassword) {
      enqueueSnackbar("Passwords don't match", {
        variant: "error",
      });
      setIsResetting(false); // Set reset password status back to false
      return;
    }

    await api
      .ResetPassword({
        token: window.location.search.split("=")[1],
        password,
        confirmPassword,
      })
      .then(() => {
        window.location.href = "/login";
      })
      .catch((err) => {
        enqueueSnackbar(err.response.data.message, { variant: "error" });
      })
      .finally(() => {
        setIsResetting(false); // Set reset password status back to false
      });
  };

  return (
    <div className="position-absolute d-flex justify-content-center align-items-center w-100 h-100" id="main-container">
      <div className="card px-1 py-4 w-50" id="form-container">
        <div className="d-flex flex-row align-items-center justify-content-center">
          <a className="col-sm-12 col-md-3 col-lg-4 text-center link text-primary " id="logo-container" href="/home">
            <h1 id="logo">MAZAD</h1>
          </a>

          <div id="seperator" style={{ height: 251.52 }}></div>

          <form className="card-body" onSubmit={handleSubmit}>
            <h1 className="information py-2">Forgot password</h1>
            <div className="col-sm-12 col-md-12 col-lg-9 d-flex flex-column gap-3">
              <div className="row">
                <div className="col-sm-12 form-group">
                  <div className="position-relative d-flex">
                    <input
                      className="form-control"
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      id="password"
                      value={password.value}
                      onChange={(e) => {
                        handlePasswordChange(e);
                      }}
                      required
                    />
                    <button
                      type="button"
                      className="btn btn-toggle-password position-absolute"
                      style={{ right: "10px", border: "0" }}
                      onClick={() => setShowPassword(!showPassword)}
                    >
                    <FontAwesomeIcon style={{opacity:"0.7"}} icon={showPassword ? "fa-regular fa-eye" : "fa-regular fa-eye-slash"} />
                    </button>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="form-group col-sm-12">
                  <div className="position-relative d-flex">
                    <input
                      className="form-control"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm Password"
                      id="confirm-password"
                      value={confirmPassword.value}
                      onChange={(e) => {
                        handleConfirmPasswordChange(e);
                      }}
                      required
                    />
                    <button
                      type="button"
                      className="btn btn-toggle-password position-absolute"
                      style={{ right: "10px", border: "0" }}
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                    <FontAwesomeIcon style={{opacity:"0.7"}} icon={showConfirmPassword ? "fa-regular fa-eye" : "fa-regular fa-eye-slash"} />
                    </button>
                  </div>
                </div>
              </div>
              <div className="d-flex flex-row align-items-center justify-content-start gap-3 mt-3">
                <button
                  className="col-auto px-4 btn btn-secondary btn-block confirm-button"
                  disabled={isResetting} // Disable button while resetting password
                >
                  {isResetting ? <Spinner animation="border" size="sm" /> : "Reset Password"}
                </button>
                <a href="/login" className="terms col-6">
                  Back log in
                </a>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
