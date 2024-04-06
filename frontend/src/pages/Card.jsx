import React from "react";
import "../assets/css/card.css";
import sanitizeHtml from "sanitize-html";

const Card = ({ item, interest }) => {
  const user = JSON.parse(sessionStorage.getItem("user"));

  function handleHref(id) {
    window.location.href = `/item/${id}`;
  }

  async function changeInterest() {
    if(interest) {
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
        <div className="d-flex gap-2 ">
          <h5 className="card-title">{item.name}</h5>
          {user && (
            <span className="text-danger" onClick={changeInterest}>
              {interest ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-heart-fill"
                  viewBox="0 0 16 16"
                >
                  <path fillRule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-heart"
                  viewBox="0 0 16 16"
                >
                  <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15" />
                </svg>
              )}
            </span>
          )}
        </div>
        {/* <p className="card-text text-truncate">{item.description}</p> */}
        <p className="card-text">
          {item.description.length > 150
            ? sanitizeHtml(
                item.description.replace("><", "> <").substring(0, 147).split(" ").slice(0, -1).join(" ") + "...",
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
