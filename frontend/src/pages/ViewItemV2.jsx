import React, { useEffect, useState } from "react";
import ImageSlider from "./ImageSlider";
import * as api from "../api/index";
import "../assets/css/viewItem2.css";
import { useParams } from "react-router-dom";
import Navbar from "./Navbar";

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
      <Navbar />

      {item && (
        <div className="d-flex flex-row gap-3 p-5" id="main-container">
          <div className="image-details col-lg-6 col-sm-12 shadow p-3 mb-5 bg-body rounded">
            <div className="d-flex flex-column justify-content-center align-items-center gap-3 w-100">
              <div className="w-100">
                <ImageSlider images={item.Images} />
              </div>
              <div className="details w-100 d-flex flex-column justify-content-start align-items-start gap-3">
                <div className="row">
                  <h3>{item.name}</h3>
                </div>
                <div
                  id="auctioneer-name"
                  className="row w-100 d-flex flex-row justify-content-between align-items-center"
                >
                  <div className="row">
                    {user && <p>By {user.username}</p>}
                  </div>
                  <div className="d-flex flex-column col-auto">
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
                <div className="row d-flex flex-column w-100 p-3">
                    <h5>Details</h5>
                  <div className="border-start border-3 border-secondary p-3 bg-body">
                    <p
                      id="desc"
                      dangerouslySetInnerHTML={{ __html: item.description }}
                    ></p>
                  </div>
                </div>
                {/* 
                <div className="d-flex flex-row justify-content-around ">
                  <div>
                    <h5>Auction duration</h5>
                  </div>
                  <div
                    style={{
                      background: "#999494",
                      padding: "5px 30px",
                      borderRadius: "5px",
                      boxShadow: "0 3px 6px rgba(0, 0, 0, 0.2)",
                    }}
                  >
                    <h5>Highest Bid</h5>
                    <h6 style={{ color: "#00E175" }}>50$</h6>
                  </div>
                </div>

                <button className="submit-button btn btn-secondary align-self-center">
                  Place a Bid
                </button> */}
              </div>
            </div>
          </div>
          <div className="d-flex flex-row col-lg-6 col-sm-12  shadow p-3 mb-5 bg-body rounded">
            <div className="comments d-flex flex-row">
              <h3>Activity</h3>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ViewItem;
