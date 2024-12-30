import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import DOMPurify from "dompurify";
import { backendUrl } from "../../backendUrl";
import { FilterIcon } from "../assets/filterIcon";
import { SearchIcon } from "../assets/searchIcon";
import nofound from "../image/nofound.gif";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [isLogin, setIsLogin] = useState(false);
  const [sort_by, setSortBy] = useState("latest");
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();

  // Check if the user is logged in
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

  // Fetch posts from the backend
  const getPostData = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(`${backendUrl}/api/posts?sort_by=${sort_by}`);
      if (res.status === 200) {
        setPosts(res.data.posts);
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
      setPosts([]);
    }
  };
  console.log(sort_by);
  useEffect(() => {
    getPostData();
  }, [sort_by]);

  useEffect(() => {
    if (posts.length > 0) {
      setFilteredPosts(posts); // Set filteredPosts to all posts once data is fetched
    }
  }, [posts]);

  const handleImageClick = (post) => {
    navigate(`/posts/${post._id}`);
  };

  const handleSearchInput = (e) => {
    const search = e.target.value.toLowerCase();
    setSearchValue(search);

    if (search === "") {
      setFilteredPosts(posts);
    } else {
      const filtered = posts.filter((post) =>
        post.title.toLowerCase().includes(search)
      );
      setFilteredPosts(filtered);
    }
  };

  return (
    <div>
      <div className="top-2 flex justify-end mr-4 ">
        {isLogin && (
          <Link to="/createPost">
            <button className="bg-gray-800 text-white rounded-lg mt-16 p-2 ml-4">
              Add Post
            </button>
          </Link>
        )}
      </div>
      <div
        className={`w-full pr-4 md:flex justify-between ,
        ${!isLogin ? "mt-20" : "mt-6"}`}
      >
        <div className="relative ">
          <SearchIcon className="absolute left-7 top-1/4 text-gray-400 " />
          <input
            type="search"
            value={searchValue}
            onChange={handleSearchInput}
            placeholder="Search..."
            className="border border-gray-200 px-8 py-3 mx-6 rounded-md"
          />
        </div>
        <div className=" flex text-white bg-gray-800  rounded py-1 px-1  my-2 w-40 ml-[150px]">
          <div className=" ">
            <p>Sorted By: </p>
          </div>
          <div>
            <select
              className=" text-white bg-gray-800"
              onChange={(e) => setSortBy(e.target.value)}
              value={sort_by}
            >
              <option value={"latest"}>Latest</option>
              <option value={"oldest"}>Oldest</option>
            </select>
          </div>
        </div>
      </div>
      {filteredPosts.length === 0 ? (
        <div className="flex justify-center items-center h-[500px]">
          <img
            src={nofound}
            alt="No posts found"
            className="max-w-full h-auto"
            style={{ minHeight: "200px" }}
          />
        </div>
      ) : (
        <div className="container mx-auto p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:w-full">
          {filteredPosts.map((post) => (
            <div
              key={post._id}
              className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 cursor-pointer h-72"
              onClick={() => handleImageClick(post)}
            >
              <div className="relative  h-40">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full max-h-40 object-cover"
                />
              </div>
              <div className="p-4  h-32">
                <div className="flex justify-between items-center text-gray-500 text-sm mb-2">
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  <span>
                    {post.createdBy.firstName} {post.createdBy.lastName}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 ">
                  {post.title}
                </h3>
                {/* Safely render HTML content */}
                <div
                  className="text-sm text-gray-600 mt-2 overflow-hidden text-ellipsis whitespace-nowrap h-10"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(post.content),
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
