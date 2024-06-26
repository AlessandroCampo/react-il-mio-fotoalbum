import {
    createBrowserRouter,
    Navigate,
    RouterProvider,
} from "react-router-dom";
import { GlobalProvider } from "./contexts/globalContext";


const router = createBrowserRouter([
    {
        path: '/',
        element:
            <GlobalProvider>
                <h2 className="text-white">Home</h2>
            </GlobalProvider>
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