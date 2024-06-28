
import { MdOutlineDownloadForOffline as DownloadIcon } from "react-icons/md";
import { BiHeartCircle as HeartIcon } from "react-icons/bi";
import { useNavigate } from 'react-router';
import './CardStyles.css';
import { handleDownload } from "../../utils";
import { useGlobal } from "../../contexts/globalContext";


export default function ({ picture }) {
    const { image, slug, id } = picture;
    const navigate = useNavigate();
    const { likePicture } = useGlobal();

    const downloadImage = (e) => {
        e.stopPropagation();
        handleDownload(picture.image, picture.slug)
    }

    const sendLike = async (e) => {
        e.stopPropagation();
        try {
            const like = await likePicture(slug, id, picture.User.id);
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <figure
            className="card-wrapper group"
            onClick={() => { navigate(`/pin/${slug}`) }}
            onContextMenu={(e) => { e.preventDefault() }}
        >
            <img
                src={image}
                alt={slug}
            />
            <div className="overlay">
                <button className='button-theme'>
                    Save
                </button>
                <div className="overlay-icons ">
                    <HeartIcon
                        onClick={sendLike}
                    />
                    <DownloadIcon
                        onClick={downloadImage}
                    />
                </div>
            </div>
        </figure>
    )
}