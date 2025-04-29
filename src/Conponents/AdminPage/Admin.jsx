import { useEffect, useState, useCallback } from "react";
import "./Admin.css";
import { useNavigate } from "react-router-dom";
import { collection, doc, onSnapshot, updateDoc, deleteDoc, getDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { db } from "../../Context/Firebase";
import { useUser } from "../../Context/UserContext";
import { FaBackward, FaUserAlt, FaCog, FaTrash, FaCheck, FaTimes } from "react-icons/fa"; // Import React Icons
// import { serverTimestamp } from "firebase/firestore";
import { addDoc } from "firebase/firestore";


// await addDoc(collection(db, "Blogs"), {
//   title: title,
//   desc: description,
//   image: imageUrl,
//   isVerified: false,
//   timestamp: serverTimestamp(), // ✅ Adds a reliable Firestore server time
// });


function Admin() {
  const [searchQuery, setSearchQuery] = useState('');
  const { currentUser } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [isRoleLoading, setIsRoleLoading] = useState(true);
  const [Data, setData] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [draggedPost, setDraggedPost] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSubAdmin, setIsSubAdmin] = useState(false);
  const [viewPosts, setViewPosts] = useState("approved");  // Default to show approved posts
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    const unsub = onSnapshot(collection(db, "Blogs"), (querySnapshot) => {
      const StreamArray = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
  
      // Sort by timestamp descending
      const sortedArray = StreamArray.sort((a, b) => {
        const timeA = a.timestamp ? a.timestamp.toMillis?.() || new Date(a.timestamp).getTime() : 0;
        const timeB = b.timestamp ? b.timestamp.toMillis?.() || new Date(b.timestamp).getTime() : 0;
        return timeB - timeA;
      });
  
      setData(sortedArray);
      setIsLoading(false);
    });
  
    return () => unsub();
  }, []);
  

  const fetchUserRole = useCallback(async () => {
    if (!currentUser) {
      setIsRoleLoading(false);
      return;
    }
    try {
      const userRef = doc(db, "Users", currentUser.uid);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setIsAdmin(userData.role === "admin");
        setIsSubAdmin(userData.role === "subadmin");
        console.log("Fetched User Role:", userData.role);
      } else {
        console.warn("User document not found in Firestore.");
      }
    } catch (error) {
      console.error("Error fetching user role:", error);
    } finally {
      setIsRoleLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchUserRole();
  }, [fetchUserRole]);

  const handleApprove = async (postId, action) => {
    try {
      const orderRef = doc(db, "Blogs", postId);
      const currentPost = Data.find((post) => post.id === postId);
      if (!currentPost) return toast.error("Post not found!");

      await updateDoc(orderRef, { isVerified: action === "approve" });
      toast.success(`Post ${action === "approve" ? "Approved" : "Disapproved"}.`);
    } catch (error) {
      toast.error("Error updating post status.");
    }
  };

  const handleDeletePost = async (postId) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await deleteDoc(doc(db, "Blogs", postId));
        toast.success("Post deleted successfully.");
      } catch (error) {
        toast.error("Error deleting post.");
      }
    }
  };

  const handleDragStart = (post) => {
    setDraggedPost(post);
  };

  const handleDrop = () => {
    if (draggedPost) {
      handleDeletePost(draggedPost.id);
      setDraggedPost(null);
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="sidebar">
        {currentUser && (
          <div className="profile-info">
            <img src={currentUser.photoURL || "/default-profile.png"} alt="Profile" className="profile-pic" />
            <div className="user-info">
              <h3 style={{color: "#fff"}}>{currentUser.displayName || "Admin"}</h3>
              <p style={{color: "#eee"}}>{currentUser.email}</p>
            </div>
          </div>
        )}

        <nav className="sidebar-nav">
          <ul>
            <li>
              <button className="back-btn" onClick={() => navigate("/home")}>
                <FaBackward size={20} /> Back
              </button>
            </li>
            {!isRoleLoading && isAdmin && (
              <li>
                <button className="create-admin-btn" onClick={() => navigate("/createadmin")}>
                  <FaUserAlt size={20} /> Create Sub Admin
                </button>
              </li>
            )}
            <li>
              <button onClick={() => navigate("/dashboard")}>
                <FaCog size={20} /> Dashboard
              </button>
            </li>
            <li>
              <button onClick={() => navigate("/settings")}>
                <FaCog size={20} /> Settings
              </button>
            </li>
            <li>
              <button  onClick={() => setViewPosts("approved")}>Approve Post</button>
            </li>
            <li>
              <button onClick={() => setViewPosts("disapproved")}>Pending / Disapprove Post</button>
            </li>

            {/* Recycle Bin Button */}
            <li>
              <div
                className="recycle-bin-sidebar"
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
              >
                <FaTrash size={20} /> Recycle Bin
              </div>
            </li>
          </ul>
        </nav>
      </div>

      <div className="dashboard-content">
  <h1>Admin Dashboard</h1>

  <input 
    className="search-bar-admin"
    type="text" 
    value={searchQuery} 
    onChange={(e) => setSearchQuery(e.target.value)} 
    placeholder="Search..." 
  />

  {isLoading ? (
    <div className="loading-spinner">Loading...</div>
  ) : (
    <div className="posts-section">
      <div className={`${viewPosts === "approved" ? "approved-section" : "disapproved-section"}`}>
        <h2>{viewPosts === "approved" ? "Approved Posts" : "Pending/Disapproved Posts"}</h2>
        <div className="posts-grid">
          {Data.filter((post) => (viewPosts === "approved" ? post.isVerified : !post.isVerified))
            .filter((post) => 
              post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
              post.desc.toLowerCase().includes(searchQuery.toLowerCase())
            ).length > 0 ? (
              Data.filter((post) => (viewPosts === "approved" ? post.isVerified : !post.isVerified))
                .filter((post) => 
                  post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                  post.desc.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((post) => (
                  <div key={post.id} className="post-card" draggable onDragStart={() => handleDragStart(post)}>
                    <h3>{post.title}</h3>
                    {post.image && (
                      <img 
                        src={post.image} 
                        alt="Post Image" 
                        style={{ width: "60%", height: "50px", objectFit: "cover", borderRadius: "8px", marginBottom: "10px" }}
                      />
                    )}
                    <div className={viewPosts === "approved" ? "Approved-btn" : "screen-content"}>
                      <button onClick={() => setSelectedPost(post)} className="approved">View Content</button>
                      <button className="gggg" onClick={() => handleApprove(post.id, viewPosts === "approved" ? "disapprove" : "approve")}>
                        {viewPosts === "approved" ? <FaTimes size={18} /> : <FaCheck size={18} />}
                        {viewPosts === "approved" ? "Disapprove" : "Approve"}
                      </button>
                    </div>
                  </div>
                ))
          ) : (
            <p>No posts available.</p>
          )}
        </div>
      </div>
    </div>
  )}



        {selectedPost && (
        <div className="post-details">
        <div className="details-card">
          <h2>Post Details</h2>
          
          <h3>{selectedPost.title}</h3>
      
          {/* NEW: Display Image if exists */}
          {selectedPost.image && (
            <img 
              src={selectedPost.image} 
              alt="Post Image" 
              style={{ width: "100%", height: "300px", objectFit: "cover", borderRadius: "8px", marginBottom: "15px" }}
            />
          )}
      
          {/* Scrollable content section */}
          <div className="post-content" dangerouslySetInnerHTML={{
            __html: selectedPost.desc.replace(/<img[^>]*>/g, (imgTag) => {
              return imgTag.replace(
                /src="([^"]+)"/,
                (match, p1) => `src="${p1}" style="max-width: 100%; height: auto; display: block; margin: 10px 0;"`
              );
            })
          }} />
      
          <div className="post-details-btn">
            <button className="approved" onClick={() => handleApprove(selectedPost.id, "approve")}>
              <FaCheck size={18} /> Approve
            </button>
            <button onClick={() => handleApprove(selectedPost.id, "disapprove")}>
              <FaTimes size={18} /> Disapprove
            </button>
            <button onClick={() => setSelectedPost(null)}>
              <FaTimes size={18} /> Close
            </button>
          </div>
        </div>
      </div>
      
        )}
      </div>
    </div>
  );
}

export default Admin;
