import React, { useState } from "react";
import "../assets/css/card.css";
import sanitizeHtml from "sanitize-html";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as api from "../api/index";
import { Modal } from "react-bootstrap";
import LoginForm from "./LoginForm";
import ImageSlider from "./ImageSlider";
import SimpleImageSlider from "react-simple-image-slider";

const Card = ({ item, removeItemFromFavorites }) => {
  const user = JSON.parse(sessionStorage.getItem("user"));
  const [isInterest, setIsInterest] = useState(item.isInterested || false);
  const [interestsCount, setInterestsCount] = useState(item.interestsCount);
  const [loginModal, setLoginModal] = useState(false);
  const handleLoginModalClose = () => setLoginModal(false);

  function handleCardClick() {
    window.location.href = `/item/${item.id}`;
  }

  const handleChangeInterest = async (itemId) => {
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
        .updateInterest(itemId)
        .then((res) => {})
        .catch((error) => {
          setIsInterest(!isInterest);
        });

      setIsInterest(res.data.isInteresting);
    } catch (error) {
      console.error("Error updating interest:", error);
    } finally {
      if (removeItemFromFavorites) removeItemFromFavorites(itemId);
    }
  };

  const formatDateTime = (dateTime) => {
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
          <span>Live</span>
          <span>
            {/* <i className="fas fa-circle fa-xs text-success fa-beat"></i> */}
            <FontAwesomeIcon
              className="text-secondary"
              icon="fa-solid fa-circle"
              beat
              size="xs"
            />
          </span>
        </div>
      );
    }

    return <small className="text-muted">{formattedDate}</small>;
  };

  const markInterested = () => {
    if (!user) return false;

    return isInterest;
  };

  const categoryHref = (id) => {
    window.location.href = `/category-item/${id}`;
  };

  return (
    <div className="card item-card">
      <img
        className="image"
        src={item.Images[0].imgURL}
        alt="Card image cap"
        onClick={handleCardClick}
      />
      {/* <ImageSlider images={item.Images} /> */}

      {/* <div style={{ maxHeight: "300px", cursor: "pointer" }} onClick={handleCardClick}>
        <SimpleImageSlider
          width="100%"
          height={300}
          navSize={25}
          images={item.Images.map((each, index) => ({
            url: each.imgURL,
          }))}
          showNavs={ item.Images.length > 1 ? true : false }
          showBullets={ item.Images.length > 1 ? true : false }
          style={{ objectFit: "stretch" }}
        />
      </div> */}
      <div className="card-body d-flex flex-column gap-3">
        <div className="d-flex flex-column gap-1">
          <div className="tag-container d-flex flex-row gap-1 mb-1">
            <span
              className="category tag px-2"
              style={{ cursor: "pointer" }}
              onClick={() => categoryHref(item.Category.id)}
            >
              {item.Category.name}
            </span>
            {item.Tags.map((tag) => (
              <span key={tag.id} className="tag px-2">
                {tag.name}
              </span>
            ))}
          </div>
          <div className="d-flex justify-content-between align-items-center w-100 border border-secondary rounded-5 px-5">
            <small className="text-muted">
              {formatDateTime(item.Auction.startTime)}
            </small>
            <div> - </div>
            <small className="text-muted">
              {formatDateTime(item.Auction.finishTime)}
            </small>
            {/* <small className="text-muted"> */}
            {/* <span>Currently at: </span> */}
            {/* <strong>${item.Auction.highestBid}</strong> */}
            {/* </small> */}
          </div>
        </div>
        <div>
          <div className="d-flex flex-row justify-content-between gap-1">
            <div className="col-auto">
              <h5 className="card-title" onClick={handleCardClick}>
                {item.name}
              </h5>
            </div>
            <div
              className="interest col-auto d-flex flex-column justify-content-center align-items-center"
              onClick={() => handleChangeInterest(item.id)}
              title={!user ? "Login to like" : "I am interested in this"}
            >
              <FontAwesomeIcon
                className={isInterest ? "text-danger liked" : "text-danger"}
                icon={isInterest ? "fa-solid fa-heart" : "fa-regular fa-heart"}
              />
              <small className="text-muted">{interestsCount}</small>
            </div>
          </div>
          <span className="card-text description" onClick={handleCardClick}>
            {item.description.length > 150
              ? sanitizeHtml(
                  item.description
                    .replace("><", "> <")
                    .substring(0, 147)
                    .split(" ")
                    .slice(0, -1)
                    .join(" ") + "...",
                  {
                    allowedTags: [],
                    allowedAttributes: {},
                    allowedIframeHostnames: [],
                  }
                )
              : sanitizeHtml(item.description.replace("><", "> <"), {
                  allowedTags: [],
                  allowedAttributes: {},
                  allowedIframeHostnames: [],
                })}
          </span>
        </div>
      </div>
      <Modal show={loginModal} onHide={handleLoginModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Login</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>To perform this action you must be logged in</p>
          <LoginForm {...{ next: window.location.href }} />
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-primary" onClick={handleLoginModalClose}>
            cancel
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Card;
