import { Avatar } from "@mui/material";
import { formatTimestamp } from "../../utils";



export default function ({ lastMessage, inter, onClick }) {

    return (
        <div
            className="chat-list-element-container flex items-center gap-3 text-white border-b py-4 cursor-pointer"
            onClick={onClick}
        >
            <Avatar
                src={inter.avatar}
                alt={inter.username}
                sx={{ width: 50, height: 50, backgroundColor: '#e60023' }}
                className="uppercase font-bold"
            >

            </Avatar>
            <div className="message-info flex flex-col items-start gap-1">
                <div className="font-semibold">
                    {inter.username}
                </div>
                <div className="flex items-center gap-4">
                    <span>
                        {lastMessage?.content || ''}
                    </span>
                    <span>
                        {lastMessage?.createdAt ? formatTimestamp(lastMessage?.createdAt) : ''}
                    </span>
                </div>
            </div>
        </div>
    )
}