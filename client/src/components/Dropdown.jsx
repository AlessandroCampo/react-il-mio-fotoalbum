import * as React from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';

import Tooltip from '@mui/material/Tooltip';


export default function Dropdown({ button, options = [] }) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    return (
        <React.Fragment>
            <Tooltip title="Account settings">
                <IconButton
                    onClick={handleClick}
                    size="small"
                    aria-controls={open ? 'account-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                >
                    {button}
                </IconButton>
            </Tooltip>

            <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}

                transformOrigin={{ horizontal: 'left', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
            >
                {options.map((opt, ind) => (
                    <MenuItem
                        onClick={opt.cb}
                        key={`user-option-${ind}`}

                    >
                        <div className="flex text-gray-600 items-center gap-2  hover:text-gray-900 hover:scale-105">
                            <span className='text-lg'>
                                {opt.icon}
                            </span>
                            <span>
                                {opt.label}
                            </span>

                        </div>


                    </MenuItem>
                ))}
            </Menu>
        </React.Fragment>
    );
}
