// pageTitle.jsx
//  a component that displays the title of the page, it will take a title prop and position it at the top of the page.
// this wil be used in mobile views

import React from "react";
import "../assets/css/pageTitle.css";
const PageTitle = ({ title }) => {
    return (
        <div className="page-title-container text-center mt-1" id="page-title">
            <span className="page-title ">{title}</span>
        </div>
    );
};

export default PageTitle;
