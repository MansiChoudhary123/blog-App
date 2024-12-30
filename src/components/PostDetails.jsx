import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { backendUrl } from "../../backendUrl";
import { BackIcon } from "../assets/backIcon";
import DOMPurify from "dompurify";
const PostDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPostDetails = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/posts/${id}`);
      setData(response.data.post);
    } catch (err) {
      setError("Failed to fetch post details.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPostDetails();
  }, [id]);

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div>
      <button
        className="bg-white mt-16 text-black font-bold rounded-lg mb-4 p-2 ml-4 "
        onClick={() => navigate(-1)}
      >
        <div className="flex text-center justify-center">
          <BackIcon /> <p className="ml-2">Back</p>
        </div>
      </button>
      <div>
        <div
          className="relative h-[500px] bg-cover bg-no-repeat"
          style={{
            backgroundImage: `url(${data.image})`,
            objectFit: "fill",
          }}
        >
          <div className="absolute inset-0 bg-black opacity-25  "></div>
          <h2 className="text-3xl font-bold text-white absolute top-20 left-10 transform -translate-y-1/2">
            {data.title}
          </h2>
          <img
            src={data.image}
            alt={data.title}
            className="w-full h-[500px] "
          />
        </div>

        {/* <img src={data.image} alt={data.title} className="w-full h-[500px] " /> */}
        <div className="p-4 ">
          <div
            className="random-class text-gray-600 px-2 md:px-20 lg:px-40 "
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(data.content),
            }}
          ></div>
        </div>
        <div className="flex justify-between items-center text-gray-500 text-sm mt-4 px-4">
          <span>{new Date(data.createdAt).toLocaleDateString()}</span>
          {data.createdBy && (
            <span>
              {data.createdBy.firstName + " " + data.createdBy.lastName}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostDetails;
