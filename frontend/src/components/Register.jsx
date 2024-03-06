import React, { useState } from "react";
import "./register.css";
import axios from "axios";
import { useSnackbar } from "notistack";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = async (event) => {
    event.preventDefault();
    await axios
      .post("http://localhost:3000/user/register", {
        username,
        password,
        email,
        phoneNumber,
      })
      .then(() => {
        // alert("nb3tat");
        setEmail("");
        setPhoneNumber("");
        setUsername("");
        setPassword("");
        enqueueSnackbar("User Created Successfully", { variant: "success" });
      })
      .catch(() => {
        // alert("errrrr");
        enqueueSnackbar("Error", { variant: "error" });
      });
  };

  return (
    <div className="container mt-5 mb-5 d-flex justify-content-center">
      <div className="card px-1 py-4">
        <form className="card-body" onSubmit={handleSubmit}>
          <h1 className="information mt-4">Sign up</h1>
          <div className="row">
            <div className="col-sm-12">
              <div className="form-group">
                <input
                  className="form-control"
                  type="text"
                  placeholder="Name"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-12">
              <div className="form-group">
                <div className="input-group">
                  <input
                    className="form-control"
                    type="text"
                    placeholder="Phone Number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
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
                    type="text"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                    placeholder="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
          </div>
          <div className=" d-flex flex-column text-center px-5 mt-3 mb-3">
            <a href="/login" className="terms">
              Already have an account
            </a>
          </div>
          <button className="btn btn-primary btn-block confirm-button">
            Confirm
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
