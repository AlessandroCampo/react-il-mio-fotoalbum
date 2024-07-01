import { Dialog, DialogTitle } from "@mui/material";
import logo from '../../assets/img/logo.png'
import { useEffect, useRef, useState } from "react";
import { HiOutlineLockClosed as PassIcon, HiOutlineUser as UserIcon, HiOutlineMail as EmailIcon, HiOutlinePhotograph as ImageIcon } from "react-icons/hi";
import { AiOutlineClose as CloseIcon } from "react-icons/ai";
import { useAuth } from "../../contexts/authContext";
import { BeatLoader } from "react-spinners";

export default function ({ open, setOpen, openLogin }) {

    const { register, isLoggedIn } = useAuth();
    const [loading, setLoading] = useState(false);
    const formRef = useRef(null);
    const [registerError, setRegisterError] = useState('');
    const [pictureLabel, setPictureLabel] = useState('Upload your profile picture')

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(formRef.current);

        const username = formData.get('username');
        const password = formData.get('password');
        const password_confirmation = formData.get('password-confirmation');
        const image = formData.get('image');
        const email = formData.get('email');
        console.log(image);

        if (password !== password_confirmation) {
            setRegisterError("Passwords don't match")
            return
        }

        formData.delete('password-confirmation');

        try {
            await register(formData);
        } catch (err) {
            const errorMessage = err?.response?.data?.error?.message;
            console.error(err);
            setRegisterError(errorMessage);
        } finally {
            setLoading(false);
        }

    }

    const handleClose = () => {
        setRegisterError('');
        setOpen(false)
    }

    useEffect(() => {
        if (isLoggedIn) {
            handleClose();
        }
    }, [isLoggedIn]);


    const goToLogin = () => {
        openLogin(true)
        setOpen(false)
    }


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
                        <EmailIcon
                            className='text-xl no-hover-icon'
                        />
                        <input type="email"
                            className="bg-transparent w-full  border-transparent focus:border-transparent focus:ring-0"
                            placeholder="Your Email"
                            name='email'

                        />
                    </div>

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
                    <div className="input bg-input flex gap-3 items-center ps-4 rounded-md py-3 pe-3">
                        <PassIcon
                            className='text-xl no-hover-icon'
                        />
                        <input type="password"
                            className="bg-transparent w-full border-transparent focus:border-transparent focus:ring-0"
                            name='password-confirmation'
                            placeholder="Confirm Password" />
                    </div>
                    <div className="input bg-input flex gap-3 items-center ps-4 rounded-md py-3 pe-3">
                        <ImageIcon className='text-xl' />
                        <label htmlFor="profile_pic" className="cursor-pointer text-gray-400">{pictureLabel}</label>
                        <input
                            type="file" id="profile_pic"
                            className="bg-transparent w-full hidden"
                            name='image'
                            accept=".png, .jpg, .jpeg"
                            onChange={(e) => { setPictureLabel(e.target.files[0].name) }}

                        />
                    </div>
                    {
                        registerError && <div className="error-message text-theme max-w-full my-4">
                            {registerError}
                        </div>
                    }
                    <button
                        className="bg-theme hover:bg-themeDarker text-white text-lg font-bold py-2 px-4 rounded-full transition duration-300 mt-3"
                    >
                        {loading ? <BeatLoader color="white" size={10} margin={0} /> : 'Sign Up'}
                    </button >
                    {/* <button
                    className="bg-input hover:bg-gray-900 text-gray-400 border-0 border-gray-400 text-lg font-bold py-2 px-4 rounded-xl transition duration-300"
                >
                    Forgot your password ?
                </button > */}


                    <p
                        className="font-semibold mt-3 cursor-pointer ms-3"
                        onClick={goToLogin}
                    >
                        Already got an account?
                    </p >

                </form >
            </div>

        </Dialog>
    )
}