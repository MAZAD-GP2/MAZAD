import React, { useState, useRef, useEffect } from "react";
import * as api from "../api/index";
import { Modal } from "react-bootstrap";
import moment from "moment-timezone";

const WonAuction = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  const [bids, setBids] = useState(null);
  const [winnerModal, setWinnerModal] = useState(false);
  const [closeConfirmModal, setCloseConfirmModal] = useState(false);
  const [show, setShow] = useState(false);
  const handleWinnerModalClose = () => {
    setWinnerModal(false);
    setCloseConfirmModal(true);
  };

  const handleWinnerModalShow = () => {
    setWinnerModal(true);
  };

  const handleCloseConfirmModalGoBack = () => {
    setCloseConfirmModal(false);
    setWinnerModal(true);
  };

  const handleCloseConfirmModalIgnore = () => {
    setCloseConfirmModal(false);
    setShow(false);
  };
  useEffect(() => {
    if (!user) return;
    const fetchCategories = async () => {
      try {
        const bids = await api.getUnpaidAuctions();
        setBids(bids.data);
        if (bids.data.length > 0) {
          handleWinnerModalShow();
          setShow(true);
        } else {
          handleWinnerModalClose();
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchCategories();
  }, []);

  const formattedDate = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    return `${startDate.toDateString()} - ${endDate.toDateString()}`;
  };

  const overSince = (end) => {
    // returns how long ago the auction ended
    const endDate = new Date(end);
    let now = moment().tz("Asia/Amman");

    let duration = moment.duration(now.diff(endDate));
    let hours = duration.asHours();
    let days = duration.asDays();
    let months = duration.asMonths();
    let years = duration.asYears();

    if (hours < 1) {
      return `Ended ${Math.floor(duration.asMinutes())} minutes ago`;
    }
    if (days < 1) {
      return `Ended ${Math.floor(duration.asHours())} hours ago`;
    }
    if (months < 1) {
      return `Ended ${Math.floor(duration.asDays())} days ago`;
    }
  };
  return (
    <>
      {show && (
        <>
          <Modal show={winnerModal} onHide={handleWinnerModalClose} size="xl">
            <Modal.Header closeButton>
              <Modal.Title>Important!</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="d-flex flex-column gap-2">
                <span className="h5">Congratulations You Won!!</span>
                <span className="h6 p-3">
                  Please proceed to payment as soon as possible, to obtain your
                  item!
                </span>
              </div>
              <div className="d-flex flex-column justify-content-center">
                {bids &&
                  bids.map((bid) => (
                    <div className="d-flex flex-row flex-wrap justify-content-between gap-3 p-3 border rounded shadow">
                      <div
                        className="d-flex flex-column justify-content-center gap-1"
                        style={{ minWidth: 0 }}
                      >
                        <a
                          className="h5 card-title text-truncate"
                          href={`/item/${bid.Auction.Item.id}`}
                        >
                          {bid.Auction.Item.name}
                        </a>

                        <span>{overSince(bid.Auction.finishTime)}</span>
                        <div className="d-flex flex-column justify-content-center">
                          <span className="h4">
                            Final price:{" "}
                            <b className="text-secondary">{bid.bidAmount} JD</b>
                          </span>
                        </div>
                      </div>

                      <div className="d-flex flex-row justify-content-center align-items-center">
                        <a
                          href={`/checkout/${bid.Auction.id}`}
                          className="btn btn-secondary text-white"
                        >
                          Pay now
                          <i className="fas fa-credit-card ms-2"></i>
                        </a>
                      </div>
                    </div>
                  ))}
              </div>
            </Modal.Body>
            <Modal.Footer>
              <button
                className="btn btn-primary"
                onClick={handleWinnerModalClose}
              >
                Close
              </button>
            </Modal.Footer>
          </Modal>

          <Modal
            show={closeConfirmModal}
            onHide={handleCloseConfirmModalIgnore}
          >
            <Modal.Header closeButton>
              <Modal.Title>
                Warning{" "}
                <i className="fas fa-exclamation-triangle text-warning"></i>
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <span>
                Please be aware that unpaid auctions will result in a
                <b> ban on your account. </b>To avoid this, kindly complete your
                payment within two days of the winning the auction to secure
                your item.<br/><br/> Thank you for your prompt attention to this matter.
              </span>
            </Modal.Body>
            <Modal.Footer>
              <button
                className="btn btn-primary"
                onClick={handleCloseConfirmModalGoBack}
              >
                Pay now
              </button>
            </Modal.Footer>
          </Modal>
        </>
      )}
    </>
  );
};

export default WonAuction;
