import { useNavigate } from "react-router";

export default function ({ category }) {
    const { name, thumbnail } = category;
    const navigate = useNavigate();
    return <div
        className="bg-cover bg-center w-full h-[300px] rounded-3xl cursor-pointer"
        style={{ backgroundImage: `url(${thumbnail})` }}
        onClick={() => { navigate(`/explore/${name}`) }}
    >
        <div className=" bg-black bg-opacity-45 h-full w-full rounded-3xl flex flex-col justify-end pb-12">
            <h2 className="text-white font-bold text-2xl text-center">
                {name}
            </h2>

        </div>
    </div>
}