import "./App.css";
import Signup from "./pages/signup/Signup";
import Login from "./pages/login/Login";
import Home from "./pages/home/Home";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import { Routes, Route } from "react-router-dom";
import RequireUser from "./components/RequireUser";
import Profile from "./components/profile/Profile";
import Feed from "./components/feed/Feed";
import UpdateProfile from "./components/updateProfile/UpdateProfile";
import { useSelector } from "react-redux";
import { useRef, useEffect } from "react";
import LoadingBar from "react-top-loading-bar";
import UnauthorizedUser from "./components/UnauthorizedUser";
import Logout from "./components/Logout";
import toast, { Toaster } from "react-hot-toast";

function App() {
  const isLoading = useSelector((store) => store.appConfigReducer.isLoading);
  const toastData = useSelector((store) => store.appConfigReducer.toastData);
  const loadingRef = useRef();

  useEffect(() => {
    isLoading
      ? loadingRef.current?.continuousStart()
      : loadingRef.current?.complete();
  }, [isLoading]);

  useEffect(() => {
    switch (toastData.type) {
      case "success_toast":
        toast.success(toastData.message);
        break;
      case "error_toast":
        toast.error(toastData.message);
        break;
        default:
          if(toast.message)
            toast.error(toastData.message);
    }
  }, [toastData]);

  return (
    <div className="App">
      <LoadingBar ref={loadingRef} />
      <Toaster />
      <Header />
      <Routes>
        <Route element={<RequireUser />}>
          <Route element={<Home />}>
            <Route path="/" element={<Feed />} />
            <Route path="/profile/:userId" element={<Profile />} />
            <Route path="/update-profile" element={<UpdateProfile />} />
            <Route path="/logout" element={<Logout />} />
          </Route>
        </Route>
        <Route element={<UnauthorizedUser />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
