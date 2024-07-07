import { Avatar } from "@mui/material";
import { useNavigate } from "react-router";
import { IoHeartOutline as HeartIcon, IoTrashBinOutline as DeleteIcon } from "react-icons/io5";
import { useAuth } from "../contexts/authContext";
import customAxiosInstance from "../axiosClient";

export default function ({ user, comment, onDelete }) {

    const navigate = useNavigate();
    const { authId } = useAuth();
    const isUserComment = user.id === authId;

    const deleteComment = async () => {
        try {
            const { data } = await customAxiosInstance.delete(`/pictures/comment`, { data: { commentId: comment.id } });
            console.log(data);
            onDelete(data.id);
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div className="comment flex justify-between py-2 px-4 items-center text-white">
            <div className="comment-left flex items-center gap-3 w-3/4">
                <Avatar
                    onClick={() => { navigate(`/${user.username}`) }}
                    alt={user.username}
                    src={user.avatar}
                    sx={{ bgcolor: '#FFCC70', width: 30, height: 30 }}
                    className="cursor-pointer hover:scale-110"
                />
                <p className="text-ellipsis max-w-[75%] overflow-hidden whitespace-nowrap">
                    {comment.content}
                </p>
            </div>
            {
                isUserComment ?
                    <DeleteIcon
                        onClick={deleteComment}
                    />
                    : <HeartIcon
                        className="text-lg"
                    />
            }
        </div>
    )
}