import { useAuthStore } from "@/stores/useAuthStore"
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router";
import { useLocation } from "react-router";


const ProtectedRoute = () => {
    const {accessToken, user, loading, refresh, fetchMe} = useAuthStore();
    const [starting, setStarting] = useState(true);
    const location = useLocation();

    const init = async () => {
        // có thể xảy ra khi rf trang
        if(!accessToken){
            await refresh();
        }

        if(accessToken && !user){
            await fetchMe();
        }
        setStarting(false);
    }

    useEffect(() => {
        init();
    }, [])

    if(starting || loading){
        return <div className="flex h-screen items-center justify-center">Đang tải trang...</div>
    }

    if(!accessToken){
        return(
            <Navigate
                to="signin"
                replace
            />
        )
    }

    if(location.pathname.startsWith("/admin") && user?.role !== "admin") {
        return(
            <Navigate 
                to="chat"
                replace
            />
        )
    }

    if(location.pathname.startsWith("/chat") && user?.role === "admin"){
        return(
            <Navigate 
                to="admin"
                replace
            />
        )
    }
  return (
    <Outlet>
    </Outlet>
  )
}

export default ProtectedRoute