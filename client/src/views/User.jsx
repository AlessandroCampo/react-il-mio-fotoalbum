import { useNavigate, useParams } from "react-router";
import { useGlobal } from "../contexts/globalContext";
import { useEffect, useState } from "react";
import { Avatar } from "@mui/material";
import Card from "../components/Card/Card";

export default function () {

    const { getUserInfo } = useGlobal();
    const [user, setUser] = useState(undefined);
    const [searchString, setSearchString] = useState('');
    const { username } = useParams();
    const navigate = useNavigate();

    const fetchUserData = async () => {
        const pageUser = await getUserInfo(username);

        if (!pageUser) {
            navigate('/');
        }
        setUser(pageUser);
    }

    useEffect(() => {
        fetchUserData();
    }, [username])



    return (
        user && <div className="user-page-container w-full h-full flex flex-col items-center overflow-y-scroll">
            <div className="profile-container w-1/3  mt-12 flex justify-start items-center flex-col gap-4">
                <figure className="relative">
                    <img
                        src="https://picsum.photos/450/300"
                        alt="cover_image"
                        className="rounded-3xl"
                    />
                    <Avatar
                        src={user.avatar || undefined}
                        alt={username}
                        sx={{ width: 80, height: 80, backgroundColor: '#e60023', right: '50%', position: 'absolute', transform: 'translate(50%, -50%)', fontSize: '2rem' }}
                        className="uppercase font-bold"
                    >
                        {username[0]}
                    </Avatar>

                </figure>
                <div className="user-text text-white font-semibold mt-8 text-center flex flex-col gap-3">
                    <h2 className="font-bold  text-2xl mt-3">
                        {user.username}
                    </h2>
                    <p>
                        {user.bio}
                    </p>
                    <div className="flex items-center gap-3 font-bold justify-center">
                        <div className="followers flex items-center gap-2">
                            <span>
                                {user.followedBy.length}
                            </span>
                            <span>
                                followers
                            </span>
                        </div>
                        <div className="followers flex items-center gap-2">
                            <span>
                                {user.following.length}
                            </span>
                            <span>
                                following
                            </span>
                        </div>
                    </div>
                </div>
                <div className="actions flex items-center gap-2">
                    <button className="button-theme">
                        Follow
                    </button>
                    <button
                        className="button-secondary"
                        onClick={() => { navigate(`/${username}/chat`, { state: { user } }); }}
                    >
                        Message
                    </button>
                </div>

            </div>
            <div className="w-full justify-center flex flex-col items-center mt-14 gap-6">
                <div
                    className="text-white border rounded-full px-2 py-1">
                    <input
                        type="search"
                        placeholder="filter by title"
                        className="ps-1"
                        value={searchString}
                        onChange={(e) => { setSearchString(e.target.value) }}

                    />
                </div>
                <div className="pictures-container  flex flex-wrap w-2/3 gap-4 justify-center">

                    {
                        user.pictures.map(pic => (
                            (!searchString || pic.title.includes(searchString)) && <Card
                                picture={pic}
                                key={`user-picture-${pic.id}`}
                            />
                        ))
                    }
                </div>
            </div>
        </div>

    )
}