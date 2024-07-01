import { ToastContainer } from "react-toastify";
import Navbar from "../components/Navbar/Navbar";
import { Outlet } from "react-router";
import { useState } from "react";
import LoginModal from "../components/LoginModal/LoginModal";
import CreateModal from "../components/modals/CreateModal";
import { BsFillPlusCircleFill as PlusIcon } from "react-icons/bs";
import EditModal from "../components/modals/EditModal";
import { useGlobal } from "../contexts/globalContext";
import GeneralModal from "../components/modals/GeneralModal";
import RegisterModal from "../components/LoginModal/RegisterModal";

export default function () {
    const [loginModalOpen, setLoginModalOpen] = useState(false);
    const [registerModalOpen, setRegisterModalOpen] = useState(false);
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const { editModalOpen, setEditModalOpen, deleteModalOpen, setDeleteModalOpen, toDeletePicture, deletePicture } = useGlobal();



    return (
        <div className="layout-container flex flex-col w-full h-screen relative">
            <Navbar openLoginModal={() => setLoginModalOpen(true)} />

            <LoginModal open={loginModalOpen} setOpen={setLoginModalOpen} openRegister={setRegisterModalOpen} />
            <RegisterModal open={registerModalOpen} setOpen={setRegisterModalOpen} openLogin={setLoginModalOpen} />
            <CreateModal open={createModalOpen} setOpen={setCreateModalOpen} />
            <EditModal open={editModalOpen} setOpen={setEditModalOpen} />
            <GeneralModal
                open={deleteModalOpen}
                title={`Are you sure you want to delete ${toDeletePicture?.title}?`}
                description="If you delete this picture, you won't be able to recover it"
                onConfirm={() => { deletePicture(toDeletePicture?.slug) }}
                onCancel={() => { setDeleteModalOpen(false) }}
                confirmLabel='Yes, delete'
                cancelLabel='No, keep the picture'
            />

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