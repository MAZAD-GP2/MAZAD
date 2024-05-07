import Navbar from "../components/Navbar";
import MobileNavbar from "../components/MobileNavbar";
import PageTitle from "../components/PageTitle";

import "../assets/css/addItem.css";
import { React, useState, useRef } from "react";


import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";


import ItemForm from "../components/ItemForm.jsx";
import "quill/dist/quill.snow.css";
// const Delta = Quill.import("delta");


const AddItem = () => {
  const [description, setDescription] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [price, setPrice] = useState(0);
  const [minPrice, setMinPrice] = useState(1);
  const [tags, setTags] = useState([]);
  const [name, setName] = useState("");
  const [visibility, setVisibility] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [submitValid, setSubmitValid] = useState(true);
  const [droppedFiles, setDroppedFiles] = useState([]);
  const [showNumber, setShowNumber] = useState(false);
  const [calendarState, setCalendarState] = useState({
    selection: {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  });
  const [currentDescriptionLength, SetCurrentDescriptionLength] = useState(1);
  const quillRef = useRef();

  return (
    <>
      <Navbar />
      <PageTitle title="Start a Mazad" />
      <div className="p-3">
        <div id="main" className="container p-3 shadow bg-white">
          <ItemForm
            {...{
              description,
              setDescription,
              categories,
              isFetching,
              price,
              setPrice,
              minPrice,
              setMinPrice,
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
            }}
          />
        </div>
      </div>
      <MobileNavbar />
    </>
  );
};

export default AddItem;
