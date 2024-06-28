import React from 'react';
import Avatar from '@mui/material/Avatar';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default ({ user, label, content, onClick }) => (
    <div
        className="flex items-center p-3 bg-white rounded shadow-lg max-w-[350px] cursor-pointer"
        onClick={onClick}
    >
        <Avatar
            src={user.avatar}
            alt={user.username}
            sx={{ width: 50, height: 50, backgroundColor: '#e60023' }}
            className="uppercase font-bold"
        />
        <div className="ml-4 flex flex-col max-w-full">
            <span className="text-gray-600 font-semibold">{label} from {user.username}</span>
            <div className="mt-1 text-gray-800 max-w-full overflow-hidden text-ellipsis whitespace-nowrap">
                {content}
            </div>
        </div>
    </div>
);