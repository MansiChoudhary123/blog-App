import "./index.css";
import "./App.css";
import Registration from "./components/Registration";
import Login from "./components/Login";
import { Routes, BrowserRouter as Router, Route } from "react-router-dom";
import Topbar from "./components/Topbar";
import Home from "./components/Home";
import CreatePost from "./components/CreatePost";
import UserPosts from "./components/UserPosts";
import PostDetails from "./components/PostDetails";
import EditPost from "./components/EditPost";
function App() {
  return (
    <>
      <div>
        <Router>
          <Topbar />
          <Routes>
            <Route path="/registration" element={<Registration />} />
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Home />} />
            <Route path="/createPost" element={<CreatePost />} />
            <Route path="/Myposts" element={<UserPosts />} />
            <Route path="/posts/:id" element={<PostDetails />} />
            <Route path="/edit/post/:id" element={<EditPost />} />
          </Routes>
        </Router>
      </div>
    </>
  );
}

export default App;
