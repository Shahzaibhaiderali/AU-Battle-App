


import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import TopNavBar from './TopNavBar';
import BottomNavBar from './BottomNavBar';
import SideNavBar from './SideNavBar';

const DashboardLayout: React.FC = () => {
    
    // On desktop, we want a wider container. On mobile, it's edge-to-edge.
    const containerClasses = "lg:max-w-7xl lg:mx-auto lg:flex";

    return (
        <div className={`min-h-screen w-full bg-theme ${containerClasses}`}>
            <SideNavBar />
            <div className="flex-grow flex flex-col lg:w-0">
                <TopNavBar />
                <main className="flex-grow overflow-y-auto p-4 pb-24 lg:pb-4">
                    <Outlet />
                </main>
            </div>
            <BottomNavBar />
        </div>
    );
};

export default DashboardLayout;