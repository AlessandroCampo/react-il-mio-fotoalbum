import { useNavigate } from "react-router";
import { useGlobal } from "../contexts/globalContext";
import CategoryCard from "../components/CategoryCard";

export default function () {
    const { categories } = useGlobal();
    const navigate = useNavigate();
    return (
        <div className="explore-container overflow-y-auto h-full">
            <h2 className="text-4xl text-center my-12 uppercase font-bold text-white">
                Explore
            </h2>
            <div className="categories-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-2/3 mx-auto ">
                {categories && categories.map(c => (
                    <CategoryCard
                        key={`category-card-${c.id}`}
                        category={c}
                    />
                ))}
            </div>

        </div>
    )
}