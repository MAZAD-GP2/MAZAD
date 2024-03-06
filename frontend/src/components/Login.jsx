import React, { useState } from "react";
import "./register.css";
import axios from "axios";

function Login() {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    await axios
      .post("http://localhost:3000/user/login", {
        usernameOrEmail,
        password,
      })
      .then(() => {
        alert("nb3tat login");
        setUsernameOrEmail("");
        setPassword("");
      })
      .catch(() => alert("errrrr"));
  };

  return (
    <div className="container mt-5 mb-5 d-flex justify-content-center">
      <div className="card px-1 py-4">
        <form className="card-body" onSubmit={handleSubmit}>
          <h1 className="information mt-4">Sign up</h1>
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
            </div>
          </div>
          <div className=" d-flex flex-column text-center px-5 mt-3 mb-3">
            <a href="/register" className="terms">
              Doesnt have an account
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

export default Login;
