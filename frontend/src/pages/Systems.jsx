import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';

/**
 * Systems — Layout shell for system sub-routes.
 * Renders an Outlet that receives Physical/Cognitive/Behavior/Reflection pages.
 * The Sidebar is shown by DashboardLayout when path starts with /systems.
 */
const Systems = () => {
    return <Outlet />;
};

/**
 * SystemsIndex — Shows when user hits /systems without a sub-route.
 * Redirects to /systems/physical by default.
 */
export const SystemsIndex = () => <Navigate to="/systems/physical" replace />;

export default Systems;
