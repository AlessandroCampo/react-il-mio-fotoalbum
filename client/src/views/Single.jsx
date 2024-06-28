import { useEffect, useState } from "react"
import axiosInstance from "../axiosClient.js"
import { useNavigate, useParams } from "react-router-dom";
import { Avatar } from "@mui/material";
import { IoBookmarkOutline as BookmarkIconOutline, IoBookmark as BookmarkIcon, IoHeart as HeartIcon, IoHeartOutline as HeartIconOutline, IoSave as DownloadIcon, IoSaveOutline as DownloadIconOutline } from "react-icons/io5";
import { FaArrowLeft as ArrowLeftIcon } from "react-icons/fa";
import './viewsStyles/singleStyles.css';
import { handleDownload } from "../utils.js";
import { useGlobal } from "../contexts/globalContext.jsx";
import { useAuth } from "../contexts/authContext.jsx";

export default function () {

    const [picture, setPicture] = useState(undefined);
    const { slug } = useParams();
    const { likePicture } = useGlobal();
    const { user } = useAuth();
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

    // useEffect(() => {
    //     return () => { fetchSinglePicture() }

    // }, [picture?.likes])


    const sendLike = async () => {
        try {
            const like = await likePicture(slug, picture.id, picture.User.id);
            setPicture(pic => {
                return {
                    ...pic,
                    likes: [...pic.likes, like]
                }
            })
        } catch (err) {
            console.error(err);
        }
    }


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
                            <DownloadIcon
                                onClick={() => { handleDownload(picture.image, picture.slug) }}
                            />
                            <HeartIcon
                                onClick={sendLike}
                                className={`${picture.likes.find(l => l.userId === user?.id) ? 'text-theme' : ''}`}
                            />
                            <BookmarkIcon />
                        </div>
                        <div
                            className="user-info"
                        >
                            <Avatar
                                src={picture.User.avatar}
                                alt={picture.User.username}
                                sx={{ width: 50, height: 50 }}
                                onClick={() => { navigate(`/${picture.User.username}`) }}
                                className="cursor-pointer"
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
                    <div>
                        <div className="likes-counter flex items-center gap-2 text-theme">
                            <HeartIcon
                                className="text-2xl no-hover-icon"
                            />
                            <div className="text-lg font-bold">
                                {picture.likes.length}
                            </div>
                        </div>

                        <div className="add-comment mt-4">
                            <input
                                type="text"
                                name="comment"
                                placeholder="Add a comment"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}