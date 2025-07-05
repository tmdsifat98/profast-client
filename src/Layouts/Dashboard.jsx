import React, { useContext } from "react";
import { MdMenu } from "react-icons/md";
import { Link, NavLink, Outlet } from "react-router";
import { FaArrowLeft, FaHome, FaLeaf, FaMotorcycle, FaUsers } from "react-icons/fa";
import Swal from "sweetalert2";
import AuthContext from "../Providers/AuthContext";
import Logo from "../Components/Logo";

const Dashboard = () => {
  const { logOutUser } = useContext(AuthContext);
  const handleLogout = () => {
    logOutUser()
      .then(() => {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Log out successfull!",
          showConfirmButton: false,
          timer: 1500,
        });
      })
      .catch((err) => {
        Swal.fire({
          icon: "error",
          title: `${err.message}`,
          showConfirmButton: true,
        });
      });
  };

  const links = <><NavLink
        to="/dashboard"
        className={({ isActive }) =>
          isActive
            ? "flex items-center gap-2 bg-gray-300 py-2 pl-4 rounded dark:bg-gray-700"
            : "flex items-center gap-2 py-2 pl-4 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
        }
      >
        <FaHome />
        Home
      </NavLink>

      <NavLink
        to="/dashboard/myTips"
        className={({ isActive }) =>
          isActive
            ? "flex items-center gap-2 bg-gray-300 py-2 pl-4 rounded dark:bg-gray-700"
            : "flex items-center gap-2 py-2 pl-4 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
        }
      >
        <FaLeaf />
        My Tips
      </NavLink>

      <NavLink
        to="/dashboard/riderRequest"
        className={({ isActive }) =>
          isActive
            ? "flex items-center gap-2 bg-gray-300 py-2 pl-4 rounded dark:bg-gray-700"
            : "flex items-center gap-2 py-2 pl-4 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
        }
      >
        <FaMotorcycle />
        Rider Request
      </NavLink>

      <NavLink
        to="/dashboard/allRiders"
        className={({ isActive }) =>
          isActive
            ? "flex items-center gap-2 bg-gray-300 py-2 pl-4 rounded dark:bg-gray-700"
            : "flex items-center gap-2 py-2 pl-4 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
        }
      >
        <FaUsers />
        All Riders
      </NavLink></>
  return (
    <div className="drawer lg:drawer-open dark:bg-gray-900 dark:text-gray-200">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />

      {/* Drawer Content */}
      <div className="drawer-content flex flex-col">
        {/* Navbar */}
        <div className="navbar bg-base-300 w-full dark:bg-gray-700">
          <div className="flex-none lg:hidden">
            <label
              htmlFor="my-drawer"
              aria-label="open sidebar"
              className="btn btn-square btn-ghost"
            >
              <MdMenu size={25} />
            </label>
          </div>
          <div className="mx-2 flex-1 px-2 lg:hidden">
            <Logo/>
          </div>
        </div>
        <div className="px-6 py-4">
          <Outlet />
        </div>
      </div>
      <div className="drawer-side">
        <label
          htmlFor="my-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-0 dark:bg-gray-700 dark:text-gray-100">
          <Link
            className="pl-18 mb-5 bg-gray-200 gap-3 py-2 dark:bg-gray-600"
            to="/"
          >
            <Logo/> 
          </Link>
          {links}
          <button
            onClick={handleLogout}
            className="btn fixed bottom-1 w-full  bg-[#44cf44] border-none"
          >
            <FaArrowLeft /> Logout
          </button>
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
