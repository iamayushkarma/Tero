import React from 'react'
import Navbar from '../components/layouts/Navbar/Navbar'
import Footer from '../components/layouts/Footer/Footer'
import { Outlet } from 'react-router-dom'

const MainLayout: React.FC = () => {
    return (
        <div className="Mainlayout flex h-svh">
            <Navbar />
            <div>
                <Outlet />
            </div>
            <Footer />
        </div>
    )
}
export default MainLayout
