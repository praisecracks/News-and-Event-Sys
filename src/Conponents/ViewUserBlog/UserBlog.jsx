import { useState, useEffect } from "react";
import "./userBlog.css";
import like from '../../Asset/userLike.png';
import Header from "../../Containers/Header/Header";
import { useParams } from "react-router";
import { collection, onSnapshot, query, addDoc, serverTimestamp, orderBy, deleteDoc, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "../../Context/Firebase";
import useLikePost from "../../Hooks/HandleLike";
import { useUser } from "../../Context/UserContext";
import { p } from "framer-motion/client";

function UserBlog() {
  const params = useParams();
  const id = params.id;
  const [data, setData] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const getAnonymousId = () => {
    const storedId = localStorage.getItem("anonymousId");
    if (storedId) return storedId;
    const newId = Math.floor(1000 + Math.random() * 9000);
    localStorage.setItem("anonymousId", newId);
    return newId;
  };

  const [anonymousId] = useState(getAnonymousId);
  const { currentUser } = useUser();

  useEffect(() => {
    if (currentUser) {
      const postsRef = collection(db, "Blogs");
      const q = query(postsRef);
      const unsubscribe = onSnapshot(q, (snapshot) => {
        snapshot.forEach((doc) => {
          if (doc.data().userId === currentUser.uid && doc.data().status !== "pending") {
            const message = doc.data().status === "declined"
              ? `Your post "${doc.data().title}" has been declined.`
              : `Your post "${doc.data().title}" has been approved and published!`;
            alert(message);
          }
        });
      });
      return () => unsubscribe();
    }
  }, [currentUser]);

  useEffect(() => {
    const q = query(collection(db, "Blogs"));
    const unsub = onSnapshot(q, (querySnapshot) => {
      const foundPost = querySnapshot.docs.find((doc) => doc.id === id)?.data();
      setData(foundPost ? { ...foundPost, id } : null);
    });
    return () => unsub();
  }, [id]);

  useEffect(() => {
    const commentsRef = collection(db, "Blogs", id, "Comments");
    const q = query(commentsRef, orderBy("timestamp", "asc"));
    const unsub = onSnapshot(q, async (snapshot) => {
      const comments = await Promise.all(
        snapshot.docs.map(async (doc) => {
          const commentData = doc.data();
          const displayName = await fetchUserRole(commentData.senderId);
          return { id: doc.id, displayName, ...commentData };
        })
      );
      setMessages(comments);
    });

    return () => unsub();
  }, [id]);

  const anonymousUsers = {};

  const fetchUserRole = async (userId) => {
    if (!userId) {
      return `Anonymous${anonymousId}`;
    }
    try {
      const userRef = doc(db, "Users", userId);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.isAdmin || userData.isSubAdmin) {
          return "Admin";
        } 
        if (!anonymousUsers[userId]) {
          anonymousUsers[userId] = Math.floor(1000 + Math.random() * 9000);
        }
        return `Anonymous ${anonymousUsers[userId]}`;
      }
    } catch (error) {
      console.error("Error fetching user role: ", error);
    }
    if (!anonymousUsers[userId]) {
      anonymousUsers[userId] = Math.floor(1000 + Math.random() * 9000);
    }
    return `Anonymous${anonymousUsers[userId]}`;
  };

  const date = data?.date ? new Date(data.date.seconds * 1000 + data.date.nanoseconds / 1e6) : null;
  const { likes, loading, likePost, fetchLikes } = useLikePost(data?.id, currentUser && currentUser.uid);

  useEffect(() => {
    fetchLikes();
  }, [fetchLikes]);

  const handleSendMessage = async () => {
    if (!currentUser) {
      alert("Login to comment");
      return;
    }

    const commentsRef = collection(db, "Blogs", id, "Comments");
    const q = query(commentsRef);
    const snapshot = await getDocs(q);
    
    const userComments = snapshot.docs.filter(doc => doc.data().senderId === (currentUser?.uid || anonymousId));

    if (userComments.length >= 5) {
      alert("You have reached the maximum comment limit (5) for this post.");
      return;
    }

    if (newMessage.trim()) {
      try {
        await addDoc(commentsRef, {
          text: newMessage,
          senderId: currentUser?.uid || anonymousId,
          timestamp: serverTimestamp(),
        });
        setNewMessage("");
      } catch (error) {
        console.error("Error posting comment: ", error);
      }
    }
  };

  const handleLike = () => {
    if (!currentUser) {
      alert("Login to like user content");
      return;
    }
    if (!likes?.includes(currentUser.uid)) likePost();
  };

  const handleDislike = () => {
    if (!currentUser) {
      alert("Login to dislike user content");
      return;
    }
    if (likes?.includes(currentUser.uid)) likePost();
  };

  const handleDeleteComment = async (commentId, senderId) => {
    if (!currentUser) {
      alert("You need to be logged in to delete a comment.");
      return;
    }

    const userRef = doc(db, "Users", currentUser.uid);
    const userSnap = await getDoc(userRef);
    const userData = userSnap.exists() ? userSnap.data() : {};

    const isAdminOrSubAdmin = userData.isAdmin || userData.isSubAdmin;
    const isCommentOwner = senderId === currentUser.uid;

    if (isAdminOrSubAdmin || isCommentOwner) {
      try {
        await deleteDoc(doc(db, "Blogs", id, "Comments", commentId));
        alert("Comment deleted successfully.");
      } catch (error) {
        console.error("Error deleting comment: ", error);
      }
    } else {
      alert("You can only delete your own comments.");
    }
  };

  return (
    <div className="userBlog">
      <Header />
      <div className="mid">
        <div className="userBlog-container">
          <div className="blogs-list" >
            {data && (
              <div key={data.id} className="blog-card">
                {data.image && <img src={data.image} alt="" />}
                <h2>{data.title}</h2>
                <p>{date?.toLocaleString()}</p>
                <p className="blog-text">{data.desc}</p>
                <div className="actions">
                  <button onClick={handleLike} disabled={loading || likes?.includes(currentUser.uid)}>
                    {likes?.includes(currentUser.uid) ? "Liked" : "Like"} ({likes?.length || 0})
                    <img src={like} alt="" />
                  </button>
                  <button onClick={handleDislike} disabled={loading || !likes?.includes(currentUser.uid)}>
                    {likes?.includes(currentUser.uid) ? "Disliked" : "Dislike"} ({likes?.length || 0})
                    <img style={{ transform: "rotateX(180deg)" }} src={like} alt="" />
                  </button>
                  <button onClick={() => setShowChat(!showChat)}>
                    {showChat ? "Close Comments" : "Open Comment Section"}
                  </button>
                </div>
              </div>
            )}
          </div>

          {showChat && (
  <div className="chat-container">
    <div className="chat-box">
      {messages.length > 0 ? (
        messages.map((msg) => (
          <div key={msg.id} className="message">
            <strong>{msg.displayName}</strong>: {msg.text}
            <br />
            <small style={{color:"#777"}}>{msg.timestamp?.toDate().toLocaleString()}</small>
            <div className="blog-delete-btn">
            <button className="delete-comment-btn" onClick={() => handleDeleteComment(msg.id, msg.senderId)}>🗑️</button>
            </div>
          </div>
        ))
      ) : (
        <p className="no-comments">Be the first to make comment!</p>
      )}
    </div>
    <div className="chat-input">
      <textarea maxLength={100} placeholder="Type a comment..." value={newMessage} onChange={(e) => setNewMessage(e.target.value)} />
      <button onClick={handleSendMessage}>Send</button>
    </div>
  </div>
)}

        </div>
      </div>
    </div>
  );
}

export default UserBlog;