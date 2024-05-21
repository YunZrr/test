import Login from "@/pages/Login";
import GetCoin from "@/pages/GetCoin";
import { createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
    {
        path: '/',
        element: <Login />
    },
    {
        path: '/get-coin',
        element: <GetCoin />
    }
])

export default router