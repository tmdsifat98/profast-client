import { NavLink } from "react-router";
import logo from "../assets/logo.png";
import { MdArrowCircleRight, MdArrowOutward, MdMenu } from "react-icons/md";

const Navbar = () => {
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
      <li>
        <NavLink to="/pricing">Pricing</NavLink>
      </li>
      <li>
        <NavLink to="/addParcel">Add parcel</NavLink>
      </li>
    </>
  );
  return (
    <div className="navbar w-11/12 mx-auto bg-gray-100 my-2">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="cursor-pointer mr-2 lg:hidden">
            <MdMenu size={26}/>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
          >
            {links}
          </ul>
        </div>
        <div className="relative">
          <img src={logo} alt="" />
          <h1 className="absolute top-4 left-6 text-2xl font-bold">Profast</h1>
        </div>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="flex items-center justify-center gap-7 text-lg font-semibold">{links}</ul>
      </div>
      <div className="navbar-end gap-3">
       <button className="btn hover:bg-primary">Sign in</button>
       <button className="btn btn-primary text-black">Be a Rider</button>
       <button className="btn rounded-full px-2 hover:bg-primary"><MdArrowOutward size={22}/> </button>
      </div>
    </div>
  );
};
export default Navbar;
