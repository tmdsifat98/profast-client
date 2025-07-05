import React from "react";
import { Outlet } from "react-router";
import Navbar from "../Components/Navbar";

const Root = () => {
  return (
    <div className="bg-white backdrop-blur-2xl dark:bg-gray-950">
      <nav className="py-1 sticky top-0 z-[999] bg-white/30">
        <Navbar />
      </nav>
      <Outlet />
    </div>
  );
};

export default Root;
