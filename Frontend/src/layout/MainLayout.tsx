import React from 'react'
import Navbar from '../components/layouts/Navbar/Navbar'
import Footer from '../components/layouts/Footer/Footer'
import { Outlet } from 'react-router-dom'

const MainLayout: React.FC = () => {
    return (
        <div className="Mainlayout flex flex-col min-h-screen bg-bg-gray-1 dark:bg-dark-bg-gray-1 cursor-default">
            <Navbar />
                <Outlet />
            <Footer />
        </div>
    )
}
export default MainLayout
