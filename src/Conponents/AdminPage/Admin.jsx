import { useEffect, useState, useCallback } from "react";
<<<<<<< HEAD
import "./Admin.css";
=======
>>>>>>> origin/main
import { useNavigate } from "react-router-dom";
import { collection, doc, onSnapshot, updateDoc, deleteDoc, getDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { db } from "../../Context/Firebase";
import { useUser } from "../../Context/UserContext";
<<<<<<< HEAD
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
=======
import admin from "../../Asset/admin.png";
import { FaBackward } from "react-icons/fa";

function Admin() {
>>>>>>> origin/main
  const { currentUser } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [isRoleLoading, setIsRoleLoading] = useState(true);
  const [Data, setData] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [draggedPost, setDraggedPost] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSubAdmin, setIsSubAdmin] = useState(false);
<<<<<<< HEAD
  const [viewPosts, setViewPosts] = useState("approved");  // Default to show approved posts
=======
>>>>>>> origin/main
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    const unsub = onSnapshot(collection(db, "Blogs"), (querySnapshot) => {
      const StreamArray = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
<<<<<<< HEAD
  
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
  
=======
      setData(StreamArray);
      setIsLoading(false);
    });

    return () => unsub();
  }, []);
>>>>>>> origin/main

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
<<<<<<< HEAD
        console.log("Fetched User Role:", userData.role);
      } else {
        console.warn("User document not found in Firestore.");
=======
>>>>>>> origin/main
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
<<<<<<< HEAD
      const orderRef = doc(db, "Blogs", postId);
      const currentPost = Data.find((post) => post.id === postId);
      if (!currentPost) return toast.error("Post not found!");

      await updateDoc(orderRef, { isVerified: action === "approve" });
=======
      const postRef = doc(db, "Blogs", postId);
      const currentPost = Data.find((post) => post.id === postId);
      if (!currentPost) return toast.error("Post not found!");

      await updateDoc(postRef, { isVerified: action === "approve" });
>>>>>>> origin/main
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

<<<<<<< HEAD
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
=======
  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Admin Dashboard</h1>

      {/* Navigation */}
      <nav style={{ marginBottom: "30px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button
          onClick={() => navigate("/home")}
          style={{ padding: "10px 20px", background: "#f5f5f5", border: "1px solid #ccc", cursor: "pointer", borderRadius: "5px" }}
        >
          <FaBackward style={{ marginRight: "8px" }} /> Back
        </button>

        {!isRoleLoading && isAdmin && (
          <button
            onClick={() => navigate("/createadmin")}
            style={{ padding: "10px 20px", background: "#4CAF50", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }}
          >
            <img src={admin} alt="Admin" style={{ width: "20px", height: "20px", marginRight: "8px" }} />
            Create Sub Admin
          </button>
        )}
      </nav>

      {/* Loading */}
      {isLoading ? (
        <p style={{ textAlign: "center" }}>Loading...</p>
      ) : (
        <>
          {/* Approved Posts */}
          <section style={{ marginBottom: "50px" }}>
            <h2>Approved Posts</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "20px", marginTop: "20px" }}>
              {Data.filter((post) => post.isVerified).length > 0 ? (
                Data.filter((post) => post.isVerified).map((post) => (
                  <div
                    key={post.id}
                    draggable
                    onDragStart={() => setDraggedPost(post)}
                    style={{
                      border: "1px solid #ccc",
                      borderRadius: "8px",
                      padding: "10px",
                      textAlign: "center",
                      background: "#fff",
                    }}
                  >
                    <img src={post.image} alt={post.title} style={{ width: "100%", height: "150px", objectFit: "cover", borderRadius: "5px" }} />
                    <h3 style={{ margin: "10px 0" }}>{post.title}</h3>
                    <button
                      style={{ marginBottom: "5px", padding: "8px 12px", background: "#2196F3", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}
                      onClick={() => setSelectedPost(post)}
                    >
                      View Content
                    </button>
                    <button
                      style={{ padding: "8px 12px", background: "#f44336", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}
                      onClick={() => handleApprove(post.id, "disapprove")}
                    >
                      Disapprove
                    </button>
                  </div>
                ))
              ) : (
                <p>No approved posts yet.</p>
              )}
            </div>
          </section>

          {/* Pending / Disapproved Posts */}
          <section>
            <h2>Pending / Disapproved Posts</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "20px", marginTop: "20px" }}>
              {Data.filter((post) => !post.isVerified).length > 0 ? (
                Data.filter((post) => !post.isVerified).map((post) => (
                  <div
                    key={post.id}
                    draggable
                    onDragStart={() => setDraggedPost(post)}
                    style={{
                      border: "1px solid #ccc",
                      borderRadius: "8px",
                      padding: "10px",
                      textAlign: "center",
                      background: "#f9f9f9",
                    }}
                  >
                    <img src={post.image} alt={post.title} style={{ width: "100%", height: "150px", objectFit: "cover", borderRadius: "5px" }} />
                    <h3 style={{ margin: "10px 0" }}>{post.title}</h3>
                    <button
                      style={{ marginBottom: "5px", padding: "8px 12px", background: "#4CAF50", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}
                      onClick={() => handleApprove(post.id, "approve")}
                    >
                      Approve
                    </button>
                    <button
                      style={{ padding: "8px 12px", background: "#2196F3", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}
                      onClick={() => setSelectedPost(post)}
                    >
                      View Content
                    </button>
                  </div>
                ))
              ) : (
                <p>No disapproved posts.</p>
              )}
            </div>
          </section>
        </>
      )}

      {/* Recycle Bin */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={() => handleDeletePost(draggedPost?.id)}
        style={{
          marginTop: "50px",
          padding: "20px",
          background: "#ffebee",
          border: "2px dashed #f44336",
          textAlign: "center",
          borderRadius: "8px",
        }}
      >
        <h3>Recycle Bin</h3>
        <p>Drag posts here to delete them.</p>
      </div>

      {/* Post Details Popup */}
      {selectedPost && (
        <div
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: "999",
          }}
        >
          <div
            style={{
              width: "90%",
              maxWidth: "600px",
              background: "#fff",
              padding: "20px",
              borderRadius: "10px",
              textAlign: "center",
            }}
          >
            <h2>Post Details</h2>
            <img src={selectedPost.image} alt={selectedPost.title} style={{ width: "100%", height: "250px", objectFit: "cover", borderRadius: "8px", marginBottom: "20px" }} />
            <h3>{selectedPost.title}</h3>
            <p>{selectedPost.desc}</p>
            <div style={{ marginTop: "20px", display: "flex", justifyContent: "center", gap: "10px", flexWrap: "wrap" }}>
              <button
                style={{ padding: "10px 15px", background: "#4CAF50", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }}
                onClick={() => handleApprove(selectedPost.id, "approve")}
              >
                Approve
              </button>
              <button
                style={{ padding: "10px 15px", background: "#f44336", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }}
                onClick={() => handleApprove(selectedPost.id, "disapprove")}
              >
                Disapprove
              </button>
              <button
                style={{ padding: "10px 15px", background: "#9E9E9E", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }}
                onClick={() => setSelectedPost(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
>>>>>>> origin/main
    </div>
  );
}

export default Admin;
