import React, { useState } from "react";
import "/src/assets/css/auth.css";
import { useSnackbar } from "notistack";
import axios from "axios";
import { Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom"

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isResetting, setIsResetting] = useState(false); // Track reset password status
  const { enqueueSnackbar } = useSnackbar();
  const navigate= useNavigate();

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
      enqueueSnackbar(
        "Password must contain at least 8 characters, including letters and numbers",
        {
          variant: "error",
        }
      );
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

    await axios
      .post("http://localhost:3000/user/reset-password", {
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
    <div
      className="position-absolute d-flex justify-content-center align-items-center w-100 h-100"
      id="main-container"
    >
      <div className="card px-1 py-4 w-50" id="form-container">
        <div className="d-flex flex-row align-items-center justify-content-center">
          <div
            className="col-sm-12 col-md-3 col-lg-4 text-center"
            id="logo-container"
            onClick={()=>navigate('/')}
          >
            <h1 id="logo">
              
            مَزَاد
            </h1>
          </div>

          <div id="seperator" style={{ height: 251.52 }}></div>

          <form className="card-body" onSubmit={handleSubmit}>
            <h1 className="information py-2">Forgot password</h1>
            <div className="col-sm-12 col-md-12 col-lg-9 d-flex flex-column gap-3">
              <div className="row">
                <div className="col-sm-12">
                  <div className="form-group">
                    <div className="input-group">
                      <input
                        className="form-control"
                        type="password"
                        placeholder="password"
                        id="password"
                        value={password.value}
                        onChange={(e) => {
                          handlePasswordChange(e);
                        }}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-12">
                  <div className="form-group">
                    <div className="input-group">
                      <input
                        className="form-control"
                        type="password"
                        placeholder="Confirm password"
                        id="confirm-password"
                        value={confirmPassword.value}
                        onChange={(e) => {
                          handleConfirmPasswordChange(e);
                        }}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="d-flex flex-row align-items-center justify-content-start gap-3 mt-3">
                <button
                  className="col-auto px-4 btn btn-secondary btn-block confirm-button"
                  disabled={isResetting} // Disable button while resetting password
                >
                  {isResetting ? (
                    <Spinner animation="border" size="sm" />
                  ) : (
                    "Reset password"
                  )}
                </button>
                <a href="/login" className="terms col-6">
                  back log in
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
