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

  const [comments, setComments] = useState([]);
  const [bidModal, setBidModal] = useState(false);
  const [bidAmount, setBidAmount] = useState(0);

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
  const [status, setStatus] = useState("new");

  const [tags, setTags] = useState([]);
  const [name, setName] = useState("");
  const [visibility, setVisibility] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [submitValid, setSubmitValid] = useState(true);
  const [droppedFiles, setDroppedFiles] = useState([]);
  const [showNumber, setShowNumber] = useState(false);

  const [lastBid, setLastBid] = useState([]);
  const [currentDescriptionLength, SetCurrentDescriptionLength] = useState(1);

  const quillRef = useRef();
  const bidInputRef = useRef(null);

  const handleBidModalShow = () => {
    if (!user) {
      setLoginModal(true);
      return;
    }
    if (user.id === item.userId) {
      enqueueSnackbar("You cannot bid on your own item", { variant: "error" });
      return;
    }
    if (item.Auction.finishTime < new Date()) {
      enqueueSnackbar("Auction has ended", { variant: "error" });
      return;
    }
    if (item.Auction.startTime > new Date()) {
      enqueueSnackbar("Auction has not started yet", { variant: "error" });
      return;
    }

    if (bidAmount && bidAmount <= lastBid.bidAmount) {
      enqueueSnackbar("Bid amount must be greater than the highest bid", {
        variant: "error",
      });
      return;
    }

    setBidModal(true);
  };

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
        const itemData = await api.getItemById(id);
        const AuctionBids = await api.getBidsByAuction(
          itemData.data.item.Auction.id
        );
        let startDate = new Date(itemData.data.item.startTime);
        let finishDate = new Date(itemData.data.item.finishDate);
        let now = new Date();
        if (finishDate < now) {
          setStatus("over");
        }
        if (startDate < now) {
          setStatus("live");
        } else {
          setStatus("new");
        }

        // merge comments and bids, based on createdAt
        let allActivities = [];
        if (itemData.data.item.Comments && AuctionBids.data) {
          allActivities = [...itemData.data.item.Comments, ...AuctionBids.data];
        } else if (itemData.data.item.Comments) {
          allActivities = itemData.data.item.Comments;
        } else if (AuctionBids.data) {
          allActivities = AuctionBids.data;
        }

        if (allActivities.length > 0) {
          allActivities.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
        }

        if (Object.keys(itemData.data).length) {
          setItem(itemData.data.item);
          setInterestsCount(itemData.data.item.interestsCount);
          const comments = allActivities.map((activity) => {
            if (activity.bidAmount === undefined) {
              return {
                username: activity.User.username,
                text: activity.content,
                timestamp: new Date(activity.createdAt).getTime(),
                User: activity.User,
                id: activity.id,
                type: "comment",
              };
            } else {
              return {
                User: activity.User,
                bidAmount: activity.bidAmount,
                timestamp: new Date(activity.createdAt).getTime() || 0,
                type: "bid",
              };
            }
          });
          setComments(comments);
          setIsInterest(itemData.data.item.isInterested || false);
          var channel = pusher.subscribe(
            `auction_${itemData.data.item.Auction.id}`
          );
          setShowNumber(itemData.data.item.Auction.showNumber);
          if (itemData.data.item.Auction.Bids.length > 0) {
            let bidObject = {
              createdAt: itemData.data.item.Auction.Bids[0]?.createdAt,
              id: itemData.data.item.Auction.Bids[0].id,
              itemId: itemData.data.item.Auction.Bids[0].itemId,
              User: itemData.data.item.Auction.Bids[0].User,
              bidAmount: itemData.data.item.Auction.Bids[0].bidAmount,
              userId: itemData.data.item.Auction.Bids[0].userId,
            };
            setLastBid(bidObject);
          } else {
            setLastBid({
              createdAt: null,
              id: null,
              itemId: null,
              User: { username: "Initial price" },
              bidAmount: itemData.data.item.Auction.min_bid,
              userId: null,
            });
          }

          channel.bind("add_bid", function (data) {
            // alert(JSON.stringify(data));
            if (user && data.User.id === user.id) {
              return;
            }

            const bid = {
              User: data.User,
              bidAmount: data.bidAmount,
              text: `made a bid, ${data.bidAmount} JD`,
              timestamp: new Date().getTime(),
              type: "bid",
            };
            console.log(bid);
            setLastBid(bid);
            setComments((prevComments) => [bid, ...prevComments]);
            if (bidModal && data.bidAmount <= lastBid.bidAmount) {
              enqueueSnackbar("A new bid has been made, try again!", {
                variant: "error",
              });
              setBidModal(false);
            }
          });
          channel.bind("add_comment", function (data) {
            // alert(JSON.stringify(data));
            if (user && data.User.id === user.id) {
              return;
            }
            const comment = {
              username: data.User.username,
              text: data.content,
              timestamp: new Date().getTime(),
              type: "comment",
              User: data.User,
            };

            setComments((prevComments) => [comment, ...prevComments]);
          });
          setMinimumBid(itemData.data.item.Auction.min_bid);
        }
        if (!itemData.data.item) navigate("/not-found", { replace: true }); // response is {"item": null}
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

  const handleChangeInterest = async () => {
    if (!user) {
      setLoginModal(true);
      return;
    }
    try {
      setIsInterest(!isInterest);

      isInterest
        ? setInterestsCount(interestsCount - 1)
        : setInterestsCount(interestsCount + 1);
      api
        .updateInterest(item.id)
        .then((res) => {})
        .catch((error) => {
          setIsInterest(!isInterest);
        });
    } catch (error) {
      encodeSnackbar("Error updating interest", { variant: "error" });
      setIsInterest(!isInterest);
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
          window.location.href = user.isAdmin
            ? "/user/"
            : "/user/" + item.User.id;
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
      window.location.href =
        visibility === true ? `/item/${response.data.id}` : `/profile`;
    } catch (error) {
      // Handle errors
      enqueueSnackbar(error.response.data, {
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
    const comment = {
      username: user.username,
      text: inputValue,
      timestamp: new Date().getTime(),
      User: user,
      type: "comment",
    };
    setComments((prevMessages) => [comment, ...prevMessages]);
    let res = await api.addComment({
      itemId: item.id,
      content: inputValue,
      auctionId: item.Auction.id,
    });
    comment.id = res.data.id;
    setComments((prevMessages) => [
      comment,
      ...prevMessages.slice(1, prevMessages.length - 1),
    ]);
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
    if (parseFloat(bidAmount) <= lastBid.bidAmount) {
      enqueueSnackbar({
        message: "Bid amount must be greater than the highest bid",
        variant: "error",
      });
      return;
    }
    let res = null;
    let prevLast = lastBid;
    let bidObject = {
      username: user.username,
      bidAmount: bidAmount,
      timestamp: new Date().getTime(),
      createdAt: new Date().getTime(),
      itemId: item.id,
      User: user,
      type: "bid",
    };
    try {
      setLastBid(bidObject);
      setComments((prevMessages) => [bidObject, ...prevMessages]);
      res = await api.addBid({
        bidAmount: bidAmount,
        auctionId: item.Auction.id,
      });
      bidObject.id = res.data.id;
      setLastBid(bidObject);
    } catch (error) {
      enqueueSnackbar({
        message: error.response?.data || "Error adding bid",
        variant: "error",
      });
      setLastBid(prevLast);
      return;
    }
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

  const formatDateStartTime = (dateTime, finishTime) => {
    const options = {
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    };
    const currentDate = new Date();
    const formattedDate = new Date(dateTime).toLocaleDateString(
      undefined,
      options
    );

    if (
      new Date(dateTime) < currentDate &&
      new Date(finishTime) > currentDate
    ) {
      return (
        <div className="d-flex flex-row align-items-center gap-1">
          <span>{formattedDate}</span>
          <span>
            {/* <i className="fas fa-circle fa-xs text-success fa-beat"></i> */}
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
    const currentDate = new Date();
    const formattedDate = new Date(dateTime).toLocaleDateString(
      undefined,
      options
    );

    if (new Date(dateTime) < currentDate) {
      return (
        <div className="d-flex flex-row align-items-center gap-1">
          <s>{formattedDate}</s>
        </div>
      );
    }

    return <small className="text-muted">{formattedDate}</small>;
  };

  const handleToggleShowNumber = async () => {
    setShowNumber(!showNumber);
    let res;
    try {
      res = await api.toggleShowNumber(item.id);
    } catch (error) {
      enqueueSnackbar("Error toggling show number", { variant: "error" });
      setShowNumber(!res.data.showNumber);
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
                    <span className="col-auto d-lg-block d-md-block d-none">
                      Admin controls
                    </span>
                  ) : null}
                  {user.id === item.userId && !user.isAdmin === true ? (
                    <span className="col-auto">controls</span>
                  ) : null}

                  <button
                    type="button"
                    className="col-auto btn btn-sm btn-warning px-3"
                    onClick={handleEditModalShow}
                  >
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
            <div
              className="d-flex flex-column flex-lg-row gap-1 column-gap-3 w-100"
              id="view-item-container"
            >
              <div className="image-details col-12 col-lg-6 p-3 mb-5 bg-body rounded">
                <div className="d-flex flex-column justify-content-center align-items-center gap-3 w-100">
                  <div
                    className="w-100 d-flex align-items center justify-content-center"
                    style={{ height: "400px" }}
                  >
                    <ImageSlider images={item.Images} />
                  </div>
                  <div className="details w-100 d-flex flex-column justify-content-start align-items-start gap-3">
                    <div className="d-flex justify-content-between align-items-center w-100">
                      <h3>{item.name}</h3>
                      <h2>
                        <div
                          className="badge border-2 border-danger shadow p-2 d-flex flex-row gap-3 align-items-center"
                          onClick={handleChangeInterest}
                          style={{ cursor: "pointer" }}
                        >
                          <small className="text-muted">{interestsCount}</small>
                          <span className="text-danger">
                            {isInterest ? (
                              <i className="fa-solid fa-heart liked"></i>
                            ) : (
                              <i className="fa-regular fa-heart"></i>
                            )}
                          </span>
                        </div>
                      </h2>
                    </div>
                    <div
                      id="auctioneer-name"
                      className="row w-100 d-flex flex-row justify-content-start align-items-center"
                    >
                      <div className="row d-flex flex-row justify-content-start align-items-center gap-3">
                        <div className="col-auto">
                          <strong
                            style={{ cursor: "pointer" }}
                            onClick={() =>
                              (window.location.href = `/profile/${item.User.id}`)
                            }
                          >
                            By {item.User.username}
                          </strong>
                        </div>
                      </div>
                      <div className="col-auto d-flex flex-row gap-3 align-items-center">
                        <span id="phone">
                          {showNumber
                            ? item.User.phoneNumber
                            : item.User.phoneNumber.slice(0, 3) + "*******"}
                        </span>
                        {user && item.userId === user.id ? (
                          <div>
                            <span
                              onClick={handleToggleShowNumber}
                              hidden={showNumber}
                              style={{ cursor: "pointer" }}
                            >
                              <i className="fas fa-eye-slash"></i>
                            </span>

                            <span
                              onClick={handleToggleShowNumber}
                              style={{ cursor: "pointer" }}
                              hidden={!showNumber}
                            >
                              <i className="fas fa-eye"></i>
                            </span>
                          </div>
                        ) : showNumber ? (
                          <span
                            onClick={handleCopyNumber}
                            style={{ cursor: "pointer" }}
                          >
                            <i className="fas fa-copy"></i>
                          </span>
                        ) : null}
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
                          onClick={() =>
                            (window.location.href = `/category-item/${item.Category.id}`)
                          }
                        >
                          {item.Category.name}
                        </p>
                        {item.Tags.map((tag, idx) => (
                          <p
                            className="tag"
                            key={idx}
                            style={{ fontWeight: "normal" }}
                          >
                            {tag.name}
                          </p>
                        ))}
                      </span>
                    </div>
                    <div className="row d-flex flex-column w-100 p-3">
                      <h5>Details</h5>
                      <div className="border-start border-3 border-secondary p-3 bg-body">
                        <p
                          id="desc"
                          dangerouslySetInnerHTML={{ __html: item.description }}
                        ></p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="d-flex flex-column w-100 gap-3">
                <div className="d-flex flex-column justify-content-center gap-2 bg-body p-3 col-auto">
                  <div className="row rounded d-flex flex-column align-items-center justify-content-center">
                    {lastBid ? (
                      <div className="d-flex flex-column mb-2 align-items-center justify-content-center">
                        <h2 className="fw-bolder text-truncate">
                          {lastBid.User.username}👑
                        </h2>
                        <h4 className="text-secondary py-2 px-3 my-1 mx-0">
                          {lastBid.bidAmount} JD
                        </h4>
                      </div>
                    ) : (
                      <div className="d-flex flex-column mb-2 align-items-center justify-content-center">
                        <h2 className="fw-bolder text-truncate">
                          Initial price
                        </h2>
                        <h4 className="text-secondary py-2 px-3 my-1 mx-0">
                          {lastBid.bidAmount} JD
                        </h4>
                      </div>
                    )}
                  </div>
                  <div className="d-flex flex-row justify-content-between align-items-center gap-3 rounded p-3 gap-2 w-100">
                    <div>
                      {item.Auction.startTime && (
                        <div className="d-flex flex-row align-items-center gap-2">
                          <div className="d-flex flex-column gap-2">
                            {formatDateStartTime(
                              item.Auction.startTime,
                              item.Auction.finishTime
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="text-secondary">-</div>
                    <div>
                      {item.Auction.finishTime && (
                        <div className="d-flex flex-column gap-2">
                          {formatDateFinishTime(item.Auction.finishTime)}
                        </div>
                      )}
                    </div>
                  </div>
                  {user && user.id !== item.userId && status == "live" && (
                    <div className="d-flex flex-column gap-3 rounded p-3 gap-2 w-100">
                      <h4 className="">Make a bid</h4>
                      <input
                        className="form-control border-2 rounded-3"
                        onChange={(e) => {
                          setBidAmount(e.target.value);
                        }}
                        ref={bidInputRef}
                        type="number"
                        min={parseInt(lastBid.bidAmount) + parseInt(minimumBid)}
                        placeholder="Enter bid amount"
                      ></input>
                      <div className="d-flex flex-wrap gap-2 justify-content-between">
                        <small style={{ opacity: "80%" }}>
                          Minimum increment: {item.Auction.min_bid}
                        </small>
                        <div className="d-flex justify-content-end gap-2">
                          <button
                            onClick={() => {
                              bidInputRef.current.value =
                                lastBid.bidAmount + minimumBid;
                              setBidAmount(bidInputRef.current.value);
                            }}
                            className="btn btn-secondary bg-white text-secondary px-2"
                            style={{ fontWeight: "600" }}
                          >
                            <span>+ {minimumBid} JD</span>
                          </button>
                          <button
                            onClick={() => {
                              bidInputRef.current.value =
                                lastBid.bidAmount + minimumBid + 5;
                              setBidAmount(bidInputRef.current.value);
                            }}
                            className="btn btn-secondary bg-white text-secondary px-2"
                            style={{ fontWeight: "600" }}
                          >
                            <span>+ {minimumBid + 5} JD</span>
                          </button>
                          <button
                            onClick={() => {
                              bidInputRef.current.value =
                                lastBid.bidAmount + minimumBid + 10;
                              setBidAmount(bidInputRef.current.value);
                            }}
                            className="btn btn-secondary bg-white text-secondary px-2"
                            style={{ fontWeight: "600" }}
                          >
                            <span>+ {minimumBid + 10} JD</span>
                          </button>
                        </div>
                      </div>
                      <button
                        className="btn btn-secondary text-white p-1 px-3 mt-3"
                        onClick={handleBidModalShow}
                        disabled={
                          item.Auction.finishTime < new Date() ||
                          item.Auction.startTime > new Date()
                        }
                      >
                        Confirm
                      </button>
                    </div>
                  )}
                </div>

                <div className="d-flex flex-column col-lg-6 col-sm-12 p-4 mb-5 bg-body rounded w-100">
                  <h4 className="mb-3">Comments</h4>
                  <div ref={activityTabRef} className="activity-tab">
                    {comments.length != 0 ? (
                      comments.map((comment, index) => (
                        <div key={index} className="">
                          {comment.type === "comment" ? (
                            <div className="activity">
                              <div className="d-flex gap-5">
                                <span
                                  style={{
                                    color: "var(--primary-green)",
                                    cursor: "pointer",
                                    fontSize: "19px",
                                    margin: "0",
                                  }}
                                  className="text-truncate"
                                  onClick={() =>
                                    (window.location.href = `/profile/${comment.User.id}`)
                                  }
                                >
                                  {user &&
                                  comment.User.username === user.username
                                    ? "You"
                                    : comment.User.username}
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
                                  {getTimeAgo(comment.timestamp)}
                                </p>
                              </div>

                              <div
                                className="p-2"
                                style={{
                                  fontSize: "14px",
                                }}
                              >
                                {comment.text}
                              </div>
                            </div>
                          ) : (
                            <div className="activity bid">
                              <div className="d-flex flex-row text-center text-primary align-items-center justify-content-center">
                                <span className="pe-2">
                                  <img
                                    src="https://res.cloudinary.com/djwhrh0w7/image/upload/v1715590016/c_fill,w_16,h_16/logo_english_black_mobile_j6ywrs.png"
                                    alt="logo"
                                    height="16px"
                                  />
                                </span>
                                <a
                                  href={`/profile/${comment.User.id}`}
                                  className="link text-secondary text-truncate"
                                >
                                  {user &&
                                  comment.User.username === user.username
                                    ? "You"
                                    : comment.User.username}
                                </a>
                                <span>
                                  &nbsp; made a bid,{" "}
                                  <strong>{comment.bidAmount}</strong> JD
                                </span>
                              </div>
                              <span
                                style={{
                                  color: "rgba(0,0,0,.4)",
                                  fontSize: "12px",
                                }}
                              ></span>
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <h6 className=" align-self-center m-auto text-black-50 ">
                        It looks like you're the first here, feel free to say hi
                        in the comments or make a bid
                      </h6>
                    )}
                  </div>

                  <div className="chat-box">
                    <textarea
                      type="text"
                      ref={inputRef}
                      placeholder="Send a comment"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && e.target.value) {
                          handleMessage();
                          e.target.value = "";
                        }
                      }}
                      className="form-control border-2 rounded-3 "
                      style={{ outline: "none", display: "inline" }}
                    ></textarea>
                    <button
                      className="btn btn-secondary"
                      style={{ padding: "3px" }}
                      onClick={handleMessage}
                    >
                      <i
                        className="fa-solid fa-arrow-up text-white px-3"
                        style={{
                          alignSelf: "center",
                          fontSize: "22px",
                        }}
                      ></i>
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
                <span>
                  you can show it again later, other users will not be able to
                  see this item!
                </span>
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
                          ? `${String(
                              calendarState.selection.startDate.getHours()
                            ).padStart(2, "0")}:${String(
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
                          ? `${String(
                              calendarState.selection.endDate.getHours()
                            ).padStart(2, "0")}:${String(
                              calendarState.selection.endDate.getMinutes()
                            ).padStart(2, "0")}`
                          : ""
                      }
                      onChange={(e) => handleTimeChange(e, "endDate")}
                      required
                    />
                  </div>
                </div>
                <small className="text-muted row ms-1">
                  At least 1 hour, not more that 7 days
                </small>
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
          <Modal show={bidModal} onHide={handleBidModalClose}>
            <Modal.Header closeButton>
              <Modal.Title>Confirm Bid</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="d-flex flex-column gap-1">
                <span>
                  You are about to bid <strong>{bidAmount} JD</strong>
                </span>
                <span>
                  &nbsp;+ <strong>{bidAmount - lastBid.bidAmount} JD</strong> to
                  the highest bid
                </span>
                <span>Are you sure you want to proceed?</span>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <button
                className="btn btn-secondary text-white"
                onClick={handleBid}
              >
                Make bid
              </button>
            </Modal.Footer>
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
              <button
                className="btn btn-primary"
                onClick={handleEditModalClose}
              >
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
