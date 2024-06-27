import { createContext, useContext, useEffect, useState } from "react";
import customAxiosInstance from "../axiosClient";
import { useGlobal } from "./globalContext";


const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(undefined);
    const isLoggedIn = Boolean(user);
    const { getUserInfo } = useGlobal();

    const fetchLoggedUserData = async (username) => {
        try {
            const userData = await getUserInfo(username);
            console.log(userData);
            setUser(userData);
        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        const authToken = localStorage.getItem('museAuthToken');
        const museUsername = localStorage.getItem('museUsername');

        if (authToken && museUsername) {
            fetchLoggedUserData(museUsername);
        }
    }, [])


    const login = async (payload) => {

        const { data } = await customAxiosInstance.post('/users/login', payload);
        localStorage.setItem('museAuthToken', data.token);
        localStorage.setItem('museUsername', data.user.username);
        setUser(data.user);

    }

    const logout = async () => {
        localStorage.removeItem('museAuthToken');
        localStorage.removeItem('museUsername');
        setUser(undefined);
    }

    return (
        <AuthContext.Provider
            value={
                {
                    user,
                    isLoggedIn,
                    login,
                    logout
                }
            }
        >

            {children}

        </AuthContext.Provider>
    )

}


const useAuth = function () {
    return useContext(AuthContext);
}

export { AuthProvider, useAuth };