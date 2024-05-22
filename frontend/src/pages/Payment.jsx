import React, { useState } from "react";
import Navbar from "../components/Navbar";
import MobileNavbar from "../components/MobileNavbar";
import PageTitle from "../components/PageTitle";
import "../assets/css/payment.css";
import { useParams } from "react-router-dom";
import * as api from "../api/index";
import { useSnackbar } from "notistack";

const Payment = () => {
  const { id, price }=useParams();
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [formData, setFormData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false); 
  const { enqueueSnackbar } = useSnackbar();


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const paymentDetails = {
      name,
      number,
      expiry,
      cvc,
    };

    setFormData(paymentDetails);
    
    try{
      const response = await api.auctionPayment(id);
      enqueueSnackbar("Payment Successful", { variant: "success" });
      setTimeout(() => {
        window.location.href = "/home";
      }, 300);

    }catch (err){
      enqueueSnackbar(err.response?.data?.message || "Error fetching auction", { variant: "error" });
    } finally {
      setIsSubmitting(false);
    }
    // send API request to backend, include auction id, user id, and payment details
    // Perform backend validation to ensure the user is the actual winner before processing the payment
  };

  return (
    <>
      <Navbar />
      <div className="d-flex justify-content-center gap-5 m-5 w-auto">
        <div
          className="d-flex flex-column align-items-center p-3 bg-white"
          style={{ border: "1px solid #ced4da", borderRadius: "0.25rem" }}
        >
          <h1>Payment</h1>
          <div className="d-flex flex-row justify-content-around w-100 mb-3">
            <div
              className="d-flex justify-content-center align-items-center rounded-circle"
              style={{
                width: "50px",
                height: "50px",
                border: "1px solid #ced4da",
              }}
            >
              <h1 className="m-0" style={{ fontSize: "2rem" }}>
                1
              </h1>
            </div>
            <div
              className="d-flex justify-content-center align-items-center rounded-circle bg-secondary"
              style={{
                width: "50px",
                height: "50px",
                border: "1px solid #ced4da",
              }}
            >
              <h1 className="m-0 text-white" style={{ fontSize: "2rem" }}>
                2
              </h1>
            </div>
            
          </div>
          <h4 className="align-self-start">Payment Amount: {price} JD</h4>
          <form
            onSubmit={handleSubmit}
            className="d-flex flex-column gap-3 w-100"
          >
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                className="form-control"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="number">Card Number</label>
              <input
                type="text"
                className="form-control"
                id="number"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                required
                maxLength={16}
              />
            </div>
            <div className="d-flex flex-row">
              <div className="form-group m-1">
                <label htmlFor="expiry">Expiry Date</label>
                <input
                  type="date"
                  className="form-control"
                  id="expiry"
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  required
                />
              </div>
              <div className="form-group m-1">
                <label htmlFor="cvc">CVC</label>
                <input
                  type="text"
                  className="form-control"
                  id="cvc"
                  value={cvc}
                  onChange={(e) => setCvc(e.target.value)}
                  required
                  maxLength={3}
                />
              </div>
            </div>

            <button
              type="submit"
              className="submit-button btn btn-secondary w-auto text-white px-5"
              disabled={isSubmitting}
            >
              Continue
            </button>
          </form>
        </div>
      </div>
      <MobileNavbar />
    </>
  );
};

export default Payment;
