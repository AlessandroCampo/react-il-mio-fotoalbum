import { LuSmile as EmoteIcon } from "react-icons/lu";
import { FaRegPaperPlane as SendIcon } from "react-icons/fa";
import { useState } from "react";
import customAxiosInstance from "../../axiosClient";



export default function ({ recipientId, onSend }) {

    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        if (!message.trim()) return
        e.preventDefault();

        const reqData = {
            content: message,
            recipientId
        }


        try {
            const { data } = await customAxiosInstance.post('/messages', reqData);
            onSend(data.message, recipientId)
            setMessage('');
        } catch (err) {
            console.error(err);
        }

    }

    return (
        <form
            className="textbar-container flex items-center gap-2 text-gray-200 w-1/2 mx-auto border rounded-full py-3 px-6"
            onSubmit={handleSubmit}
        >
            <EmoteIcon
                className="text-2xl"
            />
            <input
                type="text"
                name="message"
                placeholder="Add your message"
                className="w-full"
                value={message}
                onChange={(e) => { setMessage(e.target.value) }}
            />
            {
                message
                &&
                <button
                    type="submit"
                >

                    <SendIcon
                        className="text-2xl"
                    />
                </button>
            }
        </form>
    )
}