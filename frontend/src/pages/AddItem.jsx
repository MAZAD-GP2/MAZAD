import React, { useEffect } from "react";
import Navbar from "./Navbar";
import "../assets/css/addItem.css";
import { useState, useRef } from "react";
import * as api from "../api/index";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons';
import axios from "axios";
import Dropzone from "react-dropzone";
// import storage from "../../../backend/firebaseConfig";
// import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

import moment from "moment";
import Tag from "./Tag";

const AddItem = () => {
  // const storage = getStorage();
  const { enqueueSnackbar } = useSnackbar();

  const [tags, setTags] = useState([]);
  const [editingIndex, setEditingIndex] = useState(-1); // -1 means no editing
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  
  const categories = ['hse','h','agawf','awashnt','agawfa','hsafawd','houseware','arf'];
  const [category, setCategory] = useState("");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [startTimeWarning, setStartTimeWarning] = useState(false);
  const [endTimeWarning, setEndTimeWarning] = useState(false);

  const [submitValid, setSubmitValid] = useState(true);
  const [droppedFiles, setDroppedFiles] = useState([]);
  // const [file, setFiles] = useState([]);

  const [dropdownToggled, setDropdownToggled] = useState(false);

  const toggleDropdown = () => {
    setDropdownToggled(!dropdownToggled);
  };

  const handleAddTag = () => {
    setTags([...tags, ""]);
  };

  const handleTagChange = (index, event) => {
    const newTags = [...tags];
    newTags[index] = event.target.value;
    setTags(newTags);
  };

  const handleItemChange = (event) => {
    setName(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
    handleStartTimeWarning();
    handleEndTimeWarning();
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
    handleEndTimeWarning();
  };

  const handleTagEditStart = (index) => {
    setEditingIndex(index);
  };

  const handleTagEditEnd = () => {
    setEditingIndex(-1);
  };

  const handleStartTimeWarning = () => {
    const currentDate = new Date().toISOString().slice(0, 16);

    if (startDate <= currentDate) {
      setStartTimeWarning(true);
    } else {
      setStartTimeWarning(false);
    }
  };

  const handleEndTimeWarning = () => {
    if (startDate >= endDate) {
      setEndTimeWarning(true);
    } else setEndTimeWarning(false);
  };

  const handleSubmit = async () => {
    if (!name || !description || !startDate || !endDate || startTimeWarning) {
      setSubmitValid(false);
    } else {
      setSubmitValid(true);

      // Create a FormData object
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("startDate", startDate);
      formData.append("endDate", endDate);
      formData.append("tags", tags);

      droppedFiles.forEach((file) => {
        formData.append("images", file);
      });

      try {
        // Send the FormData object using Axios
        const response = await api.addItem(formData);

        // Handle the response as needed
        console.log(response.data);
        enqueueSnackbar("Added item", { variant: "success" });
        setName("");
        setDescription("");
        setTimeout(() => {
          navigate("/");
        }, 1000);
      } catch (error) {
        // Handle errors
        console.error("Error:", error);
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

  return (
    <>
      <Navbar />
      <div id="main">
        <div id="image-details">
          <div id="image-upload-container" className="d-flex flex-column justify-content-center align-items-center">
            <div className="w-100">
              <h3>Images</h3>
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
            </div>
            <span>{droppedFiles.length}/5</span>
          </div>
          <div className="d-flex flex-row">
          <div id="details">
            <div className="d-flex">
              <h4>Item Name</h4>
            </div>
            <input
              type="text"
              className="form-control w-50 mx-1 mb-4"
              placeholder="Enter item name"
              onChange={handleItemChange}
            />
            <span className="mb-3">
              <h5>Auction start date-time</h5>
              <input
                type="datetime-local"
                className="time-input form-control mx-1 d-inline w-25"
                value={startDate}
                onChange={handleStartDateChange}
              />

              {startTimeWarning && (
                <p style={{ color: "red", fontSize: "15px" }}>Start time must be greater than current date and time</p>
              )}
            </span>

            <span>
              <h5>Auction end date-time</h5>
              <input
                type="datetime-local"
                className="time-input form-control d-inline w-25"
                value={endDate}
                onChange={handleEndDateChange}
              />

              {endTimeWarning && (
                <p style={{ color: "red", fontSize: "15px" }}>End time must be greater than start date and time</p>
              )}
            </span>
            <br />
          </div>
          <div className="dropdown">
            <h4>Category</h4>
            <p id="dropdown-select" className={dropdownToggled ? 'open' : ''} onClick={toggleDropdown}>
              {category ? category : <>Select Category</>} <FontAwesomeIcon icon="fa-solid fa-caret-down"/>
            </p>
            <div className={`dropdown ${dropdownToggled ? 'show' : ''}`}>
              {dropdownToggled && (
                <ul>
                  {categories.map((category) => (
                    <li 
                      key={category}
                      onClick={() => {
                        setCategory(category);
                        toggleDropdown();
                      }}>
                      {category}
                      </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          </div>
        </div>
        <div id="desc-add">
          <h4 style={{ marginRight: '68%' }}>Description</h4>
          <textarea
            className="inp"
            placeholder="Enter item description..."
            maxLength="255"
            onChange={handleDescriptionChange}
          />
          <p>{description.length}/255</p>
          
          <Tag tags={tags} setTags={setTags} />

          <button className="submit-button btn btn-secondary" onClick={handleSubmit}>
            Start Mazad
          </button>
          {!submitValid && <p style={{ color: "red", fontSize: "15px" }}>Fill in all input fields!</p>}
        </div>
      </div>
    </>
  );
};

export default AddItem;
