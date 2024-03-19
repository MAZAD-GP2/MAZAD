import React from "react";
import Navbar from "./Navbar";
import "../assets/css/addItem.css";
import { useState,useRef } from "react";
import * as api from "../api/index";
import { useNavigate } from "react-router-dom";

const AddItem = () => {
  const [tags, setTags] = useState([]);
  const [editingIndex, setEditingIndex] = useState(-1); // -1 means no editing
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const [itemName, setItemName] = useState("");
  const [description, setDescription] = useState("");
  const [desclength, setDescLength] = useState(0);
  
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [showWarning, setShowWarning] = useState(false);
  const [submitValid,setSubmitValid] = useState(true);

  const handleAddTag = () => {
    setTags([...tags,""]);
  };

  const handleTagChange = (index, event) => {
    const newTags = [...tags];
    newTags[index] = event.target.value;
    setTags(newTags);
  };

  const handleItemChange = (event) => {
    setItemName(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
    setDescLength(event.target.value.length);
  };

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
    handleTimeWarning();
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
    handleTimeWarning();
  };

  const handleStartTimeChange = (event) => {
    setStartTime(event.target.value);
    handleTimeWarning();
  };

  const handleEndTimeChange = (event) => {
    setEndTime(event.target.value);
    handleTimeWarning();
  };
  
  const handleTagEditStart = (index) => {
    setEditingIndex(index);
  };

  const handleTagEditEnd = () => {
    setEditingIndex(-1);
  };

  const handleTimeWarning = () => {
      if (startDate > endDate) {
        setShowWarning(true);
      } else if (startDate === endDate && startTime >= endTime) {
        setShowWarning(true);
      } else setShowWarning(false);
  };

  const handleSubmit = async () => {
    console.log(!!itemName, !!description, !!startDate, !!startTime, !!endDate, !!endTime, !!showWarning);
    if(!itemName || !description || !startDate || !startTime || !endDate || !endTime || showWarning) {
			setSubmitValid(false);
		}
    else {
			setSubmitValid(true);
      await api
      .addItem({itemName,description})
      .then(() => {
        enqueueSnackbar("Added item", { variant: "success" });
        setItemName("");
        setDescription("");
        setTimeout(() => {
          navigate("/");
        }, 1000);
      })
      // rest of auction addition logic
    }
		
  };

  return (
    <>
      <Navbar />
      <div id="main">
        <div id="image-details">
          <img
            id="image"
            src="https://images.unsplash.com/photo-1700295278848-d4a5d11b2133?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Card image cap"
          />
          <div id="details">
            <div className="d-flex align-content-between gap-10">
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
                  type="date"
                  className="form-control w-25 mx-1 d-inline"
                  value={startDate}
                  onChange={handleStartDateChange}
                />
                <input
                  type="time"
                  className="form-control w-25 mx-1 d-inline"
                  value={startTime}
                  onChange={handleStartTimeChange}
                />
                {/* Display warning message if necessary */}
                {showWarning && (
                  <p style={{ color: "red", fontSize: '15px'  }}>
                    Start date must be before end date!
                  </p>
                )}
              </span>

              <span>
                <h5>Auction end date-time</h5>
                <input
                  type="date"
                  className="form-control w-25 d-inline"
                  value={endDate}
                  onChange={handleEndDateChange}
                />
                <input
                  type="time"
                  className="form-control w-25 mx-1 d-inline"
                  value={endTime}
                  onChange={handleEndTimeChange}
                />

                {showWarning && (
                  <p style={{ color: "red", fontSize: '15px' }}>
                    Start date must be before end date!
                  </p>
                )}
              </span>
            <br />
            <h5>Add tags</h5>
            <span>
            {tags.map((tag, index) =>
            index === editingIndex ? ( // Render input field if editing
              <input
                key={index}
                type="text"
                value={tag}
                onChange={(event) => handleTagChange(index, event)}
                onBlur={handleTagEditEnd} // End editing when focus is lost
                className="tag-input d-inline"
                ref={inputRef}
                autoFocus
                style={{
                  width: inputRef.current ? inputRef.current.offsetWidth + 'px' : 'auto',
                }}
              />
            ) : ( // Render paragraph if not editing
              <p
                key={index}
                onClick={() => handleTagEditStart(index)} // Start editing when clicked
                className="tag-input d-inline"
              >
                {tag}
              </p>
            )
          )}
              {tags.length <= 2 && (
                <button className="tag" id="add-tag" onClick={handleAddTag}>
                  +
                </button>
              )}
            </span>
          </div>
        </div>
        <div id="desc-add">
          <h4>Description</h4>
          <textarea
            className="inp"
            placeholder="Enter item description..."
            maxLength="255"
            onChange={handleDescriptionChange}
          />
          <p id="desc-len">{desclength}/255</p>
					
          <button className="submit-button btn btn-secondary " onClick={handleSubmit}>
            Start Mazad
          </button>
          {!submitValid && <p style={{ color: "red", fontSize: '15px'  }}>Fill in all input fields!</p>}
        </div>
      </div>
    </>
  );
};

export default AddItem;
