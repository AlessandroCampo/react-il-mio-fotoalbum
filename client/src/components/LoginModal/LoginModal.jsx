import { Dialog, DialogTitle } from "@mui/material";
import logo from '../../assets/img/logo.png'
import { useEffect, useRef, useState } from "react";
import { HiOutlineLockClosed as PassIcon, HiOutlineUser as UserIcon } from "react-icons/hi";
import { AiOutlineClose as CloseIcon } from "react-icons/ai";
import { useAuth } from "../../contexts/authContext";

export default function ({ open, setOpen }) {
    // const emptyLoginErrors = {
    //     username: [],
    //     password: []
    // }

    const { login, isLoggedIn } = useAuth();

    const formRef = useRef(null);
    const [loginError, setLoginError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(formRef.current);

        const username = formData.get('username');
        const password = formData.get('password');
        try {
            await login({ username, password });
        } catch (err) {
            const errorMessage = err?.response?.data?.error?.message;
            setLoginError(errorMessage);
        }

    }

    const handleClose = () => {
        setLoginError('');
        setOpen(false)
    }

    useEffect(() => {
        if (isLoggedIn) {
            handleClose();
        }
    }, [isLoggedIn]);


    return (
        <Dialog
            open={open}
            onClose={handleClose}
            PaperProps={{
                sx: { borderRadius: 10, width: 360 },


            }}
        >
            <div className="dialog-container flex items-center p-10 flex-col  text-gray-900 gap-4 relative">
                <CloseIcon
                    className="absolute top-8 right-8 text-2xl"
                    onClick={handleClose}
                />

                <img
                    src={logo}
                    alt="logo"
                    className="w-[35px]"
                />
                <DialogTitle>Welcome on Museverse</DialogTitle>
                <form
                    className="register flex flex-col max-w-full"
                    ref={formRef}
                    onSubmit={handleSubmit}
                >


                    <div className="input bg-input flex gap-3 items-center ps-4 rounded-md py-3 pe-3">
                        <UserIcon
                            className='text-xl no-hover-icon'
                        />
                        <input type="text"
                            className="bg-transparent w-full  border-transparent focus:border-transparent focus:ring-0"
                            placeholder="Your Username"
                            name='username'

                        />
                    </div>
                    <div className="input bg-input flex gap-3 items-center ps-4 rounded-md py-3 pe-3">
                        <PassIcon
                            className='text-xl no-hover-icon'
                        />
                        <input type="password"
                            className="bg-transparent w-full border-transparent focus:border-transparent focus:ring-0"
                            name='password'
                            placeholder="Your Password" />
                    </div>
                    {
                        loginError && <div className="error-message text-theme max-w-full my-4">
                            {loginError}
                        </div>
                    }
                    <button
                        className="bg-theme hover:bg-themeDarker text-white text-lg font-bold py-2 px-4 rounded-full transition duration-300 mt-3"
                    >
                        Log In
                    </button >
                    {/* <button
                    className="bg-input hover:bg-gray-900 text-gray-400 border-0 border-gray-400 text-lg font-bold py-2 px-4 rounded-xl transition duration-300"
                >
                    Forgot your password ?
                </button > */}


                    {/* <p className="font-semibold mt-3 cursor-pointer ms-3" >
                        Don't have an account yet?
                    </p > */}

                </form >
            </div>

        </Dialog>
    )
}