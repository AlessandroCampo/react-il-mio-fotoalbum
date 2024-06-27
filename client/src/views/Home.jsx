import Card from "../components/Card/Card.jsx"
import axiosInstance from '../axiosClient.js';
import { useEffect, useRef, useState } from "react";
import './viewsStyles/generalViewsStyles.css'


export default function () {

    const [pictureList, setPictureList] = useState([]);
    const [lastPage, setLastPage] = useState(1);
    const [totalPages, setTotalPages] = useState(2);
    const cardsContainer = useRef(null);

    const fetchPictures = async (page = 1) => {
        try {
            const { data } = await axiosInstance.get(`pictures?page=${page}`)
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
    }, []);

    useEffect(() => {
        const handleScroll = async () => {
            if (cardsContainer.current) {
                const scrollTop = document.documentElement.scrollTop;
                const windowHeight = window.innerHeight;
                const containerHeight = cardsContainer.current.offsetHeight;
                const containerTop = cardsContainer.current.offsetTop;
                const bottomOfViewport = scrollTop + windowHeight;
                const triggerPoint = containerTop + containerHeight * 0.9;

                if (bottomOfViewport >= triggerPoint) {
                    setLastPage(prevPage => {
                        const nextPage = prevPage + 1;
                        fetchPictures(nextPage);
                        return nextPage;
                    })
                    return
                }
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [pictureList]);


    return (
        <div className="home-container">

            <div className="cards-container"
                ref={cardsContainer}
            >
                {
                    pictureList.map(pic => (
                        <Card
                            picture={pic}
                            key={`card-${pic.id}`}
                        />
                    ))
                }
            </div>
        </div>

    )
}