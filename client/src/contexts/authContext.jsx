import { createContext, useContext, useEffect, useState } from "react";
import customAxiosInstance from "../axiosClient";
import { useGlobal } from "./globalContext";
import { socket } from "../socket";


const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(undefined);
    const [loadingAuth, setLoadingAuth] = useState(true);
    const isLoggedIn = Boolean(user);
    const { getUserInfo } = useGlobal();
    const authId = user?.id || undefined;

    const fetchLoggedUserData = async (username) => {
        try {
            const userData = await getUserInfo(username);

            setUser(userData);
            setLoadingAuth(false);
            socket.emit('authenticated', userData.id);
        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        const authToken = localStorage.getItem('museAuthToken');
        const museUsername = localStorage.getItem('museUsername');

        if (authToken && museUsername) {
            fetchLoggedUserData(museUsername);
            return
        }

        setLoadingAuth(false);
    }, [])


    const login = async (payload) => {

        const { data } = await customAxiosInstance.post('/users/login', payload);
        localStorage.setItem('museAuthToken', data.token);
        localStorage.setItem('museUsername', data.user.username);
        setUser(data.user);

    }

    const register = async (payload) => {

        const { data } = await customAxiosInstance.post('/users/signup', payload);
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
                    authId,
                    login,
                    logout,
                    loadingAuth,
                    register

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