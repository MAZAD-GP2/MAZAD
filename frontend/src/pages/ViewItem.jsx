import React, { useEffect, useState } from "react";
import ImageSlider from "../components/ImageSlider";
import * as api from "../api/index";
import "../assets/css/viewItem.css";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import MobileNavbar from "../components/MobileNavbar";

import PageTitle from "../components/PageTitle";
import NotFound from "../components/NotFound";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ViewItem = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [interest, setInterest] = useState(false);
  const user = JSON.parse(sessionStorage.getItem("user"));
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await api.getItemById(id);
        if (Object.keys(response.data).length) {
          setItem(response.data.item);
          setInterest(response.data.interests ? true : false);
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

  async function changeInterest() {
    if (interest) {
      await api.removeInterest(item.id);
    } else {
      await api.addInterest(item.id);
    }
    setInterest(!interest);
  }

  async function DeleteItem() {
    await api
      .deleteItem(id)
      .then((result) => {
        enqueueSnackbar("Item deleted successfully", { variant: "success" });
        setTimeout(() => {
          window.location.href = "/";
        }, 1000);
      })
      .catch((error) => {
        enqueueSnackbar(error, { variant: "error" });
      });
  }
  return (
    <>
      {item && (
        <>
          <Navbar />
          <PageTitle title="Auction" />
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
                  <div className="d-flex gap-4 ">
                    <h3>{item.name}</h3>
                    {user && (
                      <span
                        className="text-danger"
                        onClick={changeInterest}
                        style={{ cursor: "pointer" }}
                      >
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
                  <div
                    id="auctioneer-name"
                    className="row w-100 d-flex flex-row justify-content-between align-items-center"
                  >
                    <div className="row">
                      <p>By {item.User.username}</p>
                    </div>
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
                  {user && user.isAdmin && (
                    <button
                      type="button"
                      className="btn btn-danger px-3"
                      onClick={DeleteItem}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
            <div className="d-flex flex-column col-lg-6 col-sm-12 shadow p-3 mb-5 bg-body rounded">
              <div className="comments d-flex flex-row">
                <h3>Activity</h3>
              </div>
            </div>
          </div>
          <MobileNavbar />
        </>
      )}
    </>
  );
};

export default ViewItem;
