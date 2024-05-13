import React, { useEffect, useRef, useState } from "react";
import ImageSlider from "../components/ImageSlider";
import * as api from "../api/index";
import "../assets/css/viewItem.css";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import MobileNavbar from "../components/MobileNavbar";
import ItemForm from "../components/ItemForm";
import { Modal } from "react-bootstrap";
import { useSnackbar } from "notistack";

import PageTitle from "../components/PageTitle";
import NotFound from "../components/NotFound";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import pusher from "../api/pusher";
import LoginForm from "../components/LoginForm";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

const ViewItem = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [messages, setMessages] = useState([]);
  const [bidModal, setBidModal] = useState(false);
  const [bidAmount, setBidAmount] = useState(0);
  const [highestBid, setHighestBid] = useState(0);
  const [highestBidder, setHighestBidder] = useState("");
  const [minimumBid, setMinimumBid] = useState(0);

  const [isInterest, setIsInterest] = useState(false);
  const [interestsCount, setInterestsCount] = useState(0);

  const [loginModal, setLoginModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [hideModal, setHideModal] = useState(false);
  const [reenlistModal, setReenlistModal] = useState(false);
  const [editModal, setEditModal] = useState(false);

  const isEdit = true;
  const inputRef = useRef(null);
  const activityTabRef = useRef(null);
  // EDIT
  const [description, setDescription] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [price, setPrice] = useState(0);
  const [minBid, setMinBid] = useState(1);

  const [tags, setTags] = useState([]);
  const [name, setName] = useState("");
  const [visibility, setVisibility] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [submitValid, setSubmitValid] = useState(true);
  const [droppedFiles, setDroppedFiles] = useState([]);
  const [showNumber, setShowNumber] = useState(false);

  const [bids, setBids] = useState([]);
  const [currentDescriptionLength, SetCurrentDescriptionLength] = useState(1);

  const quillRef = useRef();
  const bidInputRef = useRef(null);

  const handleBidModalShow = () => setBidModal(true);
  const handleBidModalClose = () => setBidModal(false);
  const handleLoginModalShow = () => setLoginModal(true);
  const handleLoginModalClose = () => setLoginModal(false);
  const handleDeleteModalShow = () => setDeleteModal(true);
  const handleDeleteModalClose = () => setDeleteModal(false);
  const handleHideModalShow = () => setHideModal(true);
  const handleHideModalClose = () => setHideModal(false);
  const handleReenlistModalShow = () => setReenlistModal(true);
  const handleReenlistModalClose = () => setReenlistModal(false);

  const handleEditModalShow = async () => {
    if (user && (user.id === item.userId || user.isAdmin)) {
      setDescription(item.description);
      // setCategories(item.Category);

      setPrice(item.Auction.highestBid);
      setMinBid(item.Auction.min_bid);
      let tags = item.Tags.map((tag) => tag.name);
      setTags(tags);
      setName(item.name);
      setVisibility(item.isHidden);
      setSubmitValid(true);
      setDroppedFiles(item.Images);
      setShowNumber(item.Auction.showNumber);
      setCalendarState({
        selection: {
          startDate: new Date(item.Auction.startTime),
          endDate: new Date(item.Auction.finishTime),
          key: "selection",
        },
      });
    }
    if (categories.length === 0) {
      setSelectedCategory(item.Category);
    }
    setEditModal(true);
  };
  const handleEditModalClose = () => setEditModal(false);
  const [calendarState, setCalendarState] = useState({
    selection: {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  });
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const user = JSON.parse(sessionStorage.getItem("user"));

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await api.getItemById(id);
        if (Object.keys(response.data).length) {
          setItem(response.data.item);
          setInterestsCount(response.data.item.interestsCount);
          setMessages(() => {
            return response.data.item.Comments.reverse().map((comment) => ({
              username: comment.User.username,
              text: comment.content,
              timestamp: new Date(comment.createdAt).getTime(),
              id: comment.User.id,
            }));
          });
          setIsInterest(response.data.item.isInterested || false);
          var channel = pusher.subscribe(`auction_${response.data.item.Auction.id}`);

          setBids(response.data.item.Auction.Bids[0]);

          channel.bind("add_bid", function (data) {
            // alert(JSON.stringify(data));

            setHighestBid(data.BidAmount);
            setHighestBidder(data.name);

            const bid = {
              username: data.name,
              text: `made a bid, ${data.BidAmount} JD`,
              timestamp: new Date().getTime(),
            };

            setBids(bid);
            setMessages((prevMessages) => [bid, ...prevMessages]);
          });
          channel.bind("add_comment", function (data) {
            // alert(JSON.stringify(data));

            const message = {
              username: data.name,
              text: data.content,
              timestamp: new Date().getTime(),
            };

            setMessages((prevMessages) => [message, ...prevMessages]);
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

  const handleCopyNumber = () => {
    if (!item.Auction.showNumber) return;
    navigator.clipboard.writeText(item.User.phoneNumber);
    enqueueSnackbar("Phone number copied to clipboard", { variant: "success" });
  };

  const handleChangeInterest = async (itemId) => {
    if (!user) {
      setLoginModal(true);
      return;
    }
    try {
      setIsInterest(!isInterest);

      isInterest ? setInterestsCount(interestsCount - 1) : setInterestsCount(interestsCount + 1);
      api
        .updateInterest(itemId)
        .then((res) => {})
        .catch((error) => {
          setIsInterest(!isInterest);
        });
    } catch (error) {
      console.error("Error updating interest:", error);
    }
  };

  const handleDelete = async () => {
    await deleteItem();
    setDeleteModal(false);
  };

  async function deleteItem() {
    await api
      .deleteItem(id)
      .then((result) => {
        enqueueSnackbar("Item deleted successfully", { variant: "success" });
        setTimeout(() => {
          window.location.href = "/home";
        }, 2000);
      })
      .catch((error) => {
        enqueueSnackbar(error, { variant: "error" });
      });
  }

  const handleHide = async () => {
    await hideItem();
    setDeleteModal(false);
  };

  async function hideItem() {
    await api
      .hideItem(id)
      .then((result) => {
        enqueueSnackbar("Item hidden successfully", { variant: "success" });
        setTimeout(() => {
          window.location.href = user.isAdmin ? "/user/" : "/user/" + item.User.id;
        }, 2000);
      })
      .catch((error) => {
        enqueueSnackbar(error, { variant: "error" });
      });
  }

  const handleReenlist = async () => {
    let start = calendarState.selection.startDate;
    let end = calendarState.selection.endDate;

    if (!start || !end) {
      enqueueSnackbar("Please select start and end dates", {
        variant: "error",
      });
      return;
    }

    const formData = new FormData();

    formData.append("startDate", start);
    formData.append("endDate", end);
    formData.append("itemId", item.id);

    await reenlist(formData);
    setReenlistModal(false);
    window.location.reload();
  };

  async function reenlist(formData) {
    const response = await api.reenlistItem(formData);
    if (response.status === 200) {
      enqueueSnackbar("Item reenlisted successfully", { variant: "success" });
      setTimeout(() => {
        window.location.href = user.isAdmin ? "/user/" : "/user/" + item.userId;
      }, 2000);
    } else {
      enqueueSnackbar("Error reenlisting item", { variant: "error" });
    }
  }

  const handleEdit = async () => {
    let desc = JSON.stringify(quillRef.current.getContents()["ops"]);
    if (
      !name ||
      name.length < 3 ||
      !desc.length ||
      !calendarState ||
      !calendarState.selection.startDate ||
      !calendarState.selection.endDate ||
      !selectedCategory ||
      !droppedFiles.length ||
      !price ||
      price < 0 ||
      !minBid ||
      minBid < 1 ||
      !tags
    ) {
      setSubmitValid(false);
      return;
    } else {
      setSubmitValid(true);
    }
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", desc);
    formData.append("startDate", calendarState.selection.startDate);
    formData.append("endDate", calendarState.selection.endDate);
    formData.append("categoryId", selectedCategory.id);
    formData.append("tags", tags);
    formData.append("price", price);
    formData.append("minBid", minBid);
    formData.append("showNumber", showNumber);
    formData.append("isHidden", visibility);

    droppedFiles.forEach((file) => {
      if (file.id) {
        formData.append("oldImages", file.id);
      } else {
        formData.append("images", file);
      }
    });

    try {
      setIsAddingItem(true);
      const response = await api.editItem(item.id, formData);
      enqueueSnackbar("Added item", { variant: "success" });
      setName("");
      setDescription("");
      window.location.href = visibility === true ? `/item/${response.data.id}` : `/profile`;
    } catch (error) {
      // Handle errors
      enqueueSnackbar(error.response.data.message, {
        variant: "error",
      });
      // reenable the button
      setIsAddingItem(false);
    }
  };

  const handleTimeChange = (e, type) => {
    const { value } = e.target;
    const { selection } = calendarState;
    const newDate = new Date(selection[type]);
    newDate.setHours(value.split(":")[0]);
    newDate.setMinutes(value.split(":")[1]);
    // if end date with the time is less than start date with the time, set the end date to be the same as the start date
    if (type === "endDate" && newDate < selection.startDate) {
      newDate.setHours(selection.startDate.getHours());
      newDate.setMinutes(selection.startDate.getMinutes());

      setCalendarState((prevState) => ({
        ...prevState,
        selection: {
          ...prevState.selection,
          endDate: newDate,
        },
      }));
    }

    if (type === "startDate") {
      setCalendarState((prevState) => ({
        ...prevState,
        selection: {
          ...prevState.selection,
          startDate: newDate,
        },
      }));
    } else if (type === "endDate") {
      setCalendarState((prevState) => ({
        ...prevState,
        selection: {
          ...prevState.selection,
          endDate: newDate,
        },
      }));
    }
  };

  const handleDateChange = (item) => {
    const selectedStartDate = item.selection.startDate;
    const selectedEndDate = item.selection.endDate;

    const differenceInMilliseconds = selectedEndDate - selectedStartDate;

    const differenceInDays = differenceInMilliseconds / (1000 * 3600 * 24);

    if (differenceInDays > 7) {
      const adjustedEndDate = new Date(selectedStartDate);
      adjustedEndDate.setDate(selectedStartDate.getDate() + 7);

      setCalendarState({
        ...calendarState,
        selection: {
          startDate: selectedStartDate,
          endDate: adjustedEndDate,
          key: "selection",
        },
      });
    } else {
      setCalendarState({
        ...calendarState,
        selection: {
          startDate: selectedStartDate,
          endDate: selectedEndDate,
          key: "selection",
        },
      });
    }
  };

  const handleMessage = async () => {
    if (!user) {
      setLoginModal(true);
      return;
    }
    const inputValue = inputRef.current.value;
    if (!inputValue) return;
    await api.sendMessage({
      itemId: item.id,
      content: inputValue,
      auctionId: item.Auction.id,
    });
    // const message = {
    //   username: user.username,
    //   text: inputValue,
    //   timestamp: new Date().getTime(),
    // };
    // setMessages([...messages, message]);
    inputRef.current.value = "";
  };

  const handleBid = async () => {
    if (!user) {
      setLoginModal(true);
      return;
    }
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
      await api.sendMessage({
        itemId: item.id,
        content: `Made a bid ${bidAmount} JD`,
        auctionId: item.Auction.id,
      });
    } catch (error) {
      enqueueSnackbar({
        message: "Error adding bid",
        variant: "error",
      });
      return;
    }
    setHighestBid(bidAmount);
    setBidAmount(0);

    handleBidModalClose();
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
          <div className="container-fluid p-3" id="view-item">
            {user && (user.id === item.userId || user.isAdmin) && (
              <div className="row-lg d-flex flex-row w-auto flex-wrap justify-content-start align-items-center mx-lg-3 mx-md-1 mx-sm-1">
                <div className="col-auto h-100 w-100 d-flex flex-row flex-wrap align-items-center justify-content-start gap-lg-3 gap-md-2 gap-1 bg-white py-2 px-3 border rounded">
                  {user.isAdmin === true ? (
                    <span className="col-auto d-lg-block d-md-block d-none">Admin controls</span>
                  ) : null}
                  {user.id === item.userId && !user.isAdmin === true ? (
                    <span className="col-auto">controls</span>
                  ) : null}

                  <button type="button" className="col-auto btn btn-sm btn-warning px-3" onClick={handleEditModalShow}>
                    Edit
                  </button>
                  {user.isAdmin === true ? (
                    <>
                      {!item.isHidden ? (
                        <button
                          type="button"
                          className="col-auto btn btn-sm btn-primary px-3"
                          onClick={handleHideModalShow}
                        >
                          Hide
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="col-auto btn btn-sm bg-secondary px-3"
                          onClick={handleReenlistModalShow}
                        >
                          Reenlist
                        </button>
                      )}

                      <button
                        type="button"
                        className="col-auto btn btn-sm btn-danger px-3"
                        onClick={handleDeleteModalShow}
                      >
                        Delete
                      </button>
                    </>
                  ) : null}
                </div>
              </div>
            )}
            <div className="d-flex flex-column flex-lg-row gap-1 column-gap-3 w-100" id="view-item-container">
              <div className="image-details col-12 col-lg-6 p-3 mb-5 bg-body rounded">
                <div className="d-flex flex-column justify-content-center align-items-center gap-3 w-100">
                  <div className="w-100 d-flex align-items center justify-content-center" style={{ height: "400px" }}>
                    <ImageSlider images={item.Images} />
                  </div>
                  <div className="details w-100 d-flex flex-column justify-content-start align-items-start gap-3">
                    <div className="d-flex justify-content-between align-items-center w-100 pe-4">
                      <h3>{item.name}</h3>
                      <div className="d-flex flex-row gap-3 align-items-center">
                        <span className="text-danger" onClick={handleChangeInterest} style={{ cursor: "pointer" }}>
                          {isInterest ? (
                            <FontAwesomeIcon icon="fa-solid fa-heart" className="liked" />
                          ) : (
                            <FontAwesomeIcon icon="fa-regular fa-heart" />
                          )}
                        </span>
                        <small className="text-muted">{interestsCount}</small>
                      </div>
                    </div>
                    <div
                      id="auctioneer-name"
                      className="row w-100 d-flex flex-row justify-content-start align-items-center"
                    >
                      <div className="row d-flex flex-row justify-content-start align-items-center gap-3">
                        <div className="col-auto">
                          <strong
                            style={{ cursor: "pointer" }}
                            onClick={() => (window.location.href = `/profile/${item.User.id}`)}
                          >
                            By {item.User.username}
                          </strong>
                        </div>
                        <div className="col-auto d-flex flex-row gap-3 align-items-center">
                          <span id="phone">
                            {item.Auction.showNumber
                              ? item.User.phoneNumber
                              : item.User.phoneNumber.slice(0, 3) + "****" + item.User.phoneNumber.slice(9, 10)}
                          </span>
                          {user && item.userId === user.id ? (
                            <i
                              className={item.Auction.showNumber ? "fas fa-eye-slash" : "fas fa-eye"}
                              style={{ cursor: "pointer" }}
                            ></i>
                          ) : item.Auction.showNumber ? (
                            <i className="fas fa-copy" style={{ cursor: "pointer" }} onClick={handleCopyNumber}></i>
                          ) : null}
                        </div>
                      </div>
                    </div>

                    <div className="d-flex flex-column col-auto">
                      <span className="d-flex flex-wrap gap-2">
                        <p
                          className="tag"
                          style={{
                            borderColor: "#00E175",
                            cursor: "pointer",
                            fontWeight: "bold",
                            opacity: "80%",
                          }}
                          onClick={() => (window.location.href = `/category-item/${item.Category.id}`)}
                        >
                          {item.Category.name}
                        </p>
                        {item.Tags.map((tag, idx) => (
                          <p className="tag" key={idx} style={{ fontWeight: "normal" }}>
                            {tag.name}
                          </p>
                        ))}
                      </span>
                    </div>
                    <div className="row d-flex flex-column w-100 p-3">
                      <h5>Details</h5>
                      <div className="border-start border-3 border-secondary p-3 bg-body">
                        <p id="desc" dangerouslySetInnerHTML={{ __html: item.description }}></p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="d-flex flex-column w-100 gap-3">
                <div className="d-flex gap-2 bg-body p-3">
                  <div className="rounded w-50 d-flex flex-column align-items-center justify-content-center">
                    {bids ? (
                      <div className="d-flex flex-column mb-2 align-items-center">
                        <h2 className="fw-bolder">{bids.User.username}</h2>
                        <h4 className="text-secondary py-2 px-3 my-1 mx-0">{bids.BidAmount} JD</h4>
                      </div>
                    ) : (
                      <h4 className=" text-black-50 ">No bids yet</h4>
                    )}
                  </div>
                  <div
                    style={{
                      borderLeft: "2px solid var(--primary-green)",
                      margin: "25px 0",
                    }}
                  ></div>
                  <div className="rounded p-3 w-75">
                    <h4 className="mb-4">Make a bid</h4>
                    <input
                      className="form-control border-2 rounded-3"
                      onChange={(e) => {
                        setBidAmount(e.target.value);
                      }}
                      ref={bidInputRef}
                      type="number"
                      min={parseInt(highestBid) + parseInt(minimumBid)}
                      placeholder="Enter bid amount"
                    ></input>
                    <div className="d-flex justify-content-between ">
                      <div className="d-flex justify-content-start ">
                        <small style={{ opacity: "80%" }}>minimum increasing: {item.Auction.min_bid}</small>
                      </div>
                      <div className="d-flex pt-3 justify-content-end gap-2">
                        <button
                          onClick={() => {
                            bidInputRef.current.value = highestBid + 5;
                            setBidAmount(bidInputRef.current.value);
                          }}
                          className="btn btn-secondary bg-white text-secondary"
                          style={{ padding: ".3px 3.5px", fontWeight: "600" }}
                        >
                          {highestBid + 5} JD
                        </button>
                        <button
                          onClick={() => {
                            bidInputRef.current.value = highestBid + 10;
                            setBidAmount(bidInputRef.current.value);
                          }}
                          className="btn btn-secondary bg-white text-secondary"
                          style={{ padding: "1px 3.5px", fontWeight: "600" }}
                        >
                          {highestBid + 10} JD
                        </button>
                        <button
                          onClick={() => {
                            bidInputRef.current.value = highestBid + 15;
                            setBidAmount(bidInputRef.current.value);
                          }}
                          className="btn btn-secondary bg-white text-secondary"
                          style={{ padding: "1px 3.5px", fontWeight: "600" }}
                        >
                          {highestBid + 20} JD
                        </button>
                      </div>
                    </div>
                    <button className="btn btn-secondary text-white p-1 px-3 mt-3" onClick={handleBid}>
                      Confirm
                    </button>
                  </div>
                </div>
                <div className="d-flex flex-column col-lg-6 col-sm-12 p-4 mb-5 bg-body rounded w-100">
                  <h4 className="mb-3">Comments</h4>
                  <div ref={activityTabRef} className="activity-tab">
                    {messages.length != 0 ? (
                      messages.map((message, index) => (
                        <div key={index} className="activity">
                          <div className="d-flex gap-5">
                            <span
                              style={{
                                color: "var(--primary-green)",
                                cursor: "pointer",
                                fontSize: "19px",
                                margin: "0",
                              }}
                              onClick={() => (window.location.href = `/profile/${message.id}`)}
                            >
                              {/* {message.username} */}
                              {user && message.username === user.username ? "You" : message.username}
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
                      ))
                    ) : (
                      <h6 className=" align-self-center m-auto text-black-50 ">
                        It looks like you're the first here, feel free to say hi in the comments or make a bid
                      </h6>
                    )}
                  </div>

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
                      className="form-control border-2 rounded-3 "
                      style={{ outline: "none", display: "inline" }}
                    />
                    <button className="btn btn-secondary" style={{ padding: "3px", color: "white" }} onClick={handleMessage}>
                      <FontAwesomeIcon
                        icon="fa-solid fa-arrow-up"
                        style={{
                          alignSelf: "center",
                          fontSize: "22px",
                          padding: "2px 5px",
                        }}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Modal show={deleteModal} onHide={handleDeleteModalClose}>
            <Modal.Header closeButton>
              <Modal.Title>Delete Auction and Item</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>
                Are you sure you want to delete this item?
                <br />
                <u>this action is irreversible!</u>
              </p>
            </Modal.Body>
            <Modal.Footer>
              <button className="btn btn-secondary" onClick={handleDelete}>
                Confirm
              </button>
            </Modal.Footer>
          </Modal>
          <Modal show={hideModal} onHide={handleHideModalClose}>
            <Modal.Header closeButton>
              <Modal.Title>Hide Auction and Item</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>
                Are you sure you want to Hide this item?
                <br />
                <span>you can show it again later, other users will not be able to see this item!</span>
              </p>
            </Modal.Body>
            <Modal.Footer>
              <button className="btn btn-secondary" onClick={handleHide}>
                Confirm
              </button>
            </Modal.Footer>
          </Modal>
          <Modal show={reenlistModal} onHide={handleReenlistModalClose}>
            <Modal.Header closeButton>
              <Modal.Title>Reenlist Auction and Item</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>
                Are you sure you want to reenlistModal this item?
                <br />
                <span>This will make the item visible to other users</span>
              </p>
              <div className="row d-flex flex-row w-auto gap-3">
                <div className="col-md-auto col-sm-12">
                  <DateRange
                    editableDateInputs={true}
                    onChange={handleDateChange}
                    moveRangeOnFirstSelection={false}
                    ranges={[calendarState.selection]}
                    minDate={new Date()}
                    color="#50B584"
                    rangeColors={["#50B584"]}
                  />
                </div>
                <div
                  className="col-lg-auto col-sm-12 d-flex flex-row justify-content-between gap-3"
                  style={{ minWidth: "365px" }}
                >
                  <div className="col-6">
                    <label htmlFor="start-time" className="form-label">
                      <b>On: </b>
                      {calendarState.selection.startDate.toDateString()}
                      <br />

                      <b>At:</b>
                    </label>
                    <input
                      type="time"
                      className="form-control"
                      id="start-time"
                      name="start-time"
                      value={
                        calendarState.selection.startDate
                          ? `${String(calendarState.selection.startDate.getHours()).padStart(2, "0")}:${String(
                              calendarState.selection.startDate.getMinutes()
                            ).padStart(2, "0")}`
                          : ""
                      }
                      onChange={(e) => handleTimeChange(e, "startDate")}
                      required
                    />
                  </div>
                  <div className="col-6">
                    <label htmlFor="end-time" className="form-label">
                      <b>Until: </b>
                      {calendarState.selection.endDate
                        ? calendarState.selection.endDate.toDateString()
                        : calendarState.selection.startDate.toDateString()}{" "}
                      <br />
                      <b>At:</b>
                    </label>
                    <input
                      type="time"
                      className="form-control"
                      id="end-time"
                      name="end-time"
                      value={
                        calendarState.selection.endDate
                          ? `${String(calendarState.selection.endDate.getHours()).padStart(2, "0")}:${String(
                              calendarState.selection.endDate.getMinutes()
                            ).padStart(2, "0")}`
                          : ""
                      }
                      onChange={(e) => handleTimeChange(e, "endDate")}
                      required
                    />
                  </div>
                </div>
                <small className="text-muted row ms-1">At least 1 hour, not more that 7 days</small>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <button className="btn btn-secondary" onClick={handleReenlist}>
                Confirm
              </button>
            </Modal.Footer>
          </Modal>
          <Modal show={loginModal} centered onHide={handleLoginModalClose}>
            <Modal.Header closeButton>
              <Modal.Title>Login</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>To perform this action you must be logged in</p>
              <LoginForm {...{ next: window.location.href }} />
            </Modal.Body>
            {/* <Modal.Footer>
              <button className="btn btn-primary" onClick={handleLoginModalClose}>
                cancel
              </button>
            </Modal.Footer> */}
          </Modal>
          <Modal show={editModal} onHide={handleEditModalClose} size="xl">
            <Modal.Header closeButton>
              <Modal.Title>Edit</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <ItemForm
                {...{
                  description,
                  setDescription,
                  categories,
                  isFetching,
                  price,
                  setPrice,
                  minBid,
                  setMinBid,
                  tags,
                  setTags,
                  name,
                  setName,
                  visibility,
                  setVisibility,
                  selectedCategory,
                  setSelectedCategory,
                  submitValid,
                  setSubmitValid,
                  droppedFiles,
                  setDroppedFiles,
                  showNumber,
                  setShowNumber,
                  calendarState,
                  setCalendarState,
                  currentDescriptionLength,
                  SetCurrentDescriptionLength,
                  quillRef,
                  isAddingItem,
                  setIsAddingItem,
                  setCategories,
                  setIsFetching,
                  isEdit,
                }}
              />
            </Modal.Body>
            <Modal.Footer>
              <div className="w-100 d-flex justify-content-center">
                <button className="btn btn-warning px-5" onClick={handleEdit}>
                  Edit
                </button>
              </div>
              <button className="btn btn-primary" onClick={handleEditModalClose}>
                Cancel
              </button>
            </Modal.Footer>
          </Modal>
          <MobileNavbar />
        </>
      )}
    </>
  );
};

export default ViewItem;
