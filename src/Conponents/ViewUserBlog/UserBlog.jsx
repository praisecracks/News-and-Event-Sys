// 


import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router";
import { doc, updateDoc, arrayUnion, arrayRemove, getDoc, onSnapshot, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../Context/Firebase";
import { useUser } from "../../Context/UserContext";
import { FaEdit, FaTrash } from "react-icons/fa";

function UserBlog() {
  const { id } = useParams();
  const { currentUser } = useUser();
  const [data, setData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSubAdmin, setIsSubAdmin] = useState(false);
  const [isCommentsDisabled, setIsCommentsDisabled] = useState(false);
  const anonymousUsers = useRef({});

  const getAnonymousId = () => {
    let storedId = localStorage.getItem("anonymousId");
    if (!storedId) {
      storedId = Math.floor(1000 + Math.random() * 9000);
      localStorage.setItem("anonymousId", storedId);
    }
    return storedId;
  };

  const [anonymousId] = useState(getAnonymousId);

  // Check if user is Admin/SubAdmin
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (currentUser) {
        const userRef = doc(db, "Users", currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          setIsAdmin(userData.isAdmin);
          setIsSubAdmin(userData.isSubAdmin);
        }
      }
    };
    checkAdminStatus();
  }, [currentUser]);

  // Fetch blog data
  useEffect(() => {
    const unsub = onSnapshot(doc(db, "Blogs", id), (docSnap) => {
      if (docSnap.exists()) {
        setData({ id: docSnap.id, ...docSnap.data() });
      } else {
        setData(null);
      }
    });
    return () => unsub();
  }, [id]);

  // Fetch comments data
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

  // Fetch user role for anonymous ID or logged-in user
  const fetchUserRole = async (userId) => {
    if (!userId) return `Anonymous ${anonymousId}`;
    try {
      const userRef = doc(db, "Users", userId);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.isAdmin || userData.isSubAdmin) return "Admin";
        return `Anonymous ${userId}`;
      }
    } catch (error) {
      console.error("Error fetching user role: ", error);
    }
    return `Anonymous ${userId}`;
  };

  // Handle like/unlike functionality
  const handleLike = async () => {
    if (!currentUser) {
      alert("Login to like this post");
      return;
    }
    const postRef = doc(db, "Blogs", id);
    await updateDoc(postRef, {
      likes: likes?.includes(currentUser.uid)
        ? arrayRemove(currentUser.uid)
        : arrayUnion(currentUser.uid),
    });
  };

  // Handle sending a new message (comment)
  const handleSendMessage = async () => {
    if (!currentUser) {
      alert("Login to comment");
      return;
    }

    if (newMessage.trim()) {
      const commentsRef = collection(db, "Blogs", id, "Comments");
      await addDoc(commentsRef, {
        text: newMessage,
        senderId: currentUser?.uid || anonymousId,
        timestamp: serverTimestamp(),
      });
      setNewMessage("");
    }
  };

  // Handle toggling the comment section visibility
  const handleCommentToggle = () => {
    setIsCommentsDisabled((prevState) => !prevState);
  };

  return (
    <div className="userBlog">
      <Header />
      <div className="mid">
        <div className="userBlog-container">
          <div className="blogs-list">
            {data && (
              <div key={data.id} className="blogcard">
                <h2>{data.title}</h2>
                <p>{date?.toLocaleString()}</p>
                <p className="blogText" dangerouslySetInnerHTML={{ __html: data.desc }}></p>
                <div className="actions">
                  <button onClick={handleLike}>
                    {likes?.includes(currentUser.uid) ? "Liked" : "Like"}
                  </button>
                  <button onClick={handleSendMessage}>
                    Comment
                  </button>
                </div>
              </div>
            )}
          </div>

          {showChat && !isCommentsDisabled && (
            <div className="chat-container">
              <div className="chat-box">
                {messages.length > 0 ? (
                  messages.map((msg) => (
                    <div key={msg.id} className="message">
                      <strong>{msg.displayName}</strong>: {msg.text}
                      <br />
                      <small>{msg.timestamp?.toDate().toLocaleString()}</small>
                    </div>
                  ))
                ) : (
                  <p className="no-comments">Be the first to make a comment!</p>
                )}
              </div>
              <div className="chat-input">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your comment..."
                />
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
