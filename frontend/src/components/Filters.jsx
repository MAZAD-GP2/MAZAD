import React, { useState, useEffect } from "react";
import "../assets/css/Filters.css";
import AsyncSelect from "react-select/async";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import * as api from "../api/index";
import _debounce from "lodash/debounce";
import { useSnackbar } from "notistack";
import axios from "axios";
const animatedComponents = makeAnimated();

const Filters = ({ setItems }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [isFetchingCategory, setIsFetchingCategory] = useState(true);
  const [isFetchingTag, setIsFetchingTag] = useState(null);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedPopularity, setSelectedPopularity] = useState(null);

  useEffect(() => {
    setSelectedStatus("all");
    setMaxPrice("");
    setMinPrice("");
    // setSelectedPopularity("high");
    const fetchCategories = async () => {
      try {
        const response = await api.getAllCategories();
        setCategories(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsFetchingCategory(false);
      }
    };

    fetchCategories();
  }, []);

  const debouncedSearchTags = _debounce(async (inputValue, callback) => {
    setIsFetchingTag(true);
    inputValue = inputValue.trim();
    if (!inputValue) {
      setIsFetchingTag(false);
      return;
    }
    try {
      const response = await api.searchTags(inputValue);
      const options = response.data.map((tag) => ({
        value: tag.id,
        label: tag.name,
      }));
      callback(options);
    } catch (err) {
      enqueueSnackbar(`Error fetching tags ${err}`, {
        variant: "error",
        autoHideDuration: err.split(" ").length * 500,
      });
    } finally {
      setIsFetchingTag(false);
    }
  }, 500);
  const loadTags = (inputValue, callback) => {
    debouncedSearchTags(inputValue, callback);
  };

  const handlePriceChange = (event) => {
    const value = event.target.value;
    const id = event.target.id;
    const intValue = parseInt(value);
    if (id === "minPrice") {
      if (isNaN(intValue)) {
        setMinPrice("");
        return;
      }
      if (intValue < 0) {
        setMinPrice(0);
        return;
      }
      if (intValue > maxPrice) {
        setMinPrice(intValue);
        return;
      }
      setMinPrice(intValue);
    } else {
      if (isNaN(intValue)) {
        setMaxPrice("");
        return;
      }
      if (intValue < 0) {
        setMaxPrice(0);
        return;
      }
      if (intValue < minPrice) {
        setMaxPrice(intValue);
        return;
      }
      setMaxPrice(intValue);
    }
  };

  const handleStatusChange = (category) => {
    setSelectedStatus(category);
  };
  const handlePopularityChange = (popularity) => {
    setSelectedPopularity(popularity);
  };

  const handleSubmit = async () => {
    const filters = {
      status: selectedStatus,
      categories: selectedCategories.length > 0 ? selectedCategories : null,
      tags: selectedTags.length > 0 ? selectedTags : null,
      minPrice: minPrice,
      maxPrice: maxPrice,
      popularity: selectedPopularity,
    };

    let parameters = "";
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        if (Array.isArray(value)) {
          parameters += `${key}=${value.join(",")}&`;
        } else {
          parameters += `${key}=${value}&`;
        }
      }
    });

    const response = await api.getAllItems(parameters);
    setItems(response.data);
    
  };

  return (
    <div className="card w-100 d-flex flex-column flex-wrap align-items-center justify-content-center gap-3 p-2">
      <h3>Filters</h3>
      <div className="w-100 d-flex flex-column flex-wrap align-items-start justify-content-start p-2 gap-3">
        <div className="w-100 section" id="status-filter">
          <label className="form-check-label">Status</label>
          <div>
            <div
              id="all"
              className={`status col p-2 border rounded m-1 px-2 ${
                selectedStatus && selectedStatus === "all" ? "selected" : ""
              }`}
              onClick={() => {
                handleStatusChange("all");
              }}
            >
              All
            </div>
            <div
              id="live"
              className={`status col p-2 border rounded m-1 px-2 ${
                selectedStatus && selectedStatus === "live" ? "selected" : ""
              }`}
              onClick={() => {
                handleStatusChange("live");
              }}
            >
              live
            </div>
            <div
              id="upcoming"
              className={`status col p-2 border rounded m-1 px-2 ${
                selectedStatus && selectedStatus === "upcoming"
                  ? "selected"
                  : ""
              }`}
              onClick={() => {
                handleStatusChange("upcoming");
              }}
            >
              Upcoming
            </div>
          </div>
        </div>
        <div className="w-100 section">
          <label className="form-check-label" htmlFor="categories">
            Categories
          </label>
          <Select
            closeMenuOnSelect={true}
            components={animatedComponents}
            defaultValue={[]}
            isMulti
            isLoading={isFetchingCategory}
            placeholder="Select categories"
            onChange={(selected) => {
              setSelectedCategories(selected.map((category) => category.value));
            }}
            options={[
              ...categories.map((category) => ({
                value: category.id,
                label: category.name,
              })),
            ]}
            theme={(theme) => ({
              ...theme,
              borderRadius: 4,
              colors: {
                ...theme.colors,
                primary25: "#00e175",
                primary: "#00e175",
              },
            })}
            styles={{
              multiValueLabel: (styles) => ({
                ...styles,
                color: "#110F0F",
              }),
              multiValueRemove: (styles) => ({
                ...styles,
                color: "red",
              }),
            }}
          />
        </div>
        <div className="w-100 section">
          <label className="form-check-label" htmlFor="tags">
            Tags
          </label>
          <AsyncSelect
            cacheOptions
            defaultOptions
            isMulti
            isLoading={false}
            loadOptions={loadTags}
            components={animatedComponents}
            placeholder="Search..."
            onChange={(selected) => {
              setSelectedTags(selected.map((tag) => tag.value));
            }}
            theme={(theme) => ({
              ...theme,
              borderRadius: 4,
              colors: {
                ...theme.colors,
                primary25: "#00e175",
                primary: "#00e175",
              },
            })}
            styles={{
              multiValueLabel: (styles) => ({
                ...styles,
                color: "#110F0F",
              }),
              multiValueRemove: (styles) => ({
                ...styles,
                color: "red",
              }),
            }}
          />
        </div>
        <div className="d-flex flex-column w-100 section">
          <label className="form-check-label" htmlFor="price">
            Price
          </label>
          <div className="d-flex flex-column gap-3">
            <div className="d-flex flex-row">
              <div className="d-flex flex-row gap-3">
                <div className="input-group">
                  <span className="input-group-text" id="currency">
                    MIN JOD&nbsp;
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
                    id="minPrice"
                    value={minPrice}
                  />
                </div>
              </div>
            </div>
            <div className="d-flex flex-row">
              <div className="d-flex flex-row gap-3">
                <div className="input-group">
                  <span className="input-group-text" id="currency">
                    MAX JOD
                  </span>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="0"
                    aria-label="Starting price"
                    aria-describedby="currency"
                    min="1"
                    onChange={(e) => {
                      handlePriceChange(e);
                    }}
                    id="maxPrice"
                    value={maxPrice}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <div className="d-flex flex-column w-100 section">
          <label className="form-check-label" htmlFor="price">
            Location
          </label>
          <div className="w-100 gap-3">
            <Select
              closeMenuOnSelect={false}
              components={animatedComponents}
              defaultValue={[]}
              isMulti
              placeholder="Select cities"
              options={[
                { value: "amman", label: "Amman" },
                { value: "irbid", label: "Irbid" },
                { value: "zarqa", label: "Zarqa" },
                { value: "madaba", label: "Madaba" },
                { value: "aqaba", label: "Aqaba" },
                { value: "mafraq", label: "Mafraq" },
                { value: "tafila", label: "Tafila" },
                { value: "karak", label: "Karak" },
                { value: "maan", label: "Maan" },
                { value: "ajloun", label: "Ajloun" },
                { value: "jerash", label: "Jerash" },
                { value: "balqa", label: "Balqa" },
              ]}
              theme={(theme) => ({
                ...theme,
                borderRadius: 4,
                colors: {
                  ...theme.colors,
                  primary25: "#00e175",
                  primary: "#00e175",
                },
              })}
              styles={{
                multiValueLabel: (styles) => ({
                  ...styles,
                  color: "#110F0F",
                }),
                multiValueRemove: (styles) => ({
                  ...styles,
                  color: "red",
                }),
              }}
            />
          </div>
        </div> */}
        <div className="d-flex flex-column w-100 section">
          <label className="form-check-label" htmlFor="price">
            Popularity
          </label>
          <div className="w-100 gap-3">
            <div
              id="high"
              className={`status col p-2 border rounded m-1 px-2 ${
                selectedPopularity && selectedPopularity === "high"
                  ? "selected"
                  : ""
              }`}
              onClick={() => {
                handlePopularityChange("high");
              }}
            >
              Popular first
            </div>
            <div
              id="low"
              className={`status col p-2 border rounded m-1 px-2 ${
                selectedPopularity && selectedPopularity === "low"
                  ? "selected"
                  : ""
              }`}
              onClick={() => {
                handlePopularityChange("low");
              }}
            >
              Less popular first
            </div>
          </div>
        </div>
        <div className="d-flex flex-column w-100">
          {/* filter button */}
          <button
            type="button"
            className="btn btn-primary w-100"
            onClick={handleSubmit}
          >
            Filter
          </button>
        </div>
      </div>
    </div>
  );
};

export default Filters;