import { createContext, useContext, useEffect, useState } from "react";
import axiosClient from "../axiosClient.js";
import { toast } from "react-toastify";
import { socket } from "../socket.js";
import { groupMessagesByConversations } from "../utils.js";
import { useAuth } from "./authContext.jsx";
import MessageToast from "../components/chat-components/AvatarToast.jsx";
import AvatarToast from "../components/chat-components/AvatarToast.jsx";
import { useNavigate } from "react-router";

const GlobalContext = createContext();
// Definiamo un custom Provider
function GlobalProvider({ children }) {
    // Aggiungiamo le varibili di stato che vogliamo condividere
    const [store, setStore] = useState({});
    const [toEditPicture, setToEditPicture] = useState(undefined);
    const [toDeletePicture, setToDeletePicture] = useState(undefined);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [categories, setCategories] = useState([]);
    const [isConnected, setIsConnected] = useState(socket.connected);
    const [conversations, setConversations] = useState([]);
    const [userPictures, setUserPictures] = useState([]);
    const navigate = useNavigate();

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

    const likePicture = async (slug, pictureId, authorId) => {
        const reqData = {
            pictureId,
            authorId
        }
        const { data } = await axiosClient.post(`/pictures/${slug}/like`, reqData);
        return data.like;
    };

    const unlikePicture = async (slug, likeId) => {
        const reqData = {
            likeId
        };
        const { data } = await axiosClient.delete(`/pictures/${slug}/like`, { data: reqData });
        return data;
    };

    const downloadPicture = async (slug, pictureId) => {
        const { data } = await axiosClient.post(`/pictures/${slug}/download`, { pictureId });
        return data;
    };

    const viewPicture = async (slug, pictureId) => {
        const { data } = await axiosClient.post(`/pictures/${slug}/view`, { pictureId });
        return data;
    };

    const savePicture = async (slug, pictureId) => await axiosClient.post(`/pictures/${slug}/save`, { pictureId });



    const deletePicture = async (slug) => {
        try {
            const { data } = await axiosClient.delete(`/pictures/${slug}`);
            const username = localStorage.getItem('museUsername')
            setToDeletePicture(undefined);
            setDeleteModalOpen(false);
            setUserPictures(oldPics => oldPics.filter(p => p.id !== toDeletePicture.id));
            navigate(`/${username}`);
            notify('Your picture has been succesfully deleted', 'success');

        }
        catch (err) {
            console.error(err);
            notify('There was an error deleting your picture', 'error')
        }

    };

    const getUserConversations = async () => {
        const { data } = await axiosClient.get(`/messages`);
        const username = localStorage.getItem('museUsername')
        setConversations(groupMessagesByConversations(data, username));
    }

    const changeVisibility = async (boolean, slug) => {
        const newValue = {
            isVisibile: boolean
        }
        const { data } = await axiosClient.patch(`/pictures/${slug}/change-visibility`, newValue);
        console.log(data);
    };


    const getCategories = async () => {
        const { data } = await axiosClient.get(`/categories`);
        setCategories(data.categories);
    }

    const getSingleCategory = async (name) => {
        const { data } = await axiosClient.get(`/categories/${name}`);
        return data;
    }

    useEffect(() => {
        getUserConversations();
        getCategories();
    }, [])



    useEffect(() => {
        function onConnect() {
            console.log('connected')
            setIsConnected(true);
        }

        function onDisconnect() {
            setIsConnected(false);
        }

        function onNewLike(like) {
            console.log('New like received:', like);
            toast(
                <AvatarToast
                    user={like.User}
                    content={'You picture received a like'}
                    label={'New Like'}
                    onClick={() => { navigate(`/${username}/chat`, { state: { user: message.sender } }); }}
                />)
        }

        function onNewMessage(message) {
            console.log('New message received:', message);
            const username = localStorage.getItem('museUsername')
            toast(
                <AvatarToast
                    user={message.sender}
                    content={message.content}
                    label={'New Message'}
                    onClick={() => { navigate(`/${username}/chat`, { state: { user: message.sender } }); }}
                />)

            setConversations(prevConversations => {
                const newConversations = prevConversations.map(conv => {
                    if (conv.user.id === message.senderId) {
                        return {
                            user: conv.user,
                            messages: [...conv.messages, message]
                        }
                    }
                    return conv
                })
                console.log(newConversations);
                return newConversations

            })
        }


        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);
        socket.on('newMessage', onNewMessage);
        socket.on('newLike', onNewLike)


        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
            socket.off('newMessage', onNewMessage);
            socket.off('newLike', onNewLike)
        };
    }, []);




    return (
        <GlobalContext.Provider
            value={{
                store,
                setStore,
                getUserInfo,
                categories,
                getSingleCategory,
                notify,
                conversations,
                setConversations,
                likePicture,
                unlikePicture,
                downloadPicture,
                viewPicture,
                savePicture,
                toEditPicture,
                setToEditPicture,
                editModalOpen,
                setEditModalOpen,
                deleteModalOpen,
                setDeleteModalOpen,
                toDeletePicture,
                setToDeletePicture,
                deletePicture,
                changeVisibility,
                userPictures,
                setUserPictures
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