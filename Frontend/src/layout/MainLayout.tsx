import React from "react";
import Navbar from "../components/layouts/Navbar/Navbar";
import Footer from "../components/layouts/Footer/Footer";
import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import ScrollToTop from "../components/ui/ScrollToTop";

const MainLayout: React.FC = () => {
  return (
    <>
      <ScrollToTop />
      <div className="Mainlayout bg-bg-gray-1 dark:bg-dark-bg-gray-1 flex min-h-screen cursor-default flex-col">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.4 }}
        >
          <Navbar />
        </motion.section>
        <Outlet />
        <Footer />
      </div>
    </>
  );
};
export default MainLayout;
