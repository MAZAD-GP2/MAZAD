import React, { useState } from "react";

import LoginForm from "../../components/LoginForm";
function Login() {
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
            className="col-sm-12 col-md-3 col-lg-4 text-center text-primary link"
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

          <div id="seperator" style={{ height: 270.72 }}></div>

          <div className="col">
            <h1 className="information py-1 px-3">WELCOME BACK</h1>

            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
