import {
    IoHomeOutline,
    IoCompassOutline,
    IoSearch,
    IoNotifications,
    IoSettings
} from "react-icons/io5";
import { RiUserFill } from "react-icons/ri";
import { BiSolidMessageRoundedDots as MessageIcon } from "react-icons/bi";
import { Autocomplete, Avatar, TextField } from "@mui/material";
import logo from '../../assets/img/logo.png';
import './NavbarStyles.css';
import { useState } from "react";
import { useAuth } from "../../contexts/authContext";
import Dropdown from "../Dropdown";
import { useNavigate } from "react-router";
import customAxiosInstance from "../../axiosClient";
import Multiselect from "../Multiselect";

export default function Navbar({ openLoginModal }) {
    const [searchValue, setSearchValue] = useState('');
    const [options, setOptions] = useState([]);
    const [selectedValue, setSelectedValue] = useState(null);
    const { isLoggedIn, user, logout } = useAuth();
    const navigate = useNavigate();

    const userDropdownOptions = [
        {
            label: 'Profile',
            icon: <RiUserFill className="no-hover-icon" />,
            cb: () => { navigate(`${user.username}`) }
        },
        {
            label: 'Logout',
            icon: <IoSettings className="no-hover-icon" />,
            cb: () => { logout() }
        },
    ];

    const returnToHome = () => {
        navigate('/');
    };

    const getSuggestions = async (value) => {
        try {
            const { data } = await customAxiosInstance.get(`/research?query=${value}`);
            setOptions(data.options);
        } catch (err) {
            console.error(err);
        }
    };

    const handleOptionSelected = (event, value) => {
        if (value) {
            setSelectedValue(value); // Track the selected value
            setSearchValue(''); // Clear the input after selection
            switch (value.type) {
                case 'User':
                    navigate(`/${value.label}`);
                    break;
                case 'Picture':
                    navigate(`/pin/${value.slug}`);
                    break;
                case 'Category':
                    navigate(`/explore/${value.label}`);
                    break;
                default:
                    return;
            }
        }
    };

    const handleInputChange = (event, newInputValue) => {
        setSearchValue(newInputValue);
        if (newInputValue) {
            getSuggestions(newInputValue);
        } else {
            setOptions([]);
        }
    };

    return (
        <menu className="px-6 py-4 mt-2 fixed w-full">
            <div className="navbar-left">
                <figure className="max-w-[30px] cursor-pointer" onClick={returnToHome}>
                    <img src={logo} alt="logo" />
                </figure>
                <IoHomeOutline onClick={returnToHome} />
                <IoCompassOutline onClick={(() => { navigate(`/explore`) })} />
            </div>
            <div className="searchbar">
                <IoSearch className="text-2xl me-3 no-hover-icon" />
                <Multiselect
                    searchValue={searchValue}
                    selectedValue={selectedValue}
                    handleInputChange={handleInputChange}
                    handleOptionSelected={handleOptionSelected}
                    options={options}

                />
            </div>
            <div className="navbar-right">
                <IoNotifications />
                <MessageIcon onClick={() => { navigate(`/${user.username}/chat`) }} />
                {isLoggedIn === false ?
                    <RiUserFill onClick={openLoginModal} /> :
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
