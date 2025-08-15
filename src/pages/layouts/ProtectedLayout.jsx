import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
// import Header from "../../components/Header";
// import Footer from "../../components/footer";
import { Bounce, ToastContainer } from "react-toastify";
import { checkIfAuthenticated } from "../../store/slice/authSlice";


export function ProtctedScreens() {

    const navigate = useNavigate();

    const { darkMode } = useSelector(state => state.theme)
    const { isAuthenticated, isLoading } = useSelector((state) => state.auth);

    useEffect(() => {
        checkIfAuthenticated()
        if (!isAuthenticated) {
            navigate('/auth/login');

        }
    }, [isAuthenticated, isLoading, navigate])




    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        console.log(document.documentElement);

    }, [darkMode]);







    if (isLoading) return <>Loading...</>
    if (!isAuthenticated) { return null }


    return (<div className="relative">
        <Outlet />
        < ToastContainer position="top-right" autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick={false}
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            transition={Bounce}
        />

    </div>)
}