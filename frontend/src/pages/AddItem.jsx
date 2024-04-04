import Navbar from "./Navbar";
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

import ItemDateRange from "../components/ItemDateRange";
import Tag from "./Tag";

const AddItem = () => {
  const [description, setDescription] = useState([]);
  const [quillInitialized, setQuillInitialized] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const [isAddingItem, setIsAddingItem] = useState(false);
  
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

  const handleDescriptionChange = useCallback((content, delta, source, editor) => {
    let limit = 1000;

    if (delta.ops[0].retain + 1 > limit) {
      quill.formatText(limit, 5000, {
        color: "rgb(220, 20, 60)",
        strike: true,
      });
      return;
    }
    setDescription(delta.ops);
  }, []);

  useEffect(() => {
    if (quillInitialized) {
      quill.on("text-change", handleDescriptionChange);
    }

    return () => {
      if (quillInitialized) {
        quill.off("text-change", handleDescriptionChange);
      }
    };
  }, [quillInitialized, handleDescriptionChange]);

  useEffect(() => {
    if (quill && !quillInitialized) {
      setQuillInitialized(true);
    }
  }, [quill, quillInitialized]);

  const { enqueueSnackbar } = useSnackbar();

  const [tags, setTags] = useState([]);
  const [name, setName] = useState("");

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

  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  const [submitValid, setSubmitValid] = useState(true);
  const [droppedFiles, setDroppedFiles] = useState([]);
  // const [file, setFiles] = useState([]);

  const [dropdownToggled, setDropdownToggled] = useState(false);

  const handleItemChange = (event) => {
    setName(event.target.value);
  };

  const handleSubmit = async () => {
    // trigger change on the quill editor by adding a new line, to insure its got the last letter, fk om el_handling :)
    quill.insertText(quill.getLength(), "\n");
    quill.deleteText(quill.getLength() - 1, 1);

    if (
      !name ||
      !description ||
      !calendarState ||
      !calendarState.selection.startDate ||
      !calendarState.selection.endDate ||
      !selectedCategory ||
      !droppedFiles.length
    ) {
      setSubmitValid(false);
    } else {
      setSubmitValid(true);

      // Create a FormData object
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", JSON.stringify(description));
      formData.append("startDate", calendarState.selection.startDate);
      formData.append("endDate", calendarState.selection.endDate);
      formData.append("categoryId", selectedCategory.id);
      formData.append("tags", tags);

      droppedFiles.forEach((file) => {
        formData.append("images", file);
      });

      try {
        setIsAddingItem(true)
        // Send the FormData object using Axios
        const response = await api.addItem(formData);
        // Handle the response as needed
        enqueueSnackbar("Added item", { variant: "success" });
        setName("");
        setDescription("");
        setTimeout(() => {
          window.location.href = "/";
        }, 1000);
      } catch (error) {
        // Handle errors
        enqueueSnackbar(error.response.data.message, {
          variant: "error",
        });
      }
    }
  };

  const handleUpload = (acceptedFiles) => {
    acceptedFiles = acceptedFiles.slice(0, 5);
    const formData = new FormData();
    let wenRay7 = false;
    setDroppedFiles((images) => {
      const newImages = [...images];
      acceptedFiles.forEach((file) => {
        if (newImages.length >= 5) {
          wenRay7 = true;
          return;
        }
        if (!newImages.some((image) => image.name === file.name)) {
          newImages.push(file);
          formData.append("file", file);
        }
      });
      if (wenRay7) {
        enqueueSnackbar("ويييين رايح", { variant: "error" });
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
  const [calendarState, setCalendarState] = useState({
    selection: {
      startDate: new Date(),
      endDate: null,
      key: "selection",
    },
  });

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

    if (type === "startDate") {
      newDate.setHours(value.split(":")[0]);
      newDate.setMinutes(value.split(":")[1]);
      setCalendarState((prevState) => ({
        ...prevState,
        selection: {
          ...prevState.selection,
          startDate: newDate,
        },
      }));
    } else if (type === "endDate") {
      newDate.setHours(value.split(":")[0]);
      newDate.setMinutes(value.split(":")[1]);
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
      <div id="main" className="container mt-5 mb-5 p-3 shadow">
        <div className="d-flex flex-column gap-3">
          <div className="row p-2">
            <h4>Item title</h4>
            <input
              type="text"
              className="form-control w-lg-50 w-md-50 w-sm-100"
              placeholder="Enter item name"
              maxLength="255"
              onChange={handleItemChange}
            />
            <small className="form-text text-muted">limited to 255</small>
          </div>
          <div id="image-details" className="d-flex flex-row justify-content-between w-100 mb-1">
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
                  {({ getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject }) => {
                    const additionalClass = isDragAccept ? "accept" : isDragReject ? "reject" : "";

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
                              <img src={URL.createObjectURL(file)} alt={file.name} />
                              <button className="remove-button" onClick={handleRemoveClick(file)}>
                                <i className="fa-solid fa-x fa-sm" style={{ color: "white" }}></i>
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  }}
                </Dropzone>
                <small className="form-text text-muted position-absolute">At least one, not more that five</small>
              </div>
              <small className="form-text text-muted"> {droppedFiles.length}/5 </small>
            </div>
          </div>
          <div id="details" className="d-flex flex-column gap-3">
            <div className="d-flex flex-row w-auto gap-3">
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
              <div className="col-md-auto col-sm-12 d-flex flex-row justify-content-between gap-3">
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
                        ? `${String(calendarState.selection.startDate.getHours()).padStart(2, "0")}:${String(
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
                        ? `${String(calendarState.selection.endDate.getHours()).padStart(2, "0")}:${String(
                            calendarState.selection.endDate.getMinutes()
                          ).padStart(2, "0")}`
                        : ""
                    }
                    onChange={(e) => handleTimeChange(e, "endDate")}
                    required
                  />
                </div>
              </div>
            </div>
            <small className="text-muted">limited to 7 days</small>

            <div className="category-selector">
              <h4>Category</h4>
              <div className="row row-cols-auto">
                {isFetching ? (
                  <div className=" text-center w-100 mt-5">
                    <div className="spinner-border text-primary opacity-25" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : (
                  categories.map((category) => (
                    <div
                      key={category.id}
                      className={`col p-2 border rounded mx-1 px-2 ${
                        selectedCategory && selectedCategory["id"] === category["id"] ? "selected" : ""
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
            <div className="h-100 mb-3">
              <div style={{ width: "100%", minHeight: "100px" }}>
                <div ref={quillRef} />
              </div>
            </div>
          </div>
          <button className="submit-button btn btn-secondary" disabled={isAddingItem} onClick={handleSubmit}>
            Start Mazad
          </button>
          {!submitValid && <p style={{ color: "red", fontSize: "15px" }}>Fill in all input fields!</p>}
        </div>
      </div>
    </>
  );
};

export default AddItem;
