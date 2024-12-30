import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MenuIcon } from "../assets/menuIcon";
const Topbar = () => {
  const naviagte = useNavigate();
  const [isLogin, setIsLogin] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const checkLoginStatus = () => {
      const user = JSON.parse(localStorage.getItem("user"));
      setIsLogin(!!user);
    };

    // Initial check on mount
    checkLoginStatus();

    // Add storage event listener for detecting changes in other tabs
    const handleStorageChange = (e) => {
      if (e.key === "user") {
        checkLoginStatus(); // Update login status if "user" key changes
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setIsLogin(false);
    naviagte("/login");
  };

  return (
    <nav className="bg-gray-800 p-4  fixed top-0 left-0 shadow-lg z-50 w-full ">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-lg font-bold">Blog App</div>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-white sm:hidden focus:outline-none"
        >
          <MenuIcon />
        </button>
        <ul
          style={{ listStyle: "none" }}
          className={`${
            menuOpen ? "block" : "hidden"
          }  absolute sm:static top-16 right-0 w-[150px] sm:w-auto bg-gray-800 sm:bg-transparent lg:space-x-4 md:space-x-3 md:flex justify-between`}
        >
          <li>
            <Link to="/" className="text-white hover:underline sm:p-0">
              Home
            </Link>
          </li>
          {isLogin && (
            <li>
              <Link to="/Myposts" className="text-white hover:underline sm:p-0">
                My Posts
              </Link>
            </li>
          )}
          {!isLogin && (
            <li>
              <Link to="/login" className="text-white hover:underline sm:p-0">
                Login
              </Link>
            </li>
          )}
          {!isLogin && (
            <li>
              <Link
                to="/registration"
                className="text-white hover:underline sm:p-0"
              >
                Register
              </Link>
            </li>
          )}
          {isLogin && (
            <button
              onClick={handleLogout}
              className="text-white hover:underline sm:p-0"
            >
              Logout
            </button>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Topbar;
