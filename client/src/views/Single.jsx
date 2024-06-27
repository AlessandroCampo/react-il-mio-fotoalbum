import { useEffect, useState } from "react"
import axiosInstance from "../axiosClient.js"
import { useNavigate, useParams } from "react-router-dom";
import { Avatar } from "@mui/material";
import { IoBookmarkOutline as BookmarkIconOutline, IoBookmark as BookmarkIcon, IoHeart as HeartIcon, IoHeartOutline as HeartIconOutline, IoSave as DownloadIcon, IoSaveOutline as DownloadIconOutline } from "react-icons/io5";
import { FaArrowLeft as ArrowLeftIcon } from "react-icons/fa";
import './viewsStyles/SingleStyles.css';

export default function () {

    const [picture, setPicture] = useState(undefined);
    const { slug } = useParams();
    const navigate = useNavigate();

    const fetchSinglePicture = async () => {
        try {
            const { data: picture } = await axiosInstance.get(`/pictures/${slug}`)
            console.log(picture);
            setPicture(picture);
        } catch (err) {
            console.error(err);
        }
    }


    useEffect(() => {
        fetchSinglePicture()
    }, [slug])



    return (
        picture && <div className="single-page-container">
            <ArrowLeftIcon
                className="back-icon"
                onClick={() => { navigate('/') }}
            />
            <div className="card-big">
                <figure>
                    <img
                        src={picture.image}
                        alt={picture.slug}
                        onContextMenu={(e) => { e.preventDefault() }}
                    />
                </figure>
                <div className="card-big-right">
                    <div className="right-top">
                        <div className="picture-icons ">
                            <DownloadIcon />
                            <HeartIcon />
                            <BookmarkIcon />
                        </div>
                        <div
                            className="user-info"
                        >
                            <Avatar
                                src={picture.User.avatar}
                                alt={picture.User.username}
                                sx={{ width: 50, height: 50 }}
                            />
                            <div className="text-white flex flex-col">
                                <span className="font-bold">
                                    {picture.User.username}
                                </span>
                                <span>
                                    {picture.User.followedBy.length} followers
                                </span>
                            </div>
                            <button
                                className="button-theme ms-auto"
                            >
                                Follow
                            </button>
                        </div>
                    </div>
                    <p className="text-white">
                        {picture.description}
                    </p>
                    <div className="add-comment">
                        <input
                            type="text"
                            name="comment"
                            placeholder="Add a comment"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}