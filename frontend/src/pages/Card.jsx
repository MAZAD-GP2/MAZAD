import React from "react";
import "../assets/css/card.css";
import sanitizeHtml from "sanitize-html";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Card = ({ item, interest }) => {
  const user = JSON.parse(sessionStorage.getItem("user"));

  function handleHref(id) {
    window.location.href = `/item/${id}`;
  }

  async function changeInterest() {
    if (interest) {
      await api.removeInterest(item.id);
    } else {
      await api.addInterest(item.id);
    }
    setInterest(!interest);
  }

  return (
    <div className="card item-card" onClick={() => handleHref(item.id)}>
      <img className="image" src={item.Images[0].imgURL} alt="Card image cap" />
      <div className="card-body">
        <div className="tag-container">
          <p className="category tag">{item.Category.name}</p>
          {item.Tags.map((tag) => (
            <p key={tag.id} className="tag">
              {tag.name}
            </p>
          ))}
        </div>
        <div className="d-flex gap-4 ">
          <h5 className="card-title">{item.name}</h5>
          {user && (
            <span className="text-danger" onClick={changeInterest}>
              {interest ? (
                <FontAwesomeIcon
                  icon="fa-solid fa-heart"
                  style={{ marginTop: "50%" }}
                />
              ) : (
                <FontAwesomeIcon
                  icon="fa-regular fa-heart"
                  style={{ marginTop: "50%" }}
                />
              )}
            </span>
          )}
        </div>
        {/* <p className="card-text text-truncate">{item.description}</p> */}
        <p className="card-text">
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
        </p>
      </div>
    </div>
  );
};

export default Card;
