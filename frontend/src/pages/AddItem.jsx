import Navbar from "../components/Navbar";
import MobileNavbar from "../components/MobileNavbar";
import PageTitle from "../components/PageTitle";

import "../assets/css/addItem.css";
import { React, useEffect, useState, useCallback } from "react";
import * as api from "../api/index";
import { useSnackbar } from "notistack";

import Dropzone from "react-dropzone";

import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";

import Tag from "../components/Tag";

const AddItem = () => {
  const [description, setDescription] = useState([]);
  const [quillInitialized, setQuillInitialized] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [price, setPrice] = useState(0);
  const [tags, setTags] = useState([]);
  const [name, setName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [submitValid, setSubmitValid] = useState(true);
  const [droppedFiles, setDroppedFiles] = useState([]);
  const [calendarState, setCalendarState] = useState({
    selection: {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  });

  const { quill, quillRef } = useQuill({
    theme: "snow",
    placeholder: "Enter description here...",
    modules: {
      toolbar: [
        [{ header: "1" }, { header: "2" }],
        [{ size: [] }],
        ["bold", "italic", "underline"],
        [{ list: "ordered" }],
        ["clean"],
      ],
    },
  });

  const handleDescriptionChange = useCallback((content, delta, source) => {
    let limit = 1000;

    if (delta.ops[0].retain + 1 > limit) {
      quill.formatText(limit, 5000, {
        color: "rgb(220, 20, 60)",
        strike: true,
      });
      return;
    }
    // setDescription(delta.ops);
  }, []);

  useEffect(() => {
    if (quillInitialized) {
      quill.on("text-change", handleDescriptionChange);
    }
  }, [quillInitialized, handleDescriptionChange]);

  useEffect(() => {
    if (quill && !quillInitialized) {
      setQuillInitialized(true);
    }
  }, [quill, quillInitialized]);

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
    setPrice(event.target.value);
  };
  const handleSubmit = async () => {
    // trigger change on the quill editor by adding a new line, to insure its got the last letter, fk om el_handling :)
    let desc_text = quill.getText();
    if (desc_text.trim() === "") {
      setSubmitValid(false);
      return;
    }

    let desc = JSON.stringify(quill.getContents().ops);
    if (
      !name ||
      !desc.length ||
      !calendarState ||
      !calendarState.selection.startDate ||
      !calendarState.selection.endDate ||
      !selectedCategory ||
      !droppedFiles.length ||
      !price
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

      droppedFiles.forEach((file) => {
        formData.append("images", file);
      });

      try {
        setIsAddingItem(true);
        // Send the FormData object using Axios
        const response = await api.addItem(formData);
        // Handle the response as needed
        enqueueSnackbar("Added item", { variant: "success" });
        setName("");
        setDescription("");
        setTimeout(() => {
          window.location.href = "/home";
        }, 1000);
      } catch (error) {
        // Handle errors
        enqueueSnackbar(error.response.data.message, {
          variant: "error",
        });
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
  return (
    <>
      <Navbar />
      <PageTitle title="Start a Mazad" />
      <div className="p-3">
        <div id="main" className="container p-3 shadow bg-white">
          <div className="d-flex flex-column gap-3">
            <div>
              <h4>Auction title</h4>
              <input
                type="text"
                className="form-control w-lg-50 w-md-50 w-sm-100"
                placeholder="Enter auction name"
                aria-label="Auction Title"
                aria-describedby="basic-addon1"
                maxLength="255"
                onChange={handleTitleChange}
              />
              <small className="form-text text-muted">limited to 255 characters</small>
            </div>
            <div
              id="image-details"
              className="d-flex flex-row justify-content-between w-100 mb-1"
            >
              <div className="d-flex flex-column justify-content-center align-items-center w-100">
                <div className="w-100 position-relative">
                  <h4>Images</h4>
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
                          {...getRootProps({
                            className: `dropzone ${additionalClass}`,
                          })}
                        >
                          <input {...getInputProps()} />
                          <p>Drag & drop images, or click to select files</p>
                          <div className="image-preview">
                            {droppedFiles.map((file, index) => (
                              <div key={file.name} className="image-container">
                                <img
                                  src={URL.createObjectURL(file)}
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
                    At least one, not more than ten
                  </small>
                </div>
                <small className="form-text text-muted">
                  {" "}
                  {droppedFiles.length}/10{" "}
                </small>
              </div>
            </div>
            <div id="details" className="d-flex flex-column gap-3">
              <div className="row d-flex flex-row w-auto gap-3">
                <div className="col-md-auto col-sm-12">
                  <DateRange
                    editableDateInputs={true}
                    onChange={handleDateChange}
                    moveRangeOnFirstSelection={false}
                    ranges={[calendarState.selection]}
                    minDate={new Date()}
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
                <small className="text-muted row ms-1">limited to 7 days</small>
              </div>
              <div>
                <h4>Starting price</h4>
                <div className="d-flex flex-column">
                  <div className="d-flex flex-row gap-3">
                    <div className="input-group">
                      <span className="input-group-text" id="basic-addon1">
                        JOD
                      </span>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="1"
                        aria-label="Starting price"
                        aria-describedby="basic-addon1"
                        min="1"
                        onChange={(e) => {
                          handlePriceChange(e);
                        }}
                        value={price}
                      />
                    </div>
                  </div>
                  <small className="form-text text-muted">
                    Starting at 0 JOD
                  </small>
                </div>
              </div>
              <div>
                <h4>Category</h4>
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
              <Tag tags={tags} setTags={setTags} />
            </div>

            <div id="desc-add">
              <h4>Description</h4>
              <div className="h-100 mb-1">
                <div style={{ width: "100%", minHeight: "100px" }}>
                  <div ref={quillRef} />
                </div>
              </div>
            </div>
            <div className="w-100 d-flex flex-row justify-content-center">
              <button
                className="submit-button btn btn-secondary w-auto"
                disabled={isAddingItem}
                onClick={handleSubmit}
              >
                Start Mazad
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
            {!submitValid && (
              <p style={{ color: "red", fontSize: "15px" }}>
                Fill in all input fields!
              </p>
            )}
          </div>
        </div>
      </div>
      <MobileNavbar />
    </>
  );
};

export default AddItem;
