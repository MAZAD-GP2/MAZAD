import React, { useState } from "react";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

function ItemDateRange() {
  const [calendarState, setCalendarState] = useState({
    selection: {
      startDate: new Date(),
      endDate: null,
      key: "selection",
    },
  });

  const handleDateChange = (item) => {
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
    // setCalendarState((prevState) => ({
    //   ...prevState,
    //   selection: item.selection,
    // }));
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
      <div className="d-flex flex-column justify-content-between">
        <div className="d-flex flex-row justify-content-start gap-3">
          <div className="col-auto">
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
          <div className="col-auto d-flex flex-row justify-content-between gap-3">
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
                    ? `${String(calendarState.selection.startDate.getHours()).padStart(2, '0')}:${String(calendarState.selection.startDate.getMinutes()).padStart(2, '0')}`
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
                    ? `${String(calendarState.selection.endDate.getHours()).padStart(2, '0')}:${String(calendarState.selection.endDate.getMinutes()).padStart(2, '0')}`
                    : ""
                }
                onChange={(e) => handleTimeChange(e, "endDate")}
                required
              />
            </div>
          </div>
        </div>
        <small className="text-muted">limited to 7 days</small>
      </div>
    </>
  );
}

export default ItemDateRange;
