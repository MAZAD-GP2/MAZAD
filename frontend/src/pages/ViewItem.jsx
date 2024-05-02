import React, { useEffect, useRef, useState } from "react";
import ImageSlider from "../components/ImageSlider";
import * as api from "../api/index";
import "../assets/css/viewItem.css";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import MobileNavbar from "../components/MobileNavbar";
import { Modal } from "react-bootstrap";
import { useSnackbar } from "notistack";

import PageTitle from "../components/PageTitle";
import NotFound from "../components/NotFound";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import pusher from "../api/pusher";

const ViewItem = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [interest, setInterest] = useState(false);
  const [messages, setMessages] = useState([]);
  const [bidModal, setBidModal] = useState(false);
  const [bidAmount, setBidAmount] = useState(0);
  const [highestBid, setHighestBid] = useState(0);
  const [minimumBid, setMinimumBid] = useState(0);

  const inputRef = useRef(null);
  const activityTabRef = useRef(null);

  const handleClose = () => setBidModal(false);
  const handleShow = () => setBidModal(true);

  const user = JSON.parse(sessionStorage.getItem("user"));
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await api.getItemById(id);
        if (Object.keys(response.data).length) {
          setItem(response.data.item);
          setInterest(response.data.interests ? true : false);
          // const auction = await api.getAuctionByItem(id);
          var channel = pusher.subscribe(`auction_${response.data.item.Auction.id}`);

          channel.bind("add_bid", function (data) {
            // alert(JSON.stringify(data));
            setHighestBid(data.BidAmount);

            const bid = {
              username: data.name,
              text: `made a bid, ${data.BidAmount} JD`,
              timestamp: new Date().getTime(),
            };

            setMessages((prevMessages) => [...prevMessages, bid]);
          });
          channel.bind("add_comment", function (data) {
            // alert(JSON.stringify(data));

            const message = {
              username: data.name,
              text: data.content,
              timestamp: new Date().getTime(),
            };

            setMessages((prevMessages) => [...prevMessages, message]);
          });
          setMinimumBid(response.data.item.Auction.min_bid);
          setHighestBid(response.data.item.Auction.highestBid);
        }
        if (!response.data.item) navigate("/not-found", { replace: true }); // response is {"item": null}
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchItem();
  }, [id]);

  useEffect(() => {
    // Scroll to the bottom of the container whenever messages change
    if (activityTabRef.current) {
      const lastMessage = activityTabRef.current.lastElementChild;
      if (lastMessage) {
        lastMessage.scrollIntoView({ behavior: "smooth", block: "end" });
      }
    }
  }, [messages]);

  if (loading) {
    return (
      <div className=" text-center w-100 mt-5">
        <div className="spinner-border text-primary opacity-25" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  async function changeInterest() {
    if (interest) {
      await api.removeInterest(item.id);
    } else {
      await api.addInterest(item.id);
    }
    setInterest(!interest);
  }

  async function DeleteItem() {
    await api
      .deleteItem(id)
      .then((result) => {
        enqueueSnackbar("Item deleted successfully", { variant: "success" });
        setTimeout(() => {
          window.location.href = "/";
        }, 1000);
      })
      .catch((error) => {
        enqueueSnackbar(error, { variant: "error" });
      });
  }

  const handleMessage = async () => {
    const inputValue = inputRef.current.value;
    if (!inputValue) return;
    await api.sendMessage({ itemId: item.id, content: inputValue, auctionId: item.Auction.id });
    // const message = {
    //   username: user.username,
    //   text: inputValue,
    //   timestamp: new Date().getTime(),
    // };
    // setMessages([...messages, message]);
    inputRef.current.value = "";
  };

  const handleBid = async () => {
    if (!bidAmount) {
      enqueueSnackbar({
        message: "Bid amount cannot be empty",
        variant: "error",
      });
      return;
    }
    if (isNaN(parseFloat(bidAmount))) {
      enqueueSnackbar({
        message: "Bid amount must be a number",
        variant: "error",
      });
      return;
    }
    if (parseFloat(bidAmount) <= highestBid) {
      enqueueSnackbar({
        message: "Bid amount must be greater than the highest bid",
        variant: "error",
      });
      return;
    }
    let res = null;
    try {
      res = await api.addBid({ bidAmount, auctionId: item.Auction.id });
    } catch (error) {
      enqueueSnackbar({
        message: "Error adding bid",
        variant: "error",
      });
      return;
    }

    setBidAmount(0);

    handleClose();
  };

  const handleQuickbid = async () => {
    const newBidAmount = highestBid + minimumBid;
    // setHighestBid(newBidAmount);

    // const bid = {
    //   username: res.data.name,
    //   text: `made a bid, ${newBidAmount} JD`,
    //   timestamp: new Date().getTime(),
    // };
    // setMessages([...messages, bid]);
    handleClose();
  };

  // Function to format timestamp as "x time ago"
  const getTimeAgo = (timestamp) => {
    const now = new Date().getTime();
    const diff = now - timestamp;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days} day${days > 1 ? "s" : ""} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    } else if (minutes > 0) {
      return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    } else if (seconds > 0) {
      return `${seconds} second${seconds > 1 ? "s" : ""} ago`;
    } else {
      return "Just now";
    }
  };

  return (
    <>
      {item && (
        <>
          <Navbar />
          <PageTitle title="Auction" />
          <div className="d-flex flex-column flex-lg-row gap-1 column-gap-3 w-100" id="view-item-container">
            <div className="image-details col-12 col-lg-6 p-3 mb-5 bg-body rounded">
              <div className="d-flex flex-column justify-content-center align-items-center gap-3 w-100">
                <div className="w-100">
                  <ImageSlider images={item.Images} />
                </div>
                <div className="details w-100 d-flex flex-column justify-content-start align-items-start gap-3">
                  <div className="d-flex gap-4 ">
                    <h3>{item.name}</h3>
                    {user && (
                      <span className="text-danger" onClick={changeInterest} style={{ cursor: "pointer" }}>
                        {interest ? (
                          <FontAwesomeIcon icon="fa-solid fa-heart" style={{ marginTop: "50%" }} />
                        ) : (
                          <FontAwesomeIcon icon="fa-regular fa-heart" style={{ marginTop: "50%" }} />
                        )}
                      </span>
                    )}
                  </div>
                  <div
                    id="auctioneer-name"
                    className="row w-100 d-flex flex-row justify-content-between align-items-center"
                  >
                    <div className="row">
                      <p
                        style={{ cursor: "pointer" }}
                        onClick={() => (window.location.href = `/profile/${item.User.id}`)}
                      >
                        By {item.User.username}
                      </p>
                    </div>
                    <div className="d-flex flex-column col-auto">
                      <span className="d-flex flex-wrap gap-2">
                        <p className="tag" style={{ borderColor: "#00E175" }}>
                          {item.Category.name}
                        </p>
                        {item.Tags.map((tag, idx) => (
                          <p className="tag" key={idx} style={{ fontWeight: "normal" }}>
                            {tag.name}
                          </p>
                        ))}
                      </span>
                    </div>
                  </div>
                  <div className="row d-flex flex-column w-100 p-3">
                    <h5>Details</h5>
                    <div className="border-start border-3 border-secondary p-3 bg-body">
                      <p id="desc" dangerouslySetInnerHTML={{ __html: item.description }}></p>
                    </div>
                  </div>
                  {user && user.isAdmin && (
                    <button type="button" className="btn btn-danger px-3" onClick={DeleteItem}>
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
            <div className="d-flex flex-column col-lg-6 col-sm-12 p-4 mb-5 bg-body rounded">
              <h3>Activity</h3>
              <div ref={activityTabRef} className="activity-tab">
                {messages.map((message, index) => (
                  <div key={index} className="activity">
                    <div className="d-flex gap-5">
                      <span
                        style={{
                          color: "var(--primary-green)",
                          cursor: "pointer",
                          fontSize: "19px",
                          margin: "0",
                        }}
                      >
                        {/* {message.username} */}
                        {message.username === user.username ? "You" : message.username}
                      </span>
                      <p
                        style={{
                          color: "rgba(0,0,0,.4)",
                          fontSize: "12px",
                          marginLeft: "auto",
                          marginBottom: "0",
                          alignSelf: "center",
                        }}
                      >
                        {getTimeAgo(message.timestamp)}
                      </p>
                    </div>

                    <div
                      style={{
                        fontSize: "14px",
                        margin: "8px 0",
                      }}
                    >
                      {message.text}
                    </div>
                  </div>
                ))}
              </div>
              {user && (
                <div className="chat-box">
                  <input
                    type="text"
                    ref={inputRef}
                    placeholder="Enter a message"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && e.target.value) {
                        handleMessage();
                        e.target.value = "";
                      }
                    }}
                    className="form-control border-1 rounded-3 "
                    style={{ outline: "none", display: "inline" }}
                  />
                  <button className="btn btn-secondary" style={{ padding: "2px" }} onClick={handleShow}>
                    <FontAwesomeIcon
                      icon="fa-solid fa-gavel"
                      style={{
                        alignSelf: "center",
                        fontSize: "22px",
                        padding: "2px 5px",
                      }}
                    />
                  </button>
                  <button className="btn btn-secondary" style={{ padding: "2px" }} onClick={handleMessage}>
                    <FontAwesomeIcon
                      icon="fa-solid fa-arrow-up"
                      style={{
                        alignSelf: "center",
                        fontSize: "22px",
                        padding: "2px 5px",
                      }}
                    />
                  </button>
                  <Modal show={bidModal} onHide={handleClose}>
                    <Modal.Header closeButton>
                      <Modal.Title>Make bid</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <p>Enter bid Amount, or make a quick bid (10% of highest bid)</p>
                      <input
                        type="number"
                        min={parseInt(highestBid) + parseInt(minimumBid)}
                        className="form-control border-1 rounded-3 "
                        onChange={(e) => {
                          setBidAmount(e.target.value);
                        }}
                      />
                    </Modal.Body>
                    <Modal.Footer>
                      <button className="btn btn-secondary" onClick={handleQuickbid}>
                        Quick bid
                      </button>
                      <button className="btn btn-secondary" onClick={handleBid}>
                        Confirm
                      </button>
                    </Modal.Footer>
                  </Modal>
                </div>
              )}
            </div>
          </div>
          <MobileNavbar />
        </>
      )}
    </>
  );
};

export default ViewItem;
