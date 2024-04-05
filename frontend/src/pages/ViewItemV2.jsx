import React, { useEffect, useState } from "react";
import ImageSlider from "../components/ImageSlider";
import * as api from "../api/index";
import "../assets/css/viewItem2.css";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useSnackbar } from "notistack";

const ViewItem = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { enqueueSnackbar } = useSnackbar();
  const user = JSON.parse(sessionStorage.getItem("user"));

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await api.getItemById(id);
        setItem(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
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
                  <div className="row">{item.User && <p>By {item.User.username}</p>}</div>
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
                    <p id="desc" dangerouslySetInnerHTML={{ __html: item.description }}></p>
                  </div>
                </div>
              </div>
            </div>
            {user.isAdmin && (
              <button
                type="button"
                className="btn btn-danger"
                style={{ width: "12%", height: "35px" }}
                onClick={DeleteItem}
              >
                Delete
              </button>
            )}
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
