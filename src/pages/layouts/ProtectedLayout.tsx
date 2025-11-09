import { useEffect } from "react";
import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
// import Header from "../../components/Header";
// import Footer from "../../components/footer";
import { Bounce, ToastContainer } from "react-toastify";
import { checkIfAuthenticated } from "../../store/slice/authSlice";
import { AppDispatch, RootState } from "../../store"
import Loading from "../../components/loading";
import Header from "../../components/Header";
import { Bell, ClipboardList, Home, PencilLine, Settings, ShieldCheck, UserCog, Wallet } from "lucide-react";
import Sidebar from "../../components/sideBar";
const navItems = [
    {
        title: 'General',
        list: [
            { label: 'Dashboard', to: '/', icon: <Home size={26} /> },
            { label: "Hotels", to: "/hotels", icon: <Home size={26} /> },
            { label: 'Bookings', to: '/bookings', icon: <PencilLine size={26} /> },
            { label: 'Properties', to: '/properties', icon: <ClipboardList size={26} /> },
            { label: 'Savings', to: '/savings', icon: <Wallet size={26} /> },
            { label: 'Investment', to: '/investments', icon: <Settings size={26} /> },
        ],
    },
    {
        title: 'Preferences',
        list: [
            { label: 'Account Settings', to: 'profile', icon: <UserCog size={26} /> },
            // { label: 'Account Settings', to: 'account-settings', icon: <UserCog size={26} /> },
            { label: 'Notifications', to: 'notifications', icon: <Bell size={26} /> },
            { label: 'Security', to: 'security', icon: <ShieldCheck size={26} /> },
        ],
    },
];

export function ProtectedScreen() {
    const dispatch = useDispatch<AppDispatch>()

    const navigate = useNavigate();

    const { isAuthenticated, isLoading } = useSelector((state: RootState) => state.auth);
    const mainRef = useRef<HTMLDivElement>(null);



    useEffect(() => {
        const verifyAuth = async () => {
            await dispatch(checkIfAuthenticated()).unwrap(); // ✅ fixes type issue
        }
        verifyAuth();
        return () => { }
    }, [dispatch]);


    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            const redirectTo = encodeURIComponent(location.pathname + location.search);

            navigate(`/auth/login?redirect=${redirectTo}`, { replace: true });
        }
    }, [isLoading, isAuthenticated, navigate]);



    useEffect(() => {
        // Automatically focus the scrollable main container after load
        if (mainRef.current) {
            mainRef.current.focus();
        }
    }, []);



    // Show loader while checking or redirecting
    if (isLoading) return <Loading />

    if (!isAuthenticated) { return null }





    return (
        <div className=" flex overflow-hidden">
            {/* Sidebar */}
            <aside className=" bg- h-screen ">
                <div className="header  bg-[#3a0a0a] py-2 flex justify-center">
                    <img src="logo/logo.png" alt="" className="mr-10" srcSet="logo/logo.png 1x, logo/logo@2x.png 2x" />

                </div>
                <Sidebar navlist={navItems}  />
            </aside>

            {/* Main Area */}
            <div className="flex flex-col flex-1">
                <Header />

                <main
                    ref={mainRef}
                    tabIndex={-1}  // <-- Required to make focus() work
                    className="flex-1 overflow-y-auto focus:outline-none bg-gray-50 p-6"
                >
                    <Outlet />
                </main>
            </div>

            <ToastContainer
                position="top-right"
                autoClose={3000}
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
        </div>
    );
}


