import React from 'react';
import logo from '../assets/logo.png';
import { Link } from 'react-router';
const Logo = () => {
    return (
        <Link to="/" className="relative">
          <img src={logo} alt="" />
          <h1 className="absolute top-4 left-6 text-2xl font-bold">Profast</h1>
        </Link>
    );
};

export default Logo;