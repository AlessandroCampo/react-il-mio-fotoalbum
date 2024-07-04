import { useEffect, useState } from "react"
import axiosInstance from "../axiosClient.js"
import { useNavigate, useParams } from "react-router-dom";
import { Avatar } from "@mui/material";
import { IoBookmarkOutline as BookmarkIconOutline, IoBookmark as BookmarkIcon, IoHeart as HeartIcon, IoHeartOutline as HeartIconOutline, IoSave as DownloadIcon, IoSaveOutline as DownloadIconOutline, IoTrashBin as DeleteIcon, IoEye as VisibleIcon, IoEyeOff as HiddenIcon } from "react-icons/io5";
import { TbViewfinder as ViewIcon } from "react-icons/tb";
import { FaArrowLeft as ArrowLeftIcon } from "react-icons/fa";
import './viewsStyles/singleStyles.css';
import { handleDownload } from "../utils.js";
import { useGlobal } from "../contexts/globalContext.jsx";
import { useAuth } from "../contexts/authContext.jsx";

export default function () {

    const [picture, setPicture] = useState(undefined);
    const { slug } = useParams();
    const { likePicture, unlikePicture, viewPicture, setEditModalOpen, setToEditPicture, setDeleteModalOpen, setToDeletePicture, changeVisibility, notify } = useGlobal();
    const { user, authId } = useAuth();
    const navigate = useNavigate();
    let isUserPic = picture?.userId == authId;
    const isLiked = picture?.likes.find(l => l.userId === authId);
    const isViewed = picture?.views.find(v => v.userId === authId);

    const fetchSinglePicture = async () => {
        try {
            const { data: picture } = await axiosInstance.get(`/pictures/${slug}`)
            console.log(picture);

            setPicture(picture);
        } catch (err) {
            console.error(err);
        }
    }

    const hideOrShow = async (boolean) => {
        try {
            await changeVisibility(boolean, picture.slug)
            setPicture(oldPic => ({ ...oldPic, isVisibile: boolean }))
            notify(`Your picture has succesfully been ${boolean ? 'published' : 'hidden'}`);

        } catch (err) {
            console.error(err);
        }
    }

    const sendView = async () => {
        try {
            const view = await viewPicture(picture.slug, picture.id);
            setPicture(oldPic => ({
                ...oldPic,
                views: [...oldPic.views, view]
            }))

        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        if (!isViewed && picture) {
            sendView();
        }
    }, [picture]);



    useEffect(() => {
        fetchSinglePicture()

    }, [slug])

    const openEditModal = (e) => {
        e.stopPropagation();
        setToEditPicture(picture);
        setEditModalOpen(true);
    }

    // useEffect(() => {
    //     return () => { fetchSinglePicture() }

    // }, [picture?.likes])


    const sendLike = async () => {
        if (isLiked) {
            const likeId = picture.likes.find(l => l.userId === authId).id;
            console.log(likeId);
            const removedLike = await unlikePicture(slug, likeId);
            setPicture(pic => {
                return {
                    ...pic,
                    likes: pic.likes.filter(l => l.id !== removedLike.id)
                }
            })
            return
        }
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

    const openDeleteMode = () => {
        setToDeletePicture(picture)
        setDeleteModalOpen(true)
    }


    return (
        picture && <div className="single-page-container">
            <ArrowLeftIcon
                className="back-icon"
                onClick={() => { navigate(-1) }}
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
                        {
                            isUserPic ? <div className="picture-icons ">

                                <DownloadIcon
                                    onClick={() => { handleDownload(picture.image, picture.slug) }}
                                />

                                <DeleteIcon
                                    onClick={openDeleteMode}

                                />
                                {
                                    !picture.isVisibile ?
                                        <VisibleIcon
                                            onClick={() => { hideOrShow(false) }} /> :
                                        <HiddenIcon
                                            onClick={() => { hideOrShow(true) }}
                                        />
                                }

                            </div> : <div className="picture-icons ">

                                <DownloadIcon
                                    onClick={() => { handleDownload(picture.image, picture.slug) }}
                                />

                                <HeartIcon
                                    onClick={sendLike}
                                    className={`${isLiked ? 'text-theme' : ''}`}
                                />
                                <BookmarkIcon />
                            </div>
                        }

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
                            {
                                isUserPic ?
                                    <button
                                        className='button-theme'
                                        onClick={openEditModal}
                                    >
                                        Edit
                                    </button> :
                                    <button
                                        className="button-theme ms-auto"
                                    >
                                        Follow
                                    </button>
                            }
                        </div>
                    </div>
                    <div className="pic-text">

                        <h2 className="pic-title">
                            {picture.title}
                        </h2>
                        <p className="text-white">
                            {picture.description}
                        </p>
                    </div>
                    <div>
                        <div className="stats-container flex gap-4 items-center">
                            <div className="likes-counter flex items-center gap-1 text-theme">
                                <HeartIcon
                                    className="text-2xl no-hover-icon"
                                />
                                <div className="text-lg font-bold">
                                    {picture.likes.length}
                                </div>
                            </div>
                            <div className="likes-counter flex items-center gap-1 text-theme">
                                <DownloadIcon
                                    className="text-2xl no-hover-icon"
                                />
                                <div className="text-lg font-bold">
                                    {picture?.downloads?.length || 0}
                                </div>
                            </div>
                            <div className="likes-counter flex items-center gap-1 text-theme">
                                <ViewIcon
                                    className="text-2xl no-hover-icon"
                                />
                                <div className="text-lg font-bold">
                                    {picture?.views?.length || 0}
                                </div>
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