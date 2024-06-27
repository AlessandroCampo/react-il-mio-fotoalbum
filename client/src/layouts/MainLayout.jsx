import { ToastContainer } from "react-toastify";
import Navbar from "../components/Navbar/Navbar";
import { Outlet } from "react-router";

export default function () {
    return (
        <div className="layout-container flex flex-col w-full h-screen">
            <ToastContainer
                theme="dark"
                hideProgressBar
            />
            <Navbar />
            <div className="content-container h-full">
                <Outlet />
            </div>
        </div>
    )

}