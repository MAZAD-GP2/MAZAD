import React, { useState, useRef, useEffect } from "react";

const Payment = () => {


	// a useeffect to check if the user has won any unpaid auctions
	useEffect(() => {
    const fetchCategories = async () => {
      try {
        // const response = await api.getUnpaidAuctions(id);
        // setCategories(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsFetching(false);
      }
    };

    fetchCategories();
  }, []);

	return (
    <>
      <Navbar />
      <PageTitle title={"Payment"} />
      <div className="container p-3">
        <div className="d-flex flex-column justify-content-start border rounded shadow p-3 h-100">
          {/* fofo create responsive frontend for taking in card info */}
        </div>
      </div>
      <MobileNavbar />
    </>
  );
};

export default Payment;
