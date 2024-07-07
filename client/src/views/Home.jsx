import Card from "../components/Card/Card.jsx"
import axiosInstance from '../axiosClient.js';
import { useEffect, useRef, useState } from "react";
import './viewsStyles/generalViewsStyles.css'
import { useAuth } from "../contexts/authContext.jsx";


export default function () {

    const [pictureList, setPictureList] = useState([]);
    const [lastPage, setLastPage] = useState(1);
    const [totalPages, setTotalPages] = useState(2);
    const { isLoggedIn, loadingAuth } = useAuth();
    const cardsContainer = useRef(null);

    const fetchPictures = async (page = 1) => {
        if (loadingAuth) return
        try {
            const { data } = isLoggedIn ? await axiosInstance.get(`pictures/get-feed?page=${page}`) : await axiosInstance.get(`pictures?page=${page}`);
            setTotalPages(data.totalPages);

            setPictureList(oldList => {
                const oldPictureIds = new Set(oldList.map(picture => picture.id));
                const newUniquePictures = data.pictures.filter(picture => !oldPictureIds.has(picture.id));
                return [...oldList, ...newUniquePictures];
            });
        } catch (err) {
            console.error(err);
        }
    }


    useEffect(() => {
        fetchPictures();
    }, [isLoggedIn, loadingAuth]);
    useEffect(() => {
        const handleScroll = async () => {
            if (cardsContainer.current) {
                const { scrollTop, scrollHeight, clientHeight } = cardsContainer.current;

                const bottomOfViewport = scrollTop + clientHeight;
                const triggerPoint = scrollHeight * 0.9;

                if (bottomOfViewport >= triggerPoint) {
                    setLastPage(prevPage => {
                        const nextPage = prevPage + 1;
                        if (nextPage > totalPages) {
                            return lastPage;
                        }
                        fetchPictures(nextPage);
                        return nextPage;
                    });
                }
            }
        };

        const container = cardsContainer.current;
        container.addEventListener('scroll', handleScroll);

        return () => {
            container.removeEventListener('scroll', handleScroll);
        };
    }, [pictureList, totalPages, lastPage]);


    return (
        <div className="home-container"

            ref={cardsContainer}
        >

            <div className="cards-container"
            >
                {
                    pictureList.map(pic => (
                        pic.isVisibile && <Card
                            picture={pic}
                            key={`card-${pic.id}`}
                        />
                    ))
                }
            </div>
        </div>

    )
}