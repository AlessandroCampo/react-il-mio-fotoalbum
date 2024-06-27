import placeholder from '../assets/img/placeholder.jpeg'
import { MdOutlineDownloadForOffline as DownloadIcon } from "react-icons/md";
import { BiHeartCircle as HeartIcon } from "react-icons/bi";
import { useNavigate } from 'react-router';


export default function ({ picture }) {
    const { image, slug } = picture;
    const navigate = useNavigate();




    return (
        <figure
            className="card-wrapper h-[420px] w-[236px] relative group cursor-pointer"
            onClick={() => { navigate(`/pin/${slug}`) }}
            onContextMenu={(e) => { e.preventDefault() }}
        >
            <img
                src={image}
                alt="alt"
                className='rounded-3xl h-full w-full object-cover'
            />
            <div className="h-full w-full bg-black bg-opacity-50 absolute z-10 top-0 left-0 hidden flex-col justify-between items-end p-4 group-hover:flex">
                <button className='bg-[#FFCC70] px-4 py-1 rounded-full font-bold'>
                    Save
                </button>
                <div className="overlay-icons text-white text-3xl flex gap-2">
                    <HeartIcon />
                    <DownloadIcon />
                </div>
            </div>
        </figure>
    )
}