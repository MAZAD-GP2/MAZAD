import React, { useEffect } from "react";
import Navbar from "./Navbar";
import "../assets/css/addItem.css";
import { useState,useRef } from "react";
import * as api from "../api/index";
import { useNavigate } from "react-router-dom";
import moment from 'moment'

const AddItem = () => {
  const [tags, setTags] = useState([]);
  const [editingIndex, setEditingIndex] = useState(-1); // -1 means no editing
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const [itemName, setItemName] = useState("");
  const [description, setDescription] = useState("");
  const [desclength, setDescLength] = useState(0);
  
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  
  const [startTimeWarning, setStartTimeWarning] = useState(false);
  const [endTimeWarning, setEndTimeWarning] = useState(false);

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
    const currentDate = new Date().toISOString().slice(0,16);

    if (startDate <= currentDate) {
        setStartTimeWarning(true);
    } else {
        setStartTimeWarning(false);
    }
  }

  const handleEndTimeWarning = () => {
      if (startDate >= endDate) {
        setEndTimeWarning(true);
      } else setEndTimeWarning(false);
  };

  const handleSubmit = async () => {
    if(!itemName || !description || !startDate  || !endDate || startTimeWarning) {
			setSubmitValid(false);
		}
    else {
			setSubmitValid(true);
      const newTags = tags.filter((tag) => tag.trim() !== "");
      setTags(newTags);
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
                  type="datetime-local"
                  className="time-input form-control mx-1 d-inline"
                  value={startDate}
                  onChange={handleStartDateChange}
                />

                {startTimeWarning && (
                  <p style={{ color: "red", fontSize: '15px'  }}>
                    Start time must be greater than current date and time 
                  </p>
                )}
              </span>

              <span>
                <h5>Auction end date-time</h5>
                <input
                  type="datetime-local"
                  className="time-input form-control d-inline"
                  value={endDate}
                  onChange={handleEndDateChange}
                />

                {endTimeWarning && (
                  <p style={{ color: "red", fontSize: '15px' }}>
                    End time must be greater than start date and time
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
                onClick={() => handleTagEditStart(index)}
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
