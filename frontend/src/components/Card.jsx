import React, { useState } from "react";
import "../assets/css/card.css";
import sanitizeHtml from "sanitize-html";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as api from "../api/index";

const Card = ({ item }) => {
  const user = JSON.parse(sessionStorage.getItem("user"));
  const [isInterest, setIsInterest] = useState(item.isInterested || false);
  const [interestsCount, setInterestsCount] = useState(item.interestsCount);
  function handleCardClick() {
    window.location.href = `/item/${item.id}`;
  }

  const changeInterest = async (itemId) => {
    if (!user) {
      window.location.href = "/login";
      return;
    }
    try {
      const res = await api.updateInterest(itemId);
      setIsInterest(res.data.isInteresting);
      isInterest ? setInterestsCount(interestsCount-1) : setInterestsCount(interestsCount+1)
    } catch (error) {
      console.error("Error updating interest:", error);
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
          <span className="pulsing-circle">Live</span>
          <span>
            <i className="fas fa-circle fa-xs text-success fa-beat"></i>
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

  const categoryHref=(id)=>{
    window.location.href = `/category-item/${id}`;
  }

  return (
    <div className="card item-card">
      <img className="image" src={item.Images[0].imgURL} alt="Card image cap" onClick={handleCardClick} />
      <div className="card-body d-flex flex-column gap-3">
        <div className="d-flex flex-column gap-1">
          <div className="tag-container d-flex flex-row gap-1">
            <span className="category tag px-2" style={{cursor:"pointer"}} onClick={()=>categoryHref(item.Category.id)}>{item.Category.name}</span>
            {item.Tags.map((tag) => (
              <span key={tag.id} className="tag px-2">
                {tag.name}
              </span>
            ))}
          </div>
          <div className="d-flex justify-content-between align-items-center w-100 border border-secondary rounded-5 px-2">
            <div className="d-flex justify-content-start w-auto gap-2 mt-1">
              <small className="text-muted">
                {formatDateTime(item.Auction.startTime)}
              </small>
              <div> - </div>
              <small className="text-muted">
                {formatDateTime(item.Auction.finishTime)}
              </small>
            </div>
            <small className="text-muted">
              <span>Currently at: </span>
              <strong>${item.Auction.highestBid}</strong>
            </small>
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
              onClick={() => changeInterest(item.id)}
              title={!user ? "Login to like" : ""}
            >
              <FontAwesomeIcon
                className="text-danger"
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
    </div>
  );
};

export default Card;
