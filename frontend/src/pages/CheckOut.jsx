import React, { useState, useEffect } from "react";
import "../assets/css/profile.css";
import Navbar from "../components/Navbar";
import { useSnackbar } from "notistack";
import MobileNavbar from "../components/MobileNavbar";
import * as api from "../api/index";
import { useParams } from "react-router-dom";
import { OverlayTrigger, Popover } from "react-bootstrap";

const CheckOut = () => {
  const { id } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(true);
  const [auction, setAuction] = useState(null);
  const [price, setPrice]=useState(0);

  useEffect(() => {
    const fetchAuction = async () => {
      try {
        const response = await api.getAuctionById(id);
        setAuction(response.data);
        setPrice(response.data.highestBid/100*5 +response.data.highestBid);
      } catch (err) {
        enqueueSnackbar(err.response?.data?.message || "Error fetching auction", { variant: "error" });
      } finally {
        setLoading(false);
      }
    };
    fetchAuction();
  }, [id, enqueueSnackbar]);

  if (loading) {
    return (
      <div className="text-center w-100 mt-5">
        <div className="spinner-border text-primary opacity-25" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!auction) {
    return <div>Not Found</div>;
  }

  const formatDateStartTime = (dateTime, finishTime) => {
    const options = {
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    };
    const currentDate = new Date();
    const formattedDate = new Date(dateTime).toLocaleDateString(undefined, options);

    if (new Date(dateTime) < currentDate && new Date(finishTime) > currentDate) {
      return (
        <div className="d-flex flex-row align-items-center gap-1">
          <span>Live</span>
          <span>
            <i className="text-secondary fa-solid fa-circle fa-beat fa-xs"></i>
          </span>
        </div>
      );
    } else if (new Date(finishTime) < currentDate) {
      return (
        <div className="d-flex flex-row align-items-center gap-1">
          <s>{formattedDate}</s>
        </div>
      );
    } else {
      return <small className="text-muted">{formattedDate}</small>;
    }
  };

  const formatDateFinishTime = (dateTime) => {
    const options = {
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    };
    const formattedDate = new Date(dateTime).toLocaleDateString(undefined, options);
    if (new Date(dateTime) < new Date()) {
      return (
        <div className="d-flex flex-row align-items-center gap-1">
          <s>{formattedDate}</s>
        </div>
      );
    }
    return <small className="text-muted">{formattedDate}</small>;
  };

  const popoverFee = (
    <Popover id="popover-fee">
      <Popover.Header>5% Service Fee</Popover.Header>
      <Popover.Body>
        <small>
          This fee helps cover operational costs and ensures the platform's reliability and security.
        </small>
      </Popover.Body>
    </Popover>
  );

  return (
    <>
      <Navbar />
      <div className="d-flex justify-content-center gap-5 m-5 w-auto">
        <div
          className="d-flex flex-column align-items-center p-3 bg-white"
          style={{ border: "1px solid #ced4da", borderRadius: "0.25rem" }}
        >
          <h1>Check Out</h1>
          <div className="d-flex flex-row justify-content-around w-100 mb-3">
            <div
              className="d-flex justify-content-center align-items-center rounded-circle bg-secondary"
              style={{ width: "50px", height: "50px", border: "1px solid #ced4da" }}
            >
              <h1 className="m-0 text-white" style={{ fontSize: "2rem" }}>
                1
              </h1>
            </div>
            <div
              className="d-flex justify-content-center align-items-center rounded-circle bg-light"
              style={{ width: "50px", height: "50px", border: "1px solid #ced4da" }}
            >
              <h1 className="m-0" style={{ fontSize: "2rem" }}>
                2
              </h1>
            </div>
            
          </div>
          <div
            className="bid-card d-flex flex-row gap-3 p-3 bg-white rounded-3"
            style={{ border: "1px solid #ced4da", borderRadius: "0.25rem" }}
          >
            <img
              src={auction.Item.Images[0]?.imgURL || "https://via.placeholder.com/150"}
              alt="item"
              className="bid-item-img object-fit-cover shadow rounded-3"
              width={110}
              height={110}
            />
            <div className="d-flex flex-column gap-2">
              <div className="d-flex flex-column gap-0 w-100 text-truncate">
                <a href={`/item/${auction.Item.id}`} className="link text-primary">
                  <h4 className="text-truncate">{auction.Item.name}</h4>
                </a>
                <div className="d-flex flex-row gap-2 align-items-center">
                  <small>{formatDateStartTime(auction.startTime, auction.finishTime)}</small>
                  <i className="fa fa-arrow-right fa-sm text-secondary"></i>
                  <small>{formatDateFinishTime(auction.finishTime)}</small>
                </div>
              </div>
              <div className="col d-flex flex-column">
                <p>
                  <span>Amount:</span>{" "}
                  <b className="text-secondary">{auction.highestBid} JD</b>
                </p>
                <p>
                  <span>On: </span>
                  <b>{new Date(auction.createdAt).toLocaleDateString()}</b>
                  <span> At: </span>
                  <b>{new Date(auction.createdAt).toLocaleTimeString()}</b>
                </p>
              </div>
            </div>
          </div>
          <div className="p-3" style={{ alignSelf: "flex-start" }}>
            <h4>Payment Summary</h4>
            <h6>Subtotal: {auction.highestBid} JD</h6>
            <div className="title d-flex flex-row justify-content-start align-items-center gap-3">
              <h6 className="m-0">Fees: {auction.highestBid/100*5} JD</h6>
              <div style={{ cursor: "pointer" }}>
                <OverlayTrigger
                  className="overlay"
                  trigger="click"
                  placement="top"
                  style={{ cursor: "pointer" }}
                  overlay={popoverFee}
                  rootClose
                >
                  <div>
                    <i className="fa fa-question-circle fa-sm"></i>
                  </div>
                </OverlayTrigger>
              </div>
            </div>
            <h5 className="mt-3">Total amount: {price} JD</h5>
          </div>
          <button className="submit-button btn btn-secondary w-auto text-white px-5" onClick={()=>window.location.href=`/payment/${id}/${price}`}>
            Continue
          </button>
        </div>
      </div>
      <MobileNavbar />
    </>
  );
};

export default CheckOut;
