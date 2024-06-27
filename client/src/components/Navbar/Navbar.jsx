import {
    IoHomeOutline,
    IoCompassOutline,
    IoSearch,
    IoNotifications,
    IoLogOut,
    IoSettings
} from "react-icons/io5";

import { RiUserFill } from "react-icons/ri";


import { BiSolidMessageRoundedDots as MessageIcon } from "react-icons/bi";
import { Avatar } from "@mui/material";
import logo from '../../assets/img/logo.png';
import './NavbarStyles.css';
import { useState } from "react";
import { useAuth } from "../../contexts/authContext";
import Dropdown from "../Dropdown";


export default function Navbar({ openLoginModal }) {



    const [searchValue, setSearchValue] = useState('');
    const { isLoggedIn, user, logout } = useAuth();


    const userDropdownOptions = [
        {
            label: 'Profile',
            icon: <RiUserFill
                className="no-hover-icon"
            />,
            cb: () => { }
        },
        {
            label: 'Settings',
            icon: <IoLogOut
                className="no-hover-icon"

            />,
            cb: () => { }
        },
        {
            label: 'Logout',
            icon: <IoSettings
                className="no-hover-icon"

            />,
            cb: () => { logout() }
        },
    ]


    return (
        <menu className="px-6 py-4 mt-2">
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
                    isLoggedIn === false ?
                        <RiUserFill
                            onClick={openLoginModal}
                        /> :
                        <Dropdown
                            button={<Avatar
                                alt={user.username}
                                src={user.avatar}
                                sx={{ bgcolor: '#FFCC70', width: 30, height: 30 }}
                                className="cursor-pointer hover:scale-110"
                            />}
                            options={userDropdownOptions}
                        />

                }
            </div>
        </menu>
    );
}
