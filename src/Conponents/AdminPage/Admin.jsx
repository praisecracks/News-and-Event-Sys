import { useEffect, useState, useCallback } from "react";
import "./Admin.css";
import { useNavigate } from "react-router-dom";
import { collection, doc, onSnapshot, updateDoc, deleteDoc, getDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { db } from "../../Context/Firebase";
import { useUser } from "../../Context/UserContext";
import admin from "../../Asset/admin.png";
import { FaBackward } from "react-icons/fa";

function Admin() {
  const { currentUser } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [isRoleLoading, setIsRoleLoading] = useState(true);
  const [Data, setData] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [draggedPost, setDraggedPost] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSubAdmin, setIsSubAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    const unsub = onSnapshot(collection(db, "Blogs"), (querySnapshot) => {
      const StreamArray = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setData(StreamArray);
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
//return interface
  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <nav>
        <ul>
          <li>
            <button className="back-btn" onClick={() => navigate("/home")}>
              <FaBackward /> Back
            </button>
          </li>
          {!isRoleLoading && isAdmin && (
            <li>
              <button className="create-admin-btn" onClick={() => navigate("/createadmin")}>
                <img className="admin-icon" src={admin} alt="Admin" /> Create Sub Admin
              </button>
            </li>
          )}
        </ul>
      </nav>

      {isLoading ? (
        <div className="loading-spinner">Loading...</div>
      ) : (
        <div className="dashboard-container">
          <div className="approved-section">
            <h2>Approved Posts</h2>
            <div className="posts-grid">
              {Data.filter((post) => post.isVerified).length > 0 ? (
                Data.filter((post) => post.isVerified).map((post) => (
                  <div key={post.id} className="post-card" draggable onDragStart={() => setDraggedPost(post)}>
                    <div>
                      <img src={post.image} alt={post.title} />
                      <h3>{post.title}</h3>
                    </div>
                    <div className="Approved-btn" style={{ display: "grid" }}>
                      <button onClick={() => setSelectedPost(post)}>View Content</button>
                      <button onClick={() => handleApprove(post.id, "disapprove")}>Disapprove</button>
                    </div>
                  </div>
                ))
              ) : (
                <p>No approved posts yet.</p>
              )}
            </div>
          </div>

          <div className="disapproved-section">
            <h2>Pending/Disapproved Posts</h2>
            <div className="posts-grid">
              {Data.filter((post) => !post.isVerified).length > 0 ? (
                Data.filter((post) => !post.isVerified).map((post) => (
                  <div key={post.id} className="post-card" draggable onDragStart={() => setDraggedPost(post)}>
                    <img src={post.image} alt={post.title} />
                    <h3>{post.title}</h3>
                    <div className="screen-content" style={{ display: "grid" }}>
                      <button onClick={() => setSelectedPost(post)}>View Content</button>
                      <button onClick={() => handleApprove(post.id, "approve")}>Approve</button>
                    </div>
                  </div>
                ))
              ) : (
                <p>No disapproved posts.</p>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="recycle-bin" onDragOver={(e) => e.preventDefault()} onDrop={() => handleDeletePost(draggedPost?.id)}>
        <h3>Recycle Bin</h3>
        <p>Drag posts here to delete them.</p>
      </div>

      <div className={`post-details ${selectedPost ? "visible" : ""}`}>
        {selectedPost ? (
          <div className="details-card">
            <h2>Post Details</h2>
            <img src={selectedPost.image} alt={selectedPost.title} className="details-image" />
            <h2 style={{color: "#000"}}>{selectedPost.title}</h2>
            <p>{selectedPost.desc}</p>
            <div className="post-details-btn">
            <button style={{background: "#02b717", color: "#fff"}} onClick={() => handleApprove(selectedPost.id, "approve")}>Approve</button>
            <button style={{ marginLeft: "10px", marginTop: "10px" }} onClick={() => handleApprove(selectedPost.id, "disapprove")}>
              Disapprove
            </button>
            <button onClick={() => setSelectedPost(null)}>Close</button>
            </div>
          </div>
        ) : (
          <p>Select a post to view details.</p>
        )}
      </div>
    </div>
  );
}

export default Admin;
