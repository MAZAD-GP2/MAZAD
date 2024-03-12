import React, { useState } from "react";
import "/src/assets/css/auth.css";
import { useSnackbar } from "notistack";
import axios from "axios";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!regex.test(email)) {
      enqueueSnackbar("Invalid link", {
        variant: "error",
      });
      return;
    }

    await axios
      .post("http://localhost:3000/user/forgot-password", {
        email,
      })
      .then(() => {
        setEmail("");
        enqueueSnackbar(
          "If the email exists in our records, an email with instructions will be sent to it",
          {
            variant: "success",
            autoHideDuration: 5000,
          }
        );
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

          <div id="seperator" style={{ height: 234.24 }}></div>

          <form className="card-body" onSubmit={handleSubmit}>
            <h1 className="information py-2">Forgot password</h1>
            <div className="col-sm-12 col-md-12 col-lg-9 d-flex flex-column gap-3">
              <div className="row">
                <div className="col-sm-12 form-group">
                  <label for="email" className="form-label">
                    Enter your email
                  </label>
                  <input
                    className="form-control"
                    type="text"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="d-flex flex-row align-items-center justify-content-start gap-3 mt-3">
                <button className="col-auto px-4 btn btn-secondary btn-block confirm-button">
                  Send password reset email
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

export default ForgotPassword;