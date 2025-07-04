import React from 'react';
import Navbar from '../Components/Navbar';
import { Outlet } from 'react-router';

const AuthLayout = () => {
    return (
        <div className='dark:bg-gray-900'>
            <nav className='bg-gray-100 py-1'>
                <Navbar/>
            </nav>
            <Outlet/>
        </div>
    );
};

export default AuthLayout;