import { Link } from "react-router-dom";
import Logo from "../../assets/logo.svg";
import UserIcon from "../../assets/user_icon.svg";
// تصحيح الاستيراد هنا
import { UserButton, useUser, useClerk } from "@clerk/clerk-react";
import { assets } from "../../assets/assets";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";

const Navbar = () => {
  const { navigate, isEducator } = useContext(AppContext);
  // استخدام التفكيك (Destructuring) للوصول للدوال والبيانات
  const { openSignIn } = useClerk();
  const { user } = useUser();
  const isCourseListPage = location.pathname.includes("/course-list");
  return (
    <div
      className={`flex items-center justify-between px-4 sm:px-10 md:px-14 lg:px-36 
    border-b border-gray-500 py-4 ${
      isCourseListPage ? "bg-white" : "bg-cyan-100/70"
    }`}
    >
      <img
        onClick={() => navigate("/")}
        src={Logo}
        alt="Logo"
        className="w-28 lg:w-32 cursor-pointer"
      />

      <div className="hidden md:flex items-center gap-5 text-gray-500">
        <div className="flex item-center gap-5">
          {/* يمكنك هنا استخدام isSignedIn لإخفاء/إظهار أزرار معينة */}
          {user && (
            <button onClick={() => navigate("/educator")}>
              {isEducator ? "Educator Dashboard" : "Become Educator"}{" "}
              <span className="px-5">|</span>{" "}
              <Link to="/my-enrollments">My Enrollments</Link>
            </button>
          )}
        </div>

        {user ? (
          <UserButton />
        ) : (
          <button
            className="bg-blue-600 text-white px-5 py-2 rounded-full"
            onClick={() => openSignIn()}
          >
            Create Account
          </button>
        )}
      </div>

      {/* For Phone Screen */}
      <div className="md:hidden flex items-center gap-2 sm:gap-5 text-gray-500">
        <div>
          {user && (
            <button onClick={() => navigate("/educator")}>
              {isEducator ? "Educator Dashboard" : "Become Educator"}{" "}
              <span className="px-5">|</span>{" "}
              <Link to="/my-enrollments">My Enrollments</Link>
            </button>
          )}
        </div>
        {user ? (
          <UserButton />
        ) : (
          <button onClick={() => openSignIn()}>
            <img src={assets.user_icon} alt="" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
