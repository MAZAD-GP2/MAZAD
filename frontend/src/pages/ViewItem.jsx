import React, { useEffect, useState } from "react";
import ImageSlider from "./ImageSlider";
import * as api from "../api/index";
import "../assets/css/viewItem.css";
import { useParams } from "react-router-dom";

const ViewItem = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await api.getItemById(id);
        setItem(response.data);
        // Fetch user data associated with the item's userId
        const userResponse = await api.getUserById(response.data.userId);
        setUser(userResponse.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchItem();
  }, [id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <>
      {item && (
        <div className="d-flex flex-column gap-5">
          <div className="image-details">
            <ImageSlider images={item.Images} />
            <div
              className="details d-flex flex-column"
              style={{ width: "90%", margin: "0 auto" }}
            >
              <h5 style={{ fontSize: "80px", textAlign: "center" }}>
                {item.name}
              </h5>
              {user && (
                <h5 style={{ textAlign: "center" }}>By {user.username}</h5>
              )}
              <br />
              <br />
              <br />
              <br />
              <div className="d-flex flex-row justify-content-around ">
                <div
                  style={{
                    background: "#999494",
                    padding: "5px 30px",
                    borderRadius: "5px",
                    boxShadow: "0 3px 6px rgba(0, 0, 0, 0.2)" 
                  }}
                >
                  <h5>Auction duration</h5>
                  <p style={{ color: "#00E175" }}>Start time - End time</p>
                </div>
                <div
                  style={{
                    background: "#999494",
                    padding: "5px 30px",
                    borderRadius: "5px",
                    boxShadow: "0 3px 6px rgba(0, 0, 0, 0.2)" 
                  }}
                >
                  <h5>Highest Bid</h5>
                  <h6 style={{ color: "#00E175"}}>50$</h6>
                </div>
              </div>
              <br />
              <br />
              <br />
              <br />
              <button className="submit-button btn btn-secondary align-self-center">
                Place a Bid
              </button>
            </div>
          </div>
          <div className="categories-tags d-flex flex-row">
            <div className="d-flex flex-column w-50">
              <h3>Description</h3>
              <p id="desc">{item.description}</p>
            </div>
            <div className="d-flex flex-column ">
              <h3>Categories & tags</h3>
              <br />
              <span className="d-flex gap-2">
                <p className="tag" style={{ borderColor: "#00E175" }}>
                  {item.Category.name}
                </p>
                {item.Tags.map((tag, idx) => (
                  <p className="tag" key={idx}>
                    {tag.name}
                  </p>
                ))}
              </span>
            </div>
          </div>
          <div className="comments d-flex flex-row">
            <h3>Comments</h3>
          </div>
        </div>
      )}
    </>
  );
};

export default ViewItem;
