import React, { useState } from "react";
import "/src/assets/css/auth.css";
import { useSnackbar } from "notistack";
import * as api from "../../api/index";
import { Spinner } from "react-bootstrap";
import "bootstrap";
import { useNavigate } from "react-router-dom";
import { OverlayTrigger, Popover } from "react-bootstrap";

function Register() {
  const [username, setUsername] = useState({ value: "", isValid: true });
  const [phoneNumber, setPhoneNumber] = useState({ value: "", isValid: true });
  const [password, setPassword] = useState({ value: "", isValid: true });
  const [email, setEmail] = useState({ value: "", isValid: true });
  const [confirmPassword, setConfirmPassword] = useState({
    value: "",
    isValid: true,
  });
  const [isRegistering, setIsRegistering] = useState(false); // Track registration status
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  //tool tips messages
  const popoverUsername = (
    <Popover id="popover-basic">
      <Popover.Body>
        <ul>
          <li>Use 6 to 20 characters</li>
          <li>Use only letters, numbers, underscores, dots, and spaces</li>
        </ul>
      </Popover.Body>
    </Popover>
  );

  const popoverPhoneNumber = (
    <Popover id="popover-basic">
      <Popover.Body>Enter a jordanian valid phone number</Popover.Body>
    </Popover>
  );

  const popoverEmail = (
    <Popover id="popover-basic">
      <Popover.Body>Enter a valid email address</Popover.Body>
    </Popover>
  );

  const popoverPassword = (
    <Popover id="popover-basic">
      <Popover.Body>
        <ul>
          <li>Use 8 to 64 characters</li>
          <li>Include at least 1 uppercase letter</li>
          <li>Include at least 1 lowercase letter</li>
          <li>Include at least 1 number</li>
        </ul>
      </Popover.Body>
    </Popover>
  );

  const handleInputChange = () => {
    setUsername({ ...username, isValid: true });
    setPhoneNumber({ ...phoneNumber, isValid: true });
    setEmail({ ...email, isValid: true });
    setPassword({ ...password, isValid: true });
    setConfirmPassword({ ...confirmPassword, isValid: true });
  };

  const handleUsernameChange = (event) => {
    const value = event.target.value;
    setUsername({ value, isValid: true });
  };

  const handlePhoneNumberChange = (event) => {
    const value = event.target.value;
    let valid = true;
    let regex = new RegExp("^[0-9]{10}$");
    if (!regex.test(value)) {
      valid = false;
    }
    setPhoneNumber({ value, isValid: !!valid });
  };

  const handleEmailChange = (event) => {
    const value = event.target.value;
    setEmail({ value, isValid: true });
  };

  const handlePasswordChange = (event) => {
    const value = event.target.value;
    setPassword({ value, isValid: true });
  };

  const handleConfirmPasswordChange = (event) => {
    const value = event.target.value;
    setConfirmPassword({ value, isValid: true });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsRegistering(true); // Set registration status to true when registration button is clicked
    let success = true;
    // Validate input fields
    if (!username.isValid || !username.value) {
      setUsername({ ...username, isValid: false });
      success = false;
    }
    if (!phoneNumber.isValid || !phoneNumber.value) {
      setPhoneNumber({ ...phoneNumber, isValid: false });
      success = false;
    }
    if (!email.isValid || !email.value) {
      setEmail({ ...email, isValid: false });
      success = false;
    }
    // Add password regex validation here
    const regex = /^(?=.*\d)(?=.*[a-zA-Z]).{8,}$/;
    if (!regex.test(password.value)) {
      enqueueSnackbar("Password must contain at least 8 characters, including at least one letter and one number", {
        variant: "error",
        hideIconVariant: true,
      });
      setPassword({ ...password, isValid: false });
      setIsRegistering(false); // Set registration status back to false
      return;
    }
    if (!confirmPassword.isValid || !confirmPassword.value || confirmPassword.value !== password.value) {
      setConfirmPassword({ ...confirmPassword, isValid: false });
      success = false;
      enqueueSnackbar("Password and Confirm Password don't match or are not valid", {
        variant: "error",
      });
    }
    if (!success) {
      setIsRegistering(false); // Set registration status back to false
      return;
    }
    // Perform registration
    api
      .register({
        username: username.value,
        email: email.value,
        phoneNumber: phoneNumber.value,
        password: password.value,
        confirmPassword: confirmPassword.value,
      })
      .then((result) => {
        setUsername({ value: "", isValid: true });
        setPhoneNumber({ value: "", isValid: true });
        setEmail({ value: "", isValid: true });
        setPassword({ value: "", isValid: true });
        setConfirmPassword({ value: "", isValid: true });
        sessionStorage.setItem("user", JSON.stringify(result.data));
        enqueueSnackbar("User Created Successfully", { variant: "success" });
        setTimeout(() => {
          window.location.href = '/';
        }, 1000);
      })
      .catch((err) => {
        enqueueSnackbar(err.response.data.message, { variant: "error" });
      })
      .finally(() => {
        setIsRegistering(false); // Set registration status back to false
      });
  };

  return (
    <div
      className="position-absolute d-flex flex-row justify-content-center align-items-center w-100 h-100"
      id="main-container"
    >
      <div className="card px-1 py-4 col-lg-7 col-md-8 col-sm-12" id="form-container">
        <div className="d-flex flex-row align-items-center justify-content-center w-100">
          <a className="col-sm-12 col-md-3 col-lg-4 text-center link text-primary" id="logo-container" href="/">
            <h1 id="logo">MAZAD</h1>
          </a>

          <div id="seperator" style={{ height: 420.16 }}></div>

          <form className="card-body" onSubmit={handleSubmit}>
            <h1 className="information py-2">Sign Up</h1>
            <div className="col-sm-12 col-md-12 col-lg-9 d-flex flex-column gap-3">
              <div className="row">
                <div className="col-sm-12">
                  <div className="form-group">
                    <OverlayTrigger trigger="focus" placement="top" overlay={popoverUsername}>
                      <input
                        className={`form-control ${!username.isValid ? "is-invalid" : ""}`}
                        type="text"
                        placeholder="Username"
                        id="name"
                        value={username.value}
                        onChange={(e) => {
                          handleInputChange();
                          handleUsernameChange(e);
                        }}
                        required
                        autoFocus
                      />
                    </OverlayTrigger>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-12">
                  <div className="form-group">
                    <OverlayTrigger trigger="focus" placement="top" overlay={popoverEmail}>
                      <input
                        className={`form-control ${!email.isValid ? "is-invalid" : ""}`}
                        type="text"
                        placeholder="Email"
                        id="email"
                        value={email.value}
                        onChange={(e) => {
                          handleInputChange();
                          handleEmailChange(e);
                        }}
                        required
                      />
                    </OverlayTrigger>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-12">
                  <div className="form-group">
                    <OverlayTrigger trigger="focus" placement="top" overlay={popoverPhoneNumber}>
                      <input
                        className={`form-control ${!phoneNumber.isValid ? "is-invalid" : ""}`}
                        type="text"
                        placeholder="Phone Number"
                        id="phone-number"
                        value={phoneNumber.value}
                        onChange={(e) => {
                          handleInputChange();
                          handlePhoneNumberChange(e);
                        }}
                        required
                      />
                    </OverlayTrigger>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-12">
                  <div className="form-group">
                    <OverlayTrigger className="overlay" trigger="focus" placement="top" overlay={popoverPassword}>
                      <input
                        className={`form-control ${!password.isValid ? "is-invalid" : ""}`}
                        type="password"
                        placeholder="Password"
                        id="password"
                        value={password.value}
                        onChange={(e) => {
                          handleInputChange();
                          handlePasswordChange(e);
                        }}
                        required
                      />
                    </OverlayTrigger>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-12">
                  <div className="form-group">
                    <input
                      className={`form-control ${!confirmPassword.isValid ? "is-invalid" : ""}`}
                      type="password"
                      placeholder="Confirm password"
                      id="confirm-password"
                      value={confirmPassword.value}
                      onChange={(e) => {
                        handleInputChange();
                        handleConfirmPasswordChange(e);
                      }}
                      required
                    />
                  </div>
                </div>
              </div>
              <button
                className="btn btn-secondary btn-block confirm-button"
                disabled={isRegistering} // Disable button while registering
              >
                {isRegistering ? <Spinner animation="border" size="sm" /> : "Create account"}
              </button>
              <div className=" d-flex flex-column text-center px-5 mt-3 mb-3">
                <a href="/login" style={{ cursor: "pointer" }} className="terms">
                  Already have an account
                </a>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
