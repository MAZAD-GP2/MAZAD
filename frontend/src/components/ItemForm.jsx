import "../assets/css/addItem.css";
import { React, useEffect, useState, useCallback, useRef } from "react";
import * as api from "../api/index";
import { useSnackbar } from "notistack";
import Quill from "quill";
import Delta from "quill-delta";
import Dropzone from "react-dropzone";

import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

import { OverlayTrigger, Popover } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Editor from "./Editor";
import "quill/dist/quill.snow.css";

import Tag from "../components/Tag";
const ItemForm = ({
  description,
  setDescription,
  categories,
  isFetching,
  price,
  setPrice,
  minBid,
  setMinBid,
  tags,
  setTags,
  name,
  setName,
  visibility,
  setVisibility,
  selectedCategory,
  setSelectedCategory,
  submitValid,
  setSubmitValid,
  droppedFiles,
  setDroppedFiles,
  showNumber,
  setShowNumber,
  calendarState,
  setCalendarState,
  currentDescriptionLength,
  SetCurrentDescriptionLength,
  quillRef,
  isAddingItem,
  setIsAddingItem,
  setCategories,
  setIsFetching,
  isEdit,
  minStartDate = new Date(),
}) => {
  const [liveTime, setLiveTime] = useState(new Date().toLocaleTimeString());
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.getAllCategories();
        setCategories(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsFetching(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const jordanTime = new Date().toLocaleString("en-US", {
        timeZone: "Asia/Amman",
        dateStyle: "short",
        timeStyle: "long",
      });
      setLiveTime(jordanTime);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  const handleTitleChange = (event) => {
    setName(event.target.value);
  };

  const handlePriceChange = (event) => {
    if (event.target.value < 0 && event.target.value !== "") {
      setPrice(0);
      return;
    }
    setPrice(parseFloat(event.target.value));
  };

  const handleMinBidChange = (event) => {
    if (event.target.value < 1 && event.target.value !== "") {
      setMinBid(1);
      return;
    }
    setMinBid(parseFloat(event.target.value));
  };
  const handleDescriptionChange = useCallback(
    (lastChange, deltaBefore, source) => {
      let limit = 1000;
      SetCurrentDescriptionLength(quillRef.current.getLength());
      if (quillRef.current.getLength() - 1 > limit) {
        quillRef.current.deleteText(limit, quillRef.current.getLength());
      }
    },
    []
  );
  const htmlToDelta = (html) => {
    if (!html) return null;
    let newQuill = new Quill(document.createElement("div"));
    let delta = newQuill.clipboard.convert(html);
    let deltaObject = new Delta(delta.ops);

    return deltaObject;
  };
  const handleSubmit = async () => {
    let desc = JSON.stringify(quillRef.current.getContents()["ops"]);
    if (
      !name ||
      name.length < 3 ||
      !desc.length ||
      !calendarState ||
      !calendarState.selection.startDate ||
      !calendarState.selection.endDate ||
      !selectedCategory ||
      !droppedFiles.length ||
      price < 0 ||
      !minBid ||
      minBid < 1
    ) {
      setSubmitValid(false);
    } else {
      setSubmitValid(true);

      // Create a FormData object
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", desc);
      formData.append("startDate", calendarState.selection.startDate);
      formData.append("endDate", calendarState.selection.endDate);
      formData.append("categoryId", selectedCategory.id);
      formData.append("tags", tags);
      formData.append("price", price);
      formData.append("minBid", minBid);

      formData.append("showNumber", showNumber);
      formData.append("isHidden", visibility);

      droppedFiles.forEach((file) => {
        formData.append("images", file);
      });

      try {
        setIsAddingItem(true);
        // Send the FormData object using Axios
        const response = await api.addItem(formData).catch((error) => {
          throw error;
        });
        // Handle the response as needed
        enqueueSnackbar("Added item", { variant: "success" });
        setName("");
        setDescription("");
        window.location.href =
          visibility === true ? `/item/${response.data.id}` : `/profile`;
      } catch (error) {
        // Handle errors
        if (error.response?.data?.message) {
          enqueueSnackbar(error.response.data.message, {
            variant: "error",
          });
        } else {
          enqueueSnackbar("An unexpected error occurred", {
            variant: "error",
          });
        }
        // reenable the button
        setIsAddingItem(false);
      }
    }
  };

  const handleUpload = (acceptedFiles) => {
    acceptedFiles = acceptedFiles.slice(0, 10);
    const formData = new FormData();
    let wenRay7 = false;
    setDroppedFiles((images) => {
      const newImages = [...images];
      acceptedFiles.forEach((file) => {
        if (newImages.length >= 10) {
          wenRay7 = true;
          return;
        }
        if (!newImages.some((image) => image.name === file.name)) {
          newImages.push(file);
          formData.append("file", file);
        }
      });
      if (wenRay7) {
        enqueueSnackbar("ويهيهييين رايح", { variant: "error" });
      }
      return newImages;
    });
  };

  const handleRemove = (fileToRemove) => {
    setDroppedFiles(droppedFiles.filter((file) => file !== fileToRemove));
  };

  const handleRemoveClick = (file) => (event) => {
    event.stopPropagation(); // Stop event propagation to prevent upload
    handleRemove(file);
  };

  const handleDateChange = (item) => {
    const selectedStartDate = item.selection.startDate;
    const selectedEndDate = item.selection.endDate;

    const differenceInMilliseconds = selectedEndDate - selectedStartDate;

    const differenceInDays = differenceInMilliseconds / (1000 * 3600 * 24);

    if (differenceInDays > 7) {
      const adjustedEndDate = new Date(selectedStartDate);
      adjustedEndDate.setDate(selectedStartDate.getDate() + 7);

      setCalendarState({
        ...calendarState,
        selection: {
          startDate: selectedStartDate,
          endDate: adjustedEndDate,
          key: "selection",
        },
      });
    } else {
      setCalendarState({
        ...calendarState,
        selection: {
          startDate: selectedStartDate,
          endDate: selectedEndDate,
          key: "selection",
        },
      });
    }
  };

  const handleTimeChange = (e, type) => {
    const { value } = e.target;
    const { selection } = calendarState;
    const newDate = new Date(selection[type]);
    newDate.setHours(value.split(":")[0]);
    newDate.setMinutes(value.split(":")[1]);
    // if end date with the time is less than start date with the time, set the end date to be the same as the start date
    if (type === "endDate" && newDate < selection.startDate) {
      newDate.setHours(selection.startDate.getHours());
      newDate.setMinutes(selection.startDate.getMinutes());

      setCalendarState((prevState) => ({
        ...prevState,
        selection: {
          ...prevState.selection,
          endDate: newDate,
        },
      }));
    }

    if (type === "startDate") {
      setCalendarState((prevState) => ({
        ...prevState,
        selection: {
          ...prevState.selection,
          startDate: newDate,
        },
      }));
    } else if (type === "endDate") {
      setCalendarState((prevState) => ({
        ...prevState,
        selection: {
          ...prevState.selection,
          endDate: newDate,
        },
      }));
    }
  };

  const popoverPhone = (
    <Popover id="popover-phone">
      <Popover.Header as="h3">Phone Number</Popover.Header>
      <Popover.Body>
        <p>Your phone number will be visible to bidders during the auction.</p>
      </Popover.Body>
    </Popover>
  );

  const popoverDescription = (
    <Popover id="popover-description">
      <Popover.Header as="h3">Description</Popover.Header>
      <Popover.Body>
        <p>
          Describe the item you are auctioning. You can use the toolbar to
          format your text.
        </p>
      </Popover.Body>
    </Popover>
  );

  const popoverVisibility = (
    <Popover id="popover-visibility">
      <Popover.Header as="h3">Visibility</Popover.Header>
      <Popover.Body>
        <p>
          If you enable visibility, your auction will be added to the public
          feed.
        </p>
      </Popover.Body>
    </Popover>
  );

  return (
    <div className="d-flex flex-column gap-3">
      <div>
        <div className="title w-auto mt-2">
          <h4>Item Name</h4>
        </div>
        <input
          type="text"
          className="form-control w-lg-50 w-md-50 w-sm-100"
          placeholder="Enter Item name"
          aria-label="Auction Title"
          aria-describedby="currency"
          maxLength="255"
          value={name}
          onChange={handleTitleChange}
        />
        <small className="form-text text-muted">
          at least 3, not more than 255 characters
        </small>
      </div>
      <div
        id="image-details"
        className="d-flex flex-row justify-content-between w-100 mb-1"
      >
        <div className="d-flex flex-column justify-content-center align-items-center w-100">
          <div className="w-100 position-relative" style={{ height: "300px" }}>
            <div className="title w-auto mt-2">
              <h4>Images</h4>
            </div>
            <Dropzone
              onDrop={handleUpload}
              accept={{
                "image/png": [".png"],
                "image/jpeg": [".jpeg"],
                "image/jpg": [".jpg"],
                "image/gif": [".gif"],
              }}
              minSize={1024}
              maxSize={6830020}
            >
              {({
                getRootProps,
                getInputProps,
                isDragActive,
                isDragAccept,
                isDragReject,
              }) => {
                const additionalClass = isDragAccept
                  ? "accept"
                  : isDragReject
                  ? "reject"
                  : "";

                return (
                  <div
                    style={{ height: "80%" }}
                    {...getRootProps({
                      className: `dropzone ${additionalClass}`,
                    })}
                  >
                    <input {...getInputProps()} />
                    <p>Drag & drop images, or click to select files</p>
                    <div className="image-preview">
                      {droppedFiles.map((file, index) => (
                        <div key={index} className="image-container">
                          <img
                            key={file.name}
                            src={file.imgURL || URL.createObjectURL(file)}
                            alt={file.name}
                          />
                          <button
                            className="remove-button"
                            onClick={handleRemoveClick(file)}
                          >
                            <i
                              className="fa-solid fa-x fa-sm"
                              style={{ color: "white" }}
                            ></i>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }}
            </Dropzone>
            <small className="form-text text-muted position-absolute w-50 pe-3">
              At least 1, not more than 10 images
            </small>
          </div>
          <small className="form-text text-muted">
            {" "}
            {droppedFiles.length}/10{" "}
          </small>
        </div>
      </div>
      <div id="details" className="d-flex flex-column gap-3">
        <div className="title w-auto mt-2">
          <h4>Timing</h4>
        </div>
        <div className="row d-flex flex-row w-auto gap-3">
          <div className="col-md-auto col-sm-12">
            <DateRange
              editableDateInputs={true}
              onChange={handleDateChange}
              moveRangeOnFirstSelection={false}
              ranges={[calendarState.selection]}
              minDate={minStartDate}
              color="#50B584"
              rangeColors={["#50B584"]}
            />
          </div>

          <div
            className="col-lg-auto col-sm-12 d-flex flex-row justify-content-between gap-3"
            style={{ minWidth: "365px" }}
          >
            <div className="col-6">
              <label htmlFor="start-time" className="form-label">
                <b>On: </b>
                {calendarState.selection.startDate.toDateString()}
                <br />

                <b>At:</b>
              </label>
              <input
                type="time"
                className="form-control"
                id="start-time"
                name="start-time"
                value={
                  calendarState.selection.startDate
                    ? `${String(
                        calendarState.selection.startDate.getHours()
                      ).padStart(2, "0")}:${String(
                        calendarState.selection.startDate.getMinutes()
                      ).padStart(2, "0")}`
                    : ""
                }
                onChange={(e) => handleTimeChange(e, "startDate")}
                required
              />
            </div>
            <div className="col-6">
              <label htmlFor="end-time" className="form-label">
                <b>Until: </b>
                {calendarState.selection.endDate
                  ? calendarState.selection.endDate.toDateString()
                  : calendarState.selection.startDate.toDateString()}{" "}
                <br />
                <b>At:</b>
              </label>
              <input
                type="time"
                className="form-control"
                id="end-time"
                name="end-time"
                value={
                  calendarState.selection.endDate
                    ? `${String(
                        calendarState.selection.endDate.getHours()
                      ).padStart(2, "0")}:${String(
                        calendarState.selection.endDate.getMinutes()
                      ).padStart(2, "0")}`
                    : ""
                }
                onChange={(e) => handleTimeChange(e, "endDate")}
                required
              />
            </div>
          </div>
          <small className="text-muted row ms-1">*Later than: {liveTime}</small>
          <small className="text-muted row ms-1">
            At least 1 hour, not more that 7 days
          </small>
        </div>
        <div className="price-selector">
          <div className="title w-auto mt-2">
            <h4>Pricing</h4>
          </div>
          <div className="d-flex flex-column gap-2">
            <div>
              <label htmlFor="starting-price" className="form-label">
                Starting price
              </label>
              <div className="d-flex flex-row gap-3">
                <div className="input-group">
                  <span className="input-group-text" id="currency">
                    JOD
                  </span>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="0"
                    aria-label="Starting price"
                    aria-describedby="currency"
                    min="0"
                    onChange={(e) => {
                      handlePriceChange(e);
                    }}
                    value={price}
                  />
                </div>
              </div>
              <small className="form-text text-muted">Starting at 0 JOD</small>
            </div>
            <div>
              <label htmlFor="minimum-increment" className="form-label">
                Minimum increment
              </label>
              <div className="d-flex flex-row gap-3">
                <div className="input-group">
                  <span className="input-group-text" id="currency">
                    JOD
                  </span>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="1"
                    aria-label="Starting price"
                    aria-describedby="currency"
                    min="1"
                    onChange={(e) => {
                      handleMinBidChange(e);
                    }}
                    value={minBid}
                  />
                </div>
              </div>
              <small className="form-text text-muted">Starting at 1 JOD</small>
            </div>
          </div>
        </div>
        <div>
          <div className="title w-auto mt-2">
            <h4>Category</h4>
          </div>
          <div className="row row-cols-auto">
            {isFetching ? (
              <div className=" text-center w-100 mt-5">
                <div
                  className="spinner-border text-primary opacity-25"
                  role="status"
                >
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              categories &&
              categories.map((category) => (
                <div
                  key={category.id}
                  className={`col p-2 border rounded m-1 px-2 ${
                    selectedCategory &&
                    selectedCategory["id"] === category["id"]
                      ? "selected"
                      : ""
                  }`}
                  onClick={() => handleCategorySelect(category)}
                  style={{ cursor: "pointer" }}
                >
                  {category.name}
                </div>
              ))
            )}
          </div>
        </div>
        <Tag tags={tags} setTags={setTags} maxTags={3} />
      </div>

      <div id="phone-show">
        <div className="title d-flex flex-row justify-content-start align-items-center gap-3">
          <h4>Phone Number</h4>
          <div style={{ cursor: "pointer" }}>
            <OverlayTrigger
              className="overlay"
              trigger="click"
              placement="right"
              style={{ cursor: "pointer" }}
              overlay={popoverPhone}
            >
              <FontAwesomeIcon icon="fa-question-circle" size="sm" />
            </OverlayTrigger>
          </div>
        </div>
        <div className="d-flex flex-row justify-content-start align-items-center gap-3 p-3 border rounded">
          <input
            type="checkbox"
            id="phone-show-checkbox"
            name="phone-show-checkbox"
            value={showNumber}
            checked={showNumber}
            onChange={(e) => setShowNumber(e.target.checked)}
          />
          <label htmlFor="phone-show-checkbox">
            Make my phone number visible to bidders during the auction.
          </label>
        </div>
      </div>

      <div id="desc-add">
        <div className="title d-flex flex-row justify-content-start align-items-center gap-3">
          <div className="title w-auto mt-2">
            <h4>Description</h4>
          </div>
          <div style={{ cursor: "pointer" }}>
            <OverlayTrigger
              className="overlay"
              trigger="click"
              placement="right"
              style={{ cursor: "pointer" }}
              overlay={popoverDescription}
            >
              <FontAwesomeIcon icon="fa-question-circle" size="sm" />
            </OverlayTrigger>
          </div>
        </div>
        <div className="h-100 mb-1">
          <div style={{ width: "100%", minHeight: "100px" }}>
            {/* <div ref={quillRef} /> */}
            <Editor
              ref={quillRef}
              // onSelectionChange={setRange}
              onTextChange={handleDescriptionChange}
              defaultValue={htmlToDelta(description)}
            />
            <div className="d-flex flex-row justify-content-start">
              <small className="form-text text-muted">
                limited to ({currentDescriptionLength - 1}/1000)
              </small>
            </div>
          </div>
        </div>
      </div>

      <div id="visibility">
        <div className="title d-flex flex-row justify-content-start align-items-center gap-3">
          <h4>Visibility</h4>
          <div style={{ cursor: "pointer" }}>
            <OverlayTrigger
              className="overlay"
              trigger="click"
              placement="right"
              style={{ cursor: "pointer" }}
              overlay={popoverVisibility}
            >
              <FontAwesomeIcon icon="fa-question-circle" size="sm" />
            </OverlayTrigger>
          </div>
        </div>
        <div className="d-flex flex-row justify-content-start align-items-center gap-3 p-3 border rounded">
          <input
            type="checkbox"
            id="visibility-checkbox"
            name="visibility-checkbox"
            value={!visibility}
            checked={!visibility}
            onChange={(e) => setVisibility(!visibility)}
          />
          <label htmlFor="visibility-checkbox">
            Add Auction to the public feed.
          </label>
        </div>
      </div>
      {isEdit ? null : (
        <div className="w-100 d-flex flex-row justify-content-center">
          <button
            className="submit-button btn btn-secondary w-auto text-white px-5"
            disabled={isAddingItem}
            onClick={handleSubmit}
          >
            Add Mazad!
            {isAddingItem && (
              <div
                className="spinner-border spinner-border-sm ms-2"
                role="status"
              >
                <span className="visually-hidden">Loading...</span>
              </div>
            )}
          </button>
        </div>
      )}
      {!submitValid && (
        <p style={{ color: "red", fontSize: "15px" }}>
          Fill in all input fields!
        </p>
      )}
    </div>
  );
};
export default ItemForm;
