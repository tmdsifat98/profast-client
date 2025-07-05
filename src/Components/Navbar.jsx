import { Link, NavLink } from "react-router";
import { MdArrowOutward, MdMenu } from "react-icons/md";
import Theme from "./Theme";
import useAuth from "../hooks/useAuth";
import Swal from "sweetalert2";
import Logo from "./Logo";

const Navbar = () => {
  const { user, logOut } = useAuth();
  console.log(user);
  const links = (
    <>
      <li>
        <NavLink to="/">Home</NavLink>
      </li>
      <li>
        <NavLink to="/services">Services</NavLink>
      </li>
      <li>
        <NavLink to="/coverage">Coverage</NavLink>
      </li>
      <li>
        <NavLink to="/about-us">About Us</NavLink>
      </li>
      {user && (
        <>
          <li>
            <NavLink to="/pricing">Pricing</NavLink>
          </li>
          <li>
            <NavLink to="/addParcel">Add parcel</NavLink>
          </li>
          <li>
            <NavLink to="/dashboard">Dashboard</NavLink>
          </li>
        </>
      )}
    </>
  );

  const handleLogout = () => {
    logOut().then(() => {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "User logged out successfully!",
        showConfirmButton: false,
        timer: 1500,
      });
    });
  };
  return (
    <div className="navbar w-11/12 mx-auto">
      <div className="navbar-start">
        <div className="dropdown">
          <div
            tabIndex={0}
            role="button"
            className="cursor-pointer mr-2 lg:hidden"
          >
            <MdMenu size={26} />
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
          >
            {links}
          </ul>
        </div>
        <Logo />
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="flex items-center justify-center gap-7 text-lg font-semibold dark:text-white">
          {links}
        </ul>
      </div>
      <div className="navbar-end gap-3">
        <Theme />
        {user ? (
          <div className="dropdown">
            <div tabIndex={0} role="button">
              <img
                src={user.photoURL}
                className="w-10 h-10 rounded-full cursor-pointer"
              />
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-base-100 items-center gap-2 rounded-box z-1 w-44 mt-2 p-2 shadow-sm right-0"
            >
              <li>{user.displayName}</li>
              <li>
                <button
                  onClick={handleLogout}
                  className="btn btn-primary text-black"
                >
                  Logout
                </button>
              </li>
              <li>
                {" "}
                <Link to="/beARider" className="btn btn-primary text-black md:hidden">
                  Be a Rider
                </Link>
              </li>
              <li>
                <button className="btn rounded-full px-2 hover:bg-primary md:hidden">
                  <MdArrowOutward size={22} />
                </button>
              </li>
            </ul>
          </div>
        ) : (
          <Link to="/auth/login">
            <button className="btn hover:bg-primary">Login</button>
          </Link>
        )}
        <Link to="/beARider" className="hidden md:block">
          <button className="btn btn-primary text-black">Be a Rider</button>
        </Link>
        <button className="btn rounded-full px-2 hover:bg-primary hidden md:block">
          <MdArrowOutward size={22} />{" "}
        </button>
      </div>
    </div>
  );
};
export default Navbar;
