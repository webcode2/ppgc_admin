import { useEffect } from "react";
import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
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
    const location = useLocation();

    const { isAuthenticated, isLoading, isBootstrapped } = useSelector((state: RootState) => state.auth);
    const mainContentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Scroll to top and set focus on route change
        if (mainContentRef.current) {
            mainContentRef.current.scrollTo(0, 0);
            mainContentRef.current.focus();
        }
    }, [location.pathname]);

    useEffect(() => {
        const verifyAuth = async () => {
            await dispatch(checkIfAuthenticated()).unwrap(); // ✅ fixes type issue
        }
        verifyAuth();
        return () => { }
    }, [dispatch]);

    // ⏳ WAIT until we know the auth state
    if (!isBootstrapped) {
        return <Loading />;  // spinner
    }

    if (!isAuthenticated) {
        const redirectTo = encodeURIComponent(
            location.pathname + location.search
        );

        return (
            <Navigate to={`/auth/login?redirect=${redirectTo}`} replace />
        );
    }




    // Show loader while checking or redirecting
    if (isLoading) return <Loading />

    if (!isAuthenticated) { return null }





    return (
        <div className=" h-screen flex overflow-hidden">
            {/* Sidebar */}

                <Sidebar navlist={navItems}  />


            {/* Main Area */}
            <div ref={mainContentRef}
                tabIndex={-1}
                id="main-content" // <-- Required to make focus() work
                className="flex flex-col flex-1 overflow-y-auto focus:outline-none">
                <Header />

                <main
                    className="flex-1  focus:outline-none bg-gray-50 p-6"
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
