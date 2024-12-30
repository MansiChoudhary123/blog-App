import React, { useEffect, useMemo, useRef, useState } from "react";
import { File } from "../assets/file";
import { backendUrl } from "../../backendUrl";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { CrossIcon } from "../assets/crossIcon";
import JoditEditor from "jodit-react";
import loading from "../image/loading.gif";

const CreatePost = () => {
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
      if (response.status == 200) {
        setCategories(response.data.categories || []);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCategoryData();
  }, []);

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    if (!title || !content || !selectedFile) {
      alert("Title, content, and image fields are required");
      return;
    }

    try {
      const userInfo = JSON.parse(localStorage.getItem("user"));

      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("createdBy", userInfo.userId);
      formData.append("image", selectedFile);
      formData.append("category", selectedCategory);
      const headers = {
        Authorization: userInfo.token,
        "Content-Type": "multipart/form-data",
      };

      const res = await axios.post(`${backendUrl}/api/posts/`, formData, {
        headers,
      });

      if (res.status === 201) {
        setIsLoading(false);
        navigate("/");
      }

      setTitle("");
      setContent("");
      setSelectedFile(null);
      setSelectedCategory("");
    } catch (error) {
      console.error("Error creating post:", error);
    }
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
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <img src={loading} />
        </div>
      ) : (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-20">
          <h1 className="text-3xl font-semibold text-center mb-6 mt-10 ">
            Create Post
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
                className="w-full bg-slate-100 px-4 py-2 border border-gray-300 rounded-md "
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
                Create
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default CreatePost;
