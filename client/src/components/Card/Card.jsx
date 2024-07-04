
import { MdOutlineDownloadForOffline as DownloadIcon } from "react-icons/md";
import { BiHeartCircle as HeartIcon } from "react-icons/bi";
import { useNavigate } from 'react-router';
import './CardStyles.css';
import { handleDownload } from "../../utils";
import { useGlobal } from "../../contexts/globalContext";
import { useAuth } from "../../contexts/authContext";
import { IoTrashBin as DeleteIcon, IoEye as VisibleIcon, IoEyeOff as HiddenIcon } from "react-icons/io5";
import { useEffect, useState } from "react";
import { Skeleton } from "@mui/material";


export default function ({ picture }) {

    const navigate = useNavigate();
    const { likePicture, unlikePicture, savePicture, setEditModalOpen, setToEditPicture, setToDeletePicture, setDeleteModalOpen, changeVisibility, notify, downloadPicture } = useGlobal();
    const [pictureState, setPictureState] = useState(picture);
    const { image, slug, id, userId, isVisibile } = pictureState;
    const { authId } = useAuth();
    const isUserPic = authId === userId;

    const [isVisible, setIsVisible] = useState(pictureState.isVisibile);
    const [imgLoaded, setImgLoaded] = useState(false);
    const isLiked = pictureState?.likes.find(l => l.userId === authId);

    useEffect(() => {

    }, [isVisibile, isLiked])


    const downloadImage = async (e) => {
        e.stopPropagation();
        handleDownload(picture.image, picture.slug);
        try {
            await downloadPicture(picture.slug, picture.id);
        } catch (err) {
            console.error(err);
        }

    }

    const sendLike = async (e) => {
        e.stopPropagation();
        if (isLiked) {
            try {
                const likeId = picture.likes.find(l => l.userId === authId).id;
                const removedLike = await unlikePicture(picture.slug, likeId);
            } catch (err) {
                console.error(err);
            }
            return
        }
        try {
            const like = await likePicture(slug, id, picture.User.id);
            if (like) {
                setPictureState(oldPic => ({
                    ...oldPic,
                    likes: [...oldPic.likes, like]
                }))
            }
        } catch (err) {
            console.error(err);
        }
    }



    const openEditModal = (e) => {
        e.stopPropagation();
        setToEditPicture(picture);
        setEditModalOpen(true);
    }

    const openDeleteMode = (e) => {
        e.stopPropagation();
        setToDeletePicture(picture)
        setDeleteModalOpen(true)
    }

    const save = async (e) => {
        e.stopPropagation();
        try {
            const bookmark = await savePicture(picture.slug, picture.id);
            console.log(bookmark);
        } catch (err) {
            console.error(err);
        }
    }


    const hideOrShow = async (e) => {
        e.stopPropagation();
        try {
            await changeVisibility(!picture.isVisibile, picture.slug)
            notify(`Your picture has succesfully been ${picture.isVisibile ? 'published' : 'hidden'}`);
            setIsVisible(oldVal => !oldVal)

        } catch (err) {
            console.error(err);
        }
    }


    return (
        <>
            {!imgLoaded && (
                <Skeleton
                    variant="rounded"
                    width={236}
                    height={420}
                    animation="pulse"
                    sx={{
                        bgcolor: 'grey.600',
                        borderRadius: '1.5rem',
                    }}
                />
            )}
            <figure
                className={`card-wrapper group ${!imgLoaded ? 'hidden' : ''}`}
                onClick={() => { navigate(`/pin/${slug}`); }}
                onContextMenu={(e) => { e.preventDefault(); }}
            >
                <img
                    src={image}
                    alt={slug}
                    onLoad={() => setImgLoaded(true)}
                    className={imgLoaded ? 'block' : 'hidden'}
                />
                {imgLoaded && (
                    <div className="overlay">
                        {isUserPic ? (
                            <button
                                className="button-theme"
                                onClick={openEditModal}
                            >
                                Edit
                            </button>
                        ) : (
                            <button
                                className="button-theme"
                                onClick={save}
                            >
                                Save
                            </button>
                        )}

                        <div className="overlay-icons">
                            {!isUserPic ? (
                                <>
                                    <HeartIcon onClick={sendLike} className={`${isLiked ? 'text-theme' : ''}`} />
                                    <DownloadIcon onClick={downloadImage} />
                                </>
                            ) : (
                                <>
                                    <DeleteIcon onClick={openDeleteMode} />
                                    {isVisible ? (
                                        <HiddenIcon onClick={hideOrShow} />
                                    ) : (
                                        <VisibleIcon onClick={hideOrShow} />
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                )}
            </figure>
        </>
    );
}