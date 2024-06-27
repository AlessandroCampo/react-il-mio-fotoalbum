import Card from "../components/Card"
import axiosInstance from '../axiosClient.js';
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar/Navbar.jsx";

export default function () {

    const [pictureList, setPictureList] = useState([]);

    const fetchPictures = async () => {
        try {
            const { data } = await axiosInstance.get('/pictures');
            setPictureList(data.pictures);
        } catch (err) {
            console.error(err);
        }
    }


    useEffect(() => {
        fetchPictures();
    }, []);


    return (
        <div className="home-container">

            <div className="cards-container mt-36 w-2/3 mx-auto flex gap-4 flex-wrap">
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