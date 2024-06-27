import {
    createBrowserRouter,
    Navigate,
    RouterProvider,
} from "react-router-dom";
import { GlobalProvider } from "./contexts/globalContext";
import Home from "./views/Home";
import MainLayout from "./layouts/MainLayout";
import Single from "./views/Single";


const router = createBrowserRouter([
    {
        path: '/',
        element: (
            <GlobalProvider>
                <MainLayout>

                </MainLayout>
            </GlobalProvider>
        ),
        children: [
            {
                path: '/',
                element: <Home />
            },
            {
                path: '/pin/:slug',
                element: <Single />
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