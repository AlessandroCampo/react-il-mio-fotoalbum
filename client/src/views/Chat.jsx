import { useEffect, useState } from "react";
import ChatInput from "../components/chat-components/ChatInput";
import { useGlobal } from "../contexts/globalContext";
import ChatListElement from "../components/chat-components/ChatListElement";
import { useAuth } from "../contexts/authContext";
import { Avatar } from "@mui/material";
import './viewsStyles/chatStyles.css';
import { useLocation } from "react-router";

export default function () {


    const { conversations, setConversations } = useGlobal();
    const [activeConversation, setActiveConversation] = useState(conversations[0]);
    const { user } = useAuth();
    const location = useLocation();



    const addNewMessage = (newMessage, interId) => {
        console.log(interId)
        setConversations(oldConversations => {

            const newConversations = oldConversations.map(c => {
                if (c.user.id !== parseInt(interId)) return c;
                return {
                    ...c,
                    messages: [...c.messages, newMessage]
                };
            })
            setActiveConversation(newConversations.find(conv => conv.user.id === interId))
            return newConversations
        })
    };

    const getConversationFromState = () => {
        const user = location.state.user;
        const existingConversation = conversations.find(conv => (conv.user.id == user.id));
        console.log(existingConversation)
        if (existingConversation) {
            return existingConversation
        }
        return {
            user,
            messages: []
        }
    }

    useEffect(() => {

        if (location?.state?.user) {
            console.log('location user not und')
            setActiveConversation(getConversationFromState())
        } else {

            setActiveConversation(conversations[0])
        }
    }, [conversations])




    return (
        <div className="chat-page-container flex mt-8 h-full">
            <div className="conversations-list w-1/4 px-14">
                {
                    conversations.length > 0 && conversations.map(({ messages, user }) => (
                        <ChatListElement
                            lastMessage={messages[messages.length - 1]}
                            inter={user}
                            key={`conv-${user.username}`}
                            onClick={() => { setActiveConversation({ messages, user }) }}
                        />
                    ))

                }
            </div>
            {
                activeConversation &&
                <div className="active-chat w-3/4 border p-8 flex h-4/5 justify-between flex-col items-center">
                    <div className="active-chat-topbar flex items-center gap-3">
                        <Avatar
                            src={activeConversation.user.avatar}
                            alt={activeConversation.user.username}
                            sx={{ width: 50, height: 50, backgroundColor: '#e60023' }}
                            className="uppercase font-bold"
                        >
                        </Avatar>
                        <div className="font-bold text-xl text-white">
                            {activeConversation.user.username}
                        </div>
                    </div>

                    <div className="chat-box flex flex-col gap-4 w-[750px] max-h-full overflow-y-scroll py-6 px-4 my-6">
                        {activeConversation.messages.map(m => {
                            const sentByUser = m.senderId === user.id;
                            return (
                                <div
                                    key={`mes-${m.id}`}
                                    className={`${sentByUser ? 'sent' : 'received'} message`}
                                >
                                    {m.content}
                                </div>
                            );
                        })}
                    </div>



                    <ChatInput
                        recipientId={activeConversation.user.id}
                        className="w-[500px] mx-auto"
                        onSend={addNewMessage}
                    />

                </div>
            }
        </div >
    )
}