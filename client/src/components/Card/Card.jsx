
import { MdOutlineDownloadForOffline as DownloadIcon } from "react-icons/md";
import { BiHeartCircle as HeartIcon } from "react-icons/bi";
import { useNavigate } from 'react-router';
import './CardStyles.css';


export default function ({ picture }) {
    const { image, slug } = picture;
    const navigate = useNavigate();

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
                    <HeartIcon />
                    <DownloadIcon />
                </div>
            </div>
        </figure>
    )
}