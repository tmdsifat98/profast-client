import React from 'react';
import logo from '../assets/logo.png';
const Logo = () => {
    return (
        <div className="relative">
          <img src={logo} alt="" />
          <h1 className="absolute top-4 left-6 text-2xl font-bold">Profast</h1>
        </div>
    );
};

export default Logo;