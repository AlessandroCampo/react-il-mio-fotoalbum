import { ToastContainer } from "react-toastify";
import Navbar from "../components/Navbar/Navbar";
import { Outlet } from "react-router";
import { useState } from "react";
import LoginModal from "../components/LoginModal/LoginModal";
import CreateModal from "../components/CreateModal/CreateModal";
import { BsFillPlusCircleFill as PlusIcon } from "react-icons/bs";

export default function () {
    const [loginModalOpen, setLoginModalOpen] = useState(false);
    const [createModalOpen, setCreateModalOpen] = useState(false);

    return (
        <div className="layout-container flex flex-col w-full h-screen relative">
            <Navbar openLoginModal={() => setLoginModalOpen(true)} />

            <LoginModal open={loginModalOpen} setOpen={setLoginModalOpen} />
            <CreateModal open={createModalOpen} setOpen={setCreateModalOpen} />

            <ToastContainer theme="dark" hideProgressBar />

            <PlusIcon
                className="text-5xl bottom-20 right-20 fixed text-theme"
                onClick={() => setCreateModalOpen(true)}
            />

            <div className="content-container flex-grow mt-[100px] overflow-y-hidden">
                <Outlet />
            </div>
        </div>
    );
}