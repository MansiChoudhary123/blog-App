import React, { useEffect, useRef, useState } from "react";
import { File } from "../assets/file";
import { backendUrl } from "../../backendUrl";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { CrossIcon } from "../assets/crossIcon";
import JoditEditor from "jodit-react";
import loading from "../image/loading.gif";

const EditPost = () => {
  const { id } = useParams();
  const [selectedPost, setSelectedPost] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const fileRef = useRef(null);
  const editor = useRef(null);
  const navigate = useNavigate();

  const handleTitleInput = (e) => {
    setTitle(e.target.value);
  };

  const handleContentInput = (newData) => {
    setContent(newData);
  };

  const getCategoryData = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/categories`);
      if (response.status === 200) {
        setCategories(response.data.categories || []);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchPostData = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("user"));
      const headers = { Authorization: `${userInfo.token}` };
      const response = await axios.get(`${backendUrl}/api/posts/${id}`, {
        headers,
      });

      if (response.status === 200) {
        const post = response.data.post;
        setSelectedPost(post); // Optional, if you still want to keep this state
        setTitle(post.title);
        setContent(post.content);
        setSelectedCategory(post.category);
        if (post.image) {
          setPreview(post.image); // Assuming `post.image` is a URL
        }
      }
    } catch (error) {
      console.error("Error fetching post data:", error);
    }
  };

  useEffect(() => {
    getCategoryData();
    fetchPostData();
  }, [id]);

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleFileClick = () => {
    fileRef.current.click();
  };

  const handleCoverClose = () => {
    setPreview(null);
    setSelectedFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const userInfo = JSON.parse(localStorage.getItem("user"));
      const headers = { Authorization: `${userInfo.token}` };

      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("category", selectedCategory);
      if (selectedFile) {
        formData.append("image", selectedFile);
      }

      const response = await axios.put(
        `${backendUrl}/api/posts/${id}`,
        formData,
        {
          headers,
        }
      );

      if (response.status === 200) {
        setIsLoading(false);
        navigate("/Myposts");
      }
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <img src={loading} />
        </div>
      ) : (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-20">
          <h1 className="text-3xl font-semibold text-center mb-6 mt-10">
            Edit Post
          </h1>
          <form onSubmit={handleSubmit} className="space-y-6 mt-20">
            <div>
              <input
                type="text"
                id="title"
                value={title}
                onChange={handleTitleInput}
                placeholder="Enter post title"
                className="w-full bg-slate-100 px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>

            {preview ? (
              <div>
                <button
                  type="button"
                  onClick={handleCoverClose}
                  className="flex justify-start"
                >
                  <CrossIcon className="size-6" />
                </button>
                <div className="flex justify-center items-center border border-gray-200 border-dashed p-2 rounded-lg">
                  <img
                    alt="cover image"
                    src={preview}
                    height="280"
                    width="auto"
                    className="rounded-lg"
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-4 border border-gray-300 rounded-md font-lg bg-slate-100 h-[300px]">
                <input
                  ref={fileRef}
                  type="file"
                  id="image"
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
                <button
                  type="button"
                  onClick={handleFileClick}
                  className="flex items-center justify-center focus:outline-none text-green-600"
                >
                  <File className="size-20" />
                  <span>Select Cover</span>
                </button>
              </div>
            )}

            <div>
              <JoditEditor
                ref={editor}
                value={content}
                onBlur={handleContentInput}
                className="w-full px-4 py-2 bg-slate-100 border border-gray-300 rounded-md"
                rows="4"
              />
            </div>

            <div>
              <select
                className="w-full bg-slate-100 px-4 py-2 border border-gray-300 rounded-md"
                value={selectedCategory}
                onChange={handleCategoryChange}
              >
                <option value="" disabled>
                  Select a category
                </option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.categoryName}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                className="px-6 py-2 bg-black text-white font-semibold rounded-md"
              >
                Save changes
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default EditPost;
