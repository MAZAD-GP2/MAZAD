import React, { useState } from "react";
import "/src/assets/css/auth.css";
import { useSnackbar } from "notistack";
import axios from "axios";

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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
    const regex = /^(?=.*\d)(?=.*[a-zA-Z]).{8,}$/;
    if (!regex.test(password)) {
      enqueueSnackbar(
        "Password must contain at least 8 characters, including letters and numbers",
        {
          variant: "error",
        }
      );
      return;
    }
    if (password !== confirmPassword) {
      enqueueSnackbar("Passwords don't match", {
        variant: "error",
      });
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
          >
            <h1>
              <i>_MAZAD_</i>
            </h1>
            {/* <img
              src="logo.png"
              border="0"
              className="logo w-100 h-100"
            /> */}
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
                <button className="col-auto px-4 btn btn-secondary btn-block confirm-button">
                  Reset password
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
