import { createContext, useContext, useEffect, useState } from "react";
import axiosClient from "../axiosClient.js";
import { toast } from "react-toastify";


const GlobalContext = createContext();
// Definiamo un custom Provider
function GlobalProvider({ children }) {
    // Aggiungiamo le varibili di stato che vogliamo condividere
    const [store, setStore] = useState({});
    const [categories, setCategories] = useState([]);

    const notify = (message, type) => {
        switch (type) {
            case type == 'success':
                toast.success(message)
                break
            case type == 'error':
                toast.error(message)
                break
            default:
                toast.success(message)

        }
    }

    const getUserInfo = async (username) => {
        const { data } = await axiosClient.get(`/users/${username}`);
        return data.user;
    }

    const getCategories = async () => {
        const { data } = await axiosClient.get(`/categories`);
        setCategories(data.categories);
    }

    useEffect(() => {
        getCategories();
    }, [])




    return (
        <GlobalContext.Provider
            value={{
                store,
                setStore,
                getUserInfo,
                categories,
                notify
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
}
// Definiamo un hook per consumare il contesto
function useGlobal() {
    const context = useContext(GlobalContext);
    return context;
}
export { GlobalProvider, useGlobal }