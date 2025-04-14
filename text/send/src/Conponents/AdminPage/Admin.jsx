import { useState } from "react";
import "./Admin.css";
import back from '../../Asset/arrow_back.svg'
import img from '../../Asset/Book study.jpg'
import { Blogs } from "../../Context/data";
import { Link } from "react-router-dom";
import { doc, updateDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { db } from "../../Context/Firebase";

function Admin() {
  const data = Blogs.filter(function (e) {
    return e.isVerified === false;

  });

  const [pendingPosts, setPendingPosts] = useState(data);
  const [selectedPost, setSelectedPost] = useState(null);

  const handleApprove = async (postId) => {
    setPendingPosts(pendingPosts.filter((post) => post.id !== postId));
    const orderRef = doc(db, "Blogs", postId); // Reference to the specific order
    const currentOrder = Blogs.find((order) => order.id === postId);

    if (!currentOrder) {
      toast.error(`Order with ID ${postId} does not exist.`);
      return;
    }

    const newStatus = !currentOrder.isVerified; // Toggle the status

    // Update status in Firestore
    await updateDoc(orderRef, { isVerified: newStatus });
  };

  // const toggleStatus = async (orderId) => {
  //   try {
  //     const orderRef = doc(db, "orders", orderId); // Reference to the specific order
  //     const currentOrder = orders.find((order) => order.id === orderId);

  //     if (!currentOrder) {
  //       toast.error(`Order with ID ${orderId} does not exist.`);
  //       return;
  //     }

  //     const newStatus = !currentOrder.status; // Toggle the status

  //     // Update status in Firestore
  //     await updateDoc(orderRef, { status: newStatus });

  //     // Update UI immediately
  //     setOrders((prevOrders) =>
  //       prevOrders.map((order) =>
  //         order.id === orderId ? { ...order, status: newStatus } : order
  //       )
  //     );

  //     toast.success(
  //       `Order status updated to ${newStatus ? "Delivered" : "Not Delivered"}.`
  //     );
  //   } catch (error) {
  //     toast.error("Error updating order status. Please try again.");
  //   }
  // };


  const handleReject = (postId) => {
    alert(`Post ${postId} rejected!`);
    setPendingPosts(pendingPosts.filter((post) => post.id !== postId));
    setSelectedPost(null);
  };

  const handleViewPost = (post) => {
    setSelectedPost(post);
  };

  return (
    <div className="admin-dashboard">
      {/* <img src= {back} alt="" /> */}
      <h1>Admin Dashboard</h1>

      <nav>
        <ul>
          <li>
            {/* <Link to="/admin">Admin Home</Link> */}
          </li>
          <li>
            {/* <Link to="/adminform">Create Admin </Link> */}
          </li>
        </ul>
      </nav>
      <div className="dashboard-container">
        <div className="pending-posts">








          <h2>Pending Posts</h2>

          {pendingPosts.length > 0 ? (
            <ul>
              {pendingPosts.map((post) => (
                <li key={post.id} className="post-item">
                  <img src={post.image} alt={post.title} className="post-image" />
                  <div className="post-info">
                    <h3>{post.title}</h3>
                    <button onClick={() => handleViewPost(post)} className="view-button">View Content</button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="no-pending">No pending posts.</p>
          )}
        </div>
        <div className="post-details">
          {selectedPost ? (
            <div className="details-card">
              <h2>Post Details</h2>
              <img src={selectedPost.image} alt={selectedPost.title} className="details-image" />
              <h3>{selectedPost.title}</h3>
              <p className="pend-content">{selectedPost.desc}</p>
              <div className="action-buttons">
                <button onClick={() => handleApprove(selectedPost.id)} className="approve-button">Approve</button>
                <button onClick={() => handleReject(selectedPost.id)} className="reject-button">Reject</button>
              </div>
            </div>
          ) : (
            <p>Select a post to view details.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Admin;
