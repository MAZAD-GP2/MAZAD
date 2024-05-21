import React, { useState, useRef } from "react";
import Navbar from "../components/Navbar";
import MobileNavbar from "../components/MobileNavbar";
import PageTitle from "../components/PageTitle";
import "../assets/css/payment.css";

const Payment = () => {
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [formData, setFormData] = useState(null);

  const handleSubmit = () => {
    // send api to backend, include auction id, user id

    // backend validation, before setting isPaid true, make sure that the user is the actual winner, by checking the last bid, and get the user from within the bid <3.
  };

  return (
    <>
      <Navbar />
      <PageTitle title={"Payment"} />
      <div className="container p-3">
        <div className="d-flex flex-column justify-content-start border rounded shadow p-3 h-100">
          {/* fofo create responsive frontend for taking in card info */}
        </div>
      </div>
      <MobileNavbar />
    </>
  );
};

export default Payment;
