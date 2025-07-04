import React from "react";
import { Outlet } from "react-router";
import Navbar from "../Components/Navbar";

const Root = () => {
  return (
    <div className="bg-white dark:bg-gray-950">
      <nav className="py-1 bg-gray-100">
        <Navbar />
      </nav>
      <Outlet />
    </div>
  );
};

export default Root;
