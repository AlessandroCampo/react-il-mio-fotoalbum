import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router"
import CategoryCard from "../components/CategoryCard";
import { useGlobal } from "../contexts/globalContext";
import Card from "../components/Card/Card";

export default function () {

    const { name } = useParams();
    const navigate = useNavigate();
    const [category, setCategory] = useState(undefined);
    const { getSingleCategory } = useGlobal();

    const fetchSingleCategory = async () => {
        try {
            const foundCategory = await getSingleCategory(name);
            console.log(foundCategory);
            setCategory(foundCategory);
        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        fetchSingleCategory();
    }, [name]);

    return (
        category && <div className="single-category-container flex gap-6 flex-col h-full overflow-y-auto">
            <div className="w-1/2 mx-auto mt-6">
                <CategoryCard
                    category={category}
                />
            </div>
            <div className="pic-container flex gap-4 w-3/4 mx-auto flex-wrap mt-6  justify-center">
                {category.pictures.length > 0 && category.pictures.map(p => (
                    <Card
                        picture={p}
                        key={`category-card-${p.id}`}
                    />
                ))}
            </div>

        </div>
    )
}