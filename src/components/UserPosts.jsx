import React, { useState, useEffect } from "react";
import { EditIcon } from "../assets/editIcon";
import { DeleteIcon } from "../assets/deleteIcon";
import { backendUrl } from "../../backendUrl";
import axios from "axios";
import DOMPurify from "dompurify";
import { useNavigate } from "react-router-dom";
import nofound from "../image/nofound.gif";

const UserPosts = () => {
  const [myPosts, setMyPosts] = useState([]);
  const [postToDelete, setPostToDelete] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();

  // Fetch user's posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem("user"));
        const headers = { Authorization: `${userData.token}` };
        const res = await axios.get(
          `${backendUrl}/api/posts/user/${userData.userId}`,
          { headers }
        );
        setMyPosts(res.data.posts || []);
      } catch (error) {
        console.error("Error fetching user posts:", error);
      }
    };

    fetchPosts();
  }, []);

  const handleDeletePost = (post) => {
    setPostToDelete(post); // Store the entire post object
    setIsModalOpen(true);
  };

  const deletePost = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      const headers = { Authorization: `${userData.token}` };
      await axios.delete(`${backendUrl}/api/posts/${postToDelete._id}`, {
        headers,
      });
      setMyPosts(myPosts.filter((post) => post._id !== postToDelete._id));
      setIsModalOpen(false); // Close modal
      setPostToDelete(null); // Clear postToDelete
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const handlePostEdit = (post) => {
    navigate(`/edit/post/${post._id}`);
  };

  const handleImageClick = (post) => {
    navigate(`/posts/${post._id}`);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Posts</h1>
      {myPosts.length === 0 ? (
        <div className="flex justify-center items-center h-[500px]">
          <img
            src={nofound}
            alt="No posts found"
            className="max-w-full h-auto"
            style={{ minHeight: "200px" }}
          />
        </div>
      ) : (
        <div className="container mx-auto p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {myPosts.map((post) => (
            <div
              key={post._id}
              className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200"
            >
              <div className="relative h-40">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full max-h-40 object-cover"
                  onClick={() => handleImageClick(post)}
                />
              </div>

              <div className="p-4 h-24">
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {post.title}
                </h3>
                <div
                  className="text-sm text-gray-600 mt-2 overflow-hidden text-ellipsis whitespace-nowrap h-4"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(post.content),
                  }}
                ></div>
              </div>
              <div className="flex justify-between bottom-1 mb-3 h-10">
                <button
                  className="left-0 text-black p-2 ml-2 rounded-md hover:bg-slate-100 border border-gray-500"
                  onClick={() => handlePostEdit(post)}
                >
                  <span className="flex">
                    <EditIcon />
                    Edit
                  </span>
                </button>
                <button
                  className="bg-red-500 right-0 mx-2 text-white p-2 rounded-md"
                  onClick={() => handleDeletePost(post)}
                >
                  <span className="flex">
                    <DeleteIcon />
                    Delete
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-300 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-md">
            <h2 className="text-lg font-semibold">Confirm Deletion</h2>
            <p className="text-gray-600 mt-2">
              Are you sure you want to delete the post titled "
              {postToDelete?.title}"?
            </p>
            <div className="flex justify-end space-x-4 mt-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-300 text-black rounded"
              >
                Cancel
              </button>
              <button
                onClick={deletePost}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserPosts;
