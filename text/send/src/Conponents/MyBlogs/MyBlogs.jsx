import { useState, useEffect } from "react";
import "./MyBlogs.css";
import srch from '../../Asset/search.svg'
import edit from '../../Asset/editWhite.png'
import del from '../../Asset/delete.svg'
import like from '../../Asset/userLike.png'
import { Link } from "react-router-dom";
import {  Blogs } from "../../Context/data";
import Footer from "../../Containers/Footer/Footer";
import { useUser } from "../../Context/UserContext";
function MyBlogs() {
  const { currentUser } = useUser();
  const Auth_id = currentUser.uid
  
  const [isLoading, setIsLoading] = useState(false);
  const [Data, setData] = useState();

  useEffect(() => {
      setIsLoading(true);
      const displayBlogs = async () => {
          try {
              const blogs = await Blogs
              console.log(blogs)
              setData(blogs)
          }
          catch (error) {
              console.log(error)
          }
      }
      setIsLoading(false);

      return () => displayBlogs();
  }, []);
  const SingleBlogs = Data?.filter(function (e) {
    return e.authId === Auth_id;

});

  const [blogs, setBlogs] = useState([]); // Store fetched blogs
  const [searchTerm, setSearchTerm] = useState(""); // For searching blogs
  const [filteredBlogs, setFilteredBlogs] = useState([]); // Display filtered blogs

  // Simulate fetching blogs
  useEffect(() => {
    const fetchBlogs = async () => {
      setBlogs(SingleBlogs);
      setFilteredBlogs(SingleBlogs);
    };

    fetchBlogs();
  }, []);

  // Handle search functionality
  const handleSearch = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    const filtered = blogs.filter((blog) =>
      blog.title.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredBlogs(filtered);
  };
  // const handleClick = (event) => {
  //   // const value = event.target.value;
  //   alert ("Are you sure want to delete this?")
  // };
  return (
    <div className="MyBlogs">
      {/* Header Section */}
      <div className="head">
        <nav>
          <ul>
            <li>
              <Link to="/home">Home</Link>
            </li>
          </ul>
        </nav>
        <div className="div">
          <h5>My Blogs</h5>
        </div>

        <div className="srch">
          <input
            type="text"
            placeholder="Search blogs..."
            value={searchTerm}
            onChange={handleSearch}
          />
          <img src={srch} alt="" />
        </div>
      </div>

      {/* Blog List Section */}
      <div className="mid">
        <div className="blogs-list">
          {filteredBlogs && filteredBlogs.length > 0 ? (
            filteredBlogs.map((blog) => (
              <div key={blog.id} className="blog-card">
                {
                  blog.image &&
                  <div className="image-connect"><img src={blog.image} alt="" /></div>
                }
                <h2>{blog.title}</h2>
                <p>{blog.date}</p>
                <p>Type: {blog.type}</p>
                <p className="blog-text">{blog.desc}</p>

                <div className="actions">
                  {/* <button>View <img src={view} alt="" /></button> */}
                  <button>Edit <img src={edit} alt="" /></button>
                  <button>Delete <img src={del} alt="" /></button>
                  <button><span>{blog.likes.length}</span> Likes <img src={like} alt="" /></button>

                </div>
              </div>
            ))
          ) : (
            <p className="no-blogs">No blogs found.</p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default MyBlogs;
