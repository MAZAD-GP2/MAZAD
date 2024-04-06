import React, { useEffect, useState } from "react";
import ImageSlider from "../components/ImageSlider";
import * as api from "../api/index";
import "../assets/css/viewItem.css";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import MobileNavbar from "../components/MobileNavbar";

import PageTitle from "../components/PageTitle";

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
      {/* if user is on desktop, show Navbar else show MobileNavbar */}

      <Navbar />
      <PageTitle title="Auction" />
      {item && (
        <div
          className="d-flex flex-column flex-lg-row gap-1 column-gap-3 w-100"
          id="view-item-container"
        >
          <div className="image-details col-12 col-lg-6 shadow p-3 mb-5 bg-body rounded">
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
                  <div className="row">{user && <p>By {user.username}</p>}</div>
                  <div className="d-flex flex-column col-auto">
                    <span className="d-flex flex-wrap gap-2">
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
              </div>
            </div>
          </div>
          <div className="d-flex flex-column col-lg-6 col-sm-12 shadow p-3 mb-5 bg-body rounded">
            <div className="comments d-flex flex-row">
              <h3>Activity</h3>
            </div>
          </div>
        </div>
      )}

      <MobileNavbar />
    </>
  );
};

export default ViewItem;
