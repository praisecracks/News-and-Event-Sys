import { useState, useEffect } from "react";
import "./userBlog.css";
import './UserBlog.css'
import back from '../../Asset/arrow_back.svg'
// import srch from '../Images/search.svg'
// import connect from '../Images/Book study.jpg'
import like from '../../Asset/userLike.png'
import Header from "../../Containers/Header/Header";
import { Blogs } from "../../Context/data";
import { useParams } from "react-router";

function userBlog() {
  const params = useParams(); // Extract the order ID from URL params
  const _id  = params.id; // Extract the order ID from URL params
  // const [searchTerm, setSearchTerm] = useState(""); // For searching blogs

  const data = Blogs.filter(function (e) {
    return e.id === _id;

  });

  console.log(data[0].id, _id)

  // Simulate fetching blogs

  // const [isLoading, setIsLoading] = useState(false);
  // const [Product, setProduct] = useState([]);
  // const navigate = useNavigate()

  // useEffect(() => {
  //     setIsLoading(true);

  //     // Query the Firebase "orders" collection
  //     const q = query(collection(db, "products"));
  //     const unsub = onSnapshot(q, (querySnapshot) => {
  //         let foundOrder = null;
  //         querySnapshot.forEach((doc) => {
  //             if (doc.id === id) {
  //                 foundOrder = { ...doc.data(), id: doc.id };
  //             }
  //         });
  //         setProduct(foundOrder);
  //         setIsLoading(false);
  //     });

  //     return () => unsub(); // Clean up the listener
  // }, [id]);
  return (
    <div className="userBlog">
      {/* Header Section */}
      <Header />
      {/* Blog List Section */}
      <div className="mid">
        <div className="blogs-list">
          {data.length > 0 ? 
             data.map((blog) => (
              <div key={blog.id} className="blog-card">
                <div className="image-connect"><img src={blog.image} alt="" /></div>
                <h2>{blog.title}</h2>
                <p>{blog.date}</p>
                <p className="blog-text">{blog.desc}</p>

                <div className="actions">
                  {/* <button>View <img src={view} alt="" /></button> */}
                  <button>{blog.likes ? blog.likes : "0"} Like<img src={like} alt="" /></button>

                </div>
              </div>
             ))
           : (
            <p className="no-blogs">No blogs found.🔍</p>
          )}
        </div>
      </div>

    </div>
  );
}

export default userBlog;
