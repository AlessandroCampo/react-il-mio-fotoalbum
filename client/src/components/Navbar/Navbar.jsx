import {
    IoHome,
    IoHomeOutline,
    IoCompass,
    IoCompassOutline,
    IoSearch,
    IoNotifications,
    IoText

} from "react-icons/io5";

import { BiSolidLogInCircle } from "react-icons/bi";

import { BiSolidMessageRoundedDots as MessageIcon } from "react-icons/bi";

import { Avatar } from "@mui/material";
import logo from '../../assets/img/logo.png';
import './NavbarStyles.css';
import { useState } from "react";
import LoginModal from "../LoginModal/LoginModal";

export default function Navbar() {

    const [searchValue, setSearchValue] = useState('');
    const [loginModalOpen, setloginModalOpen] = useState(false);


    return (
        <menu className="px-6 py-4 mt-2">
            <LoginModal
                open={loginModalOpen}
                setOpen={setloginModalOpen}
            />
            <div className="navbar-left">
                <figure className="max-w-[30px]">
                    <img
                        src={logo}
                        alt="logo"
                    />
                </figure>
                <IoHomeOutline />
                <IoCompassOutline />
            </div>
            <div className="searchbar">
                <IoSearch className="text-2xl me-3 no-hover-icon" />
                <input type="search"
                    placeholder="Search"
                    value={searchValue}
                    onChange={(e) => { setSearchValue(e) }}

                />
            </div>
            <div className="navbar-right">
                <IoNotifications />
                <MessageIcon />
                {
                    1 === 1 ?
                        <BiSolidLogInCircle
                            onClick={() => { setloginModalOpen(true) }}
                        /> :
                        <Avatar
                            alt="user"
                            src="mskdmaksfm.jpg"
                            sx={{ bgcolor: '#FFCC70', width: 30, height: 30 }}
                        />
                }
            </div>
        </menu>
    );
}
