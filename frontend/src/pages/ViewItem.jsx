import React, { useEffect, useState } from "react";
import ImageSlider from "../components/ImageSlider";
import * as api from "../api/index";
import "../assets/css/viewItem.css";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import MobileNavbar from "../components/MobileNavbar";

import PageTitle from "../components/PageTitle";
import NotFound from "../components/NotFound";

const ViewItem = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [interest, setInterest] = useState(false);
  const user = JSON.parse(sessionStorage.getItem("user"));
  
  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await api.getItemById(id);
        if(Object.keys(response.data).length){
          setItem(response.data.item);
          setInterest(response.data.interests ? true : false); 
        } 
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

  async function changeInterest() {
    if(interest) {
      await api.removeInterest(item.id);
    } else {
      await api.addInterest(item.id);
    }
    setInterest(!interest);
  }

  return (
    <>
      {/* if user is on desktop, show Navbar else show MobileNavbar */}

      <Navbar />
      <PageTitle title="Auction" />
      {item ? (
        <div className="d-flex flex-column flex-lg-row gap-1 column-gap-3 w-100" id="view-item-container">
          <div className="image-details col-12 col-lg-6 shadow p-3 mb-5 bg-body rounded">
            <div className="d-flex flex-column justify-content-center align-items-center gap-3 w-100">
              <div className="w-100">
                <ImageSlider images={item.Images} />
              </div>
              <div className="details w-100 d-flex flex-column justify-content-start align-items-start gap-3">
                <div className="d-flex gap-2 ">
                  <h3>{item.name}</h3>
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
                          <path
                            fillRule="evenodd"
                            d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314"
                          />
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
                <div
                  id="auctioneer-name"
                  className="row w-100 d-flex flex-row justify-content-between align-items-center"
                >
                  <div className="row"><p>By {item.User.username}</p></div>
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
                    <p id="desc" dangerouslySetInnerHTML={{ __html: item.description }}></p>
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
      ) : <NotFound/>}

      <MobileNavbar />
    </>
  );
};

export default ViewItem;
