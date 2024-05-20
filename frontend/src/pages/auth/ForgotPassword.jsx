import React, { useState } from "react";
import "/src/assets/css/auth.css";
import { useSnackbar } from "notistack";
import * as api from "../../api/index";

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

    await api
      .forgotPassword({
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
      className="position-absolute d-flex flex-column justify-content-center align-items-center w-100 h-100 gap-3"
      id="main-container"
    >
      <div id="mobile-logo">
        <a
          className="col-sm-12 col-md-3 col-lg-4 text-center text-primary link"
          href="/home"
        >
          <img
            src="https://res.cloudinary.com/djwhrh0w7/image/upload/v1716234260/full_logo_white_ysnzrq.png"
            alt="logo"
            width={"100%"}
            className="px-3"
          />
        </a>
      </div>
      <div className="card px-1 py-4 w-50" id="form-container">
        <div className="d-flex flex-row align-items-center justify-content-center">
          <a
            className="col-sm-12 col-md-3 col-lg-4 text-center link text-primary"
            id="logo-container"
            href="/home"
          >
            <img
              src="https://res.cloudinary.com/djwhrh0w7/image/upload/v1716234308/logo_inglish_black_tlzeqp.png"
              alt="logo"
              width={"100%"}
              className="px-3"
            />
          </a>

          <div id="seperator" style={{ height: 234.24 }}></div>

          <form className="card-body" onSubmit={handleSubmit}>
            <h1 className="information py-2">Forgot password</h1>
            <div className="col-sm-12 col-md-12 col-lg-9 d-flex flex-column gap-3">
              <div className="row">
                <div className="col-sm-12 form-group">
                  <label htmlFor="email" className="form-label">
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

              <div className="d-flex flex-row flex-wrap align-items-center justify-content-start gap-3 mt-3">
                <button className="col-auto px-4 btn btn-secondary confirm-button text-white">
                  Send password reset email
                </button>
                <a href="/login" className="terms">
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
