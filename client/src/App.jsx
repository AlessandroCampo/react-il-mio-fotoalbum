import {
    createBrowserRouter,
    Navigate,
    RouterProvider,
} from "react-router-dom";
import { GlobalProvider } from "./contexts/globalContext";
import Home from "./views/Home";
import MainLayout from "./layouts/MainLayout";
import Single from "./views/Single";
import { AuthProvider } from "./contexts/authContext";
import User from "./views/User";
import Chat from "./views/Chat";
import Explore from "./views/Explore";
import Category from "./views/Category";




const router = createBrowserRouter([
    {
        path: '/',
        element: (
            <GlobalProvider>
                <AuthProvider>
                    <MainLayout>
                    </MainLayout>
                </AuthProvider>
            </GlobalProvider>
        ),
        children: [
            {
                path: '/',
                element: <Home />
            },
            {
                path: '/explore',
                element: <Explore />
            },
            {
                path: '/:username',
                element: <User />
            },
            {
                path: '/:username/chat',
                element: <Chat />
            },
            {
                path: '/pin/:slug',
                element: <Single />
            },
            {
                path: '/explore/:name',
                element: <Category />
            },
        ]
    },
    {
        path: '/login',
        element:
            <GlobalProvider>
                <h2 className="text-white">Login</h2>
            </GlobalProvider>
    }
])



const app = function () {

    return (
        <RouterProvider
            router={router}
        />
    )
}

export default app;