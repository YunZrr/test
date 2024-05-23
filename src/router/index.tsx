import { createBrowserRouter } from "react-router-dom";
import GetCoin from "@/pages/GetCoin";
import Login from "@/pages/Login"
import UpdateEligible from "@/pages/UpdateEligible";

const router = createBrowserRouter([
    {
        path: '/',
        element: <Login />
    },
    {
        path: '/airdrop',
        element: <UpdateEligible />
    },
    {
        path: '/getter',
        element: <GetCoin />
    },
])

export default router