import { useEffect, useState } from "react";
import "./Profile.css";
import back from '../../Asset/upload.svg';
import profileImg from '../../Asset/profile.svg';
import del from "../../Asset/delete.svg";
import logout from '../../Asset/logout.svg';
import save from '../../Asset/save.svg';
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../../Context/UserContext"; 
import { EmailAuthProvider, getAuth, reauthenticateWithCredential, signOut, updateProfile } from 'firebase/auth';
import { collection, doc, onSnapshot, query, updateDoc, getDoc } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { toast } from "react-toastify";
import { auth, db } from "../../Context/Firebase";

function Profile() {
  const { currentUser } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [User, setUser] = useState(null);
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [notifications, setNotifications] = useState({ email: false, push: false });

  const [darkMode, setDarkMode] = useState(false); // 🌙 dark mode state

  useEffect(() => {
    setIsLoading(true);

    const userRef = doc(db, "Users", currentUser?.uid);
    const unsubscribe = onSnapshot(userRef, (docSnap) => {
      if (docSnap.exists()) {
        setUser(docSnap.data());
        setNotifications({
          email: docSnap.data().emailNotifications || false,
          push: docSnap.data().pushNotifications || false
        });
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser?.uid]);

  // 🔁 Apply dark mode class
  useEffect(() => {
    document.body.classList.toggle('dark-mode', darkMode);
  }, [darkMode]);

  const handleDarkModeToggle = () => {
    setDarkMode(prev => !prev);
  };

  const handleEditToggle = () => setIsEditing((prev) => !prev);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNotificationChange = async (type) => {
    const updatedNotifications = { ...notifications, [type]: !notifications[type] };
    setNotifications(updatedNotifications);

    try {
      const userRef = doc(db, "Users", currentUser?.uid);
      await updateDoc(userRef, {
        emailNotifications: updatedNotifications.email,
        pushNotifications: updatedNotifications.push
      });
      toast.success("Notification settings updated!");
    } catch (error) {
      console.error("Error updating notifications:", error);
      toast.error("Failed to update notifications.");
    }
  };

  const [userData, setUserData] = useState({
    name: currentUser?.displayName,
    email: currentUser?.email,
    profilePicture: currentUser?.photoURL || profileImg,
  });

  const handlePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const storage = getStorage();
      const user = auth.currentUser;

      if (!user) {
        toast.error('No user is signed in.');
        return;
      }

      const storageRef = ref(storage, `profile_pictures/${user.uid}/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        'state_changed',
        () => {},
        (error) => {
          console.log(error);
          toast.error('Error uploading the image.');
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            updateProfile(user, { photoURL: downloadURL })
              .then(async () => {
                await auth.currentUser.reload();
                setUserData((prev) => ({ ...prev, profilePicture: auth.currentUser.photoURL }));
                toast.success("Profile picture updated successfully!");
              })
              .catch((error) => {
                console.log(error);
                toast.error("Failed to update profile picture.");
              });
          });
        }
      );
    }
  };

  const handleDeletePicture = () => {
    setUserData((prev) => ({
      ...prev,
      profilePicture: profileImg,
    }));
  };

  const handleSave = async () => {
    try {
      const user = auth.currentUser;

      if (userData.name !== currentUser?.displayName) {
        await updateProfile(user, { displayName: userData.name });
        await updateDoc(doc(db, "Users", user.uid), { name: userData.name });
      }

      if (userData.email !== currentUser?.email) {
        const password = window.prompt("Please confirm your password to change email:");

        if (password) {
          const credential = EmailAuthProvider.credential(currentUser.email, password);
          await reauthenticateWithCredential(user, credential);

          await user.updateEmail(userData.email);
          await updateDoc(doc(db, "Users", user.uid), { email: userData.email });

          toast.success("Email updated successfully!");
        } else {
          toast.info("Email change cancelled.");
        }
      }

      await user.reload();
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile. " + error.message);
    }
  };

  const handleDeleteAccount = async () => {
    const Password = window.prompt("Enter password to delete account");
    const user = currentUser;
    if (user) {
      try {
        const credential = EmailAuthProvider.credential(user.email, Password);
        await reauthenticateWithCredential(user, credential);
        await user.delete();
        toast.success("Account Deleted. Redirecting...");
        navigate("/");
      } catch (error) {
        console.error('Error deleting account:', error.message);
        toast.error(error.message);
      }
    }
  };

  const handleLogOut = async () => {
    await signOut(auth);
    navigate("/");
  };

  return (
    <div className="profile-container">
      <div className="goBack">
        <nav>
          <ul>
            <li>
              <Link to="/home">Home</Link>
            </li>
          </ul>
        </nav>
      </div>

      <div className="profile-header">
        <div className="profile-picture">
          <div className="profile-img-body">
            <img className="gg" src={userData.profilePicture} alt="Profile" />
          </div>

          {isEditing && (
            <>
              <label htmlFor="file">Upload Image <img src={back} alt="" /></label>
              <input type="file" id="file" accept="image/*" onChange={handlePictureChange} className="file-input" />
              <button onClick={handleDeletePicture} className="delete-picture-button"><img src={del} alt="" />Remove Image </button>
            </>
          )}
        </div>

        <div className="profile-info">
          {isEditing ? (
            <>
              <input
                type="text"
                name="name"
                value={userData.name}
                onChange={handleInputChange}
                placeholder="Name"
                className="input-field"
              />
              <input
                type="email"
                name="email"
                value={userData.email}
                onChange={handleInputChange}
                placeholder="Email"
                className="input-field"
              />
              <button onClick={handleSave} className="save-button"><img src={save} alt="" />Save</button>
            </>
          ) : (
            <div className="profile-user">
              <div className="profiler">
                <h1 className="profile-name">{userData.name}</h1>
                <p className="profile-email">{userData.email}</p>
              </div>
              <button onClick={handleEditToggle} className="edit-button">Edit Profile</button>
            </div>
          )}
        </div>
      </div>

      <div className="profile-details">
        <h2>Profile Details</h2>
        <ul>
          <li><strong>UserName:</strong> {currentUser?.displayName}</li>
          <li><strong>Email:</strong> {currentUser?.email}</li>
          <li><strong>Joined:</strong> <span>{new Date(User?.RegisteredTime).toLocaleString()}</span></li>
        </ul>
      </div>

      <div className="sectional">
        <h2>Notification Settings</h2>
        <label>
          <input type="checkbox" checked={notifications.email} onChange={() => handleNotificationChange("email")} />
          Enable Email Notifications
        </label>
        <br />
        <label>
          <input type="checkbox" checked={notifications.push} onChange={() => handleNotificationChange("push")} />
          Enable Push Notifications
        </label>
      </div>

      {/* ✅ Dark mode toggle button */}
      <div className="moder">
        <button onClick={handleDarkModeToggle}>{darkMode ? 'Light Mode' : 'Dark Mode'}</button>
      </div>

      <div className="profile-actions">
        <button onClick={handleDeleteAccount} className="delete-button"><img src={del} alt="" />Delete</button>
        <button onClick={handleLogOut} className="logout-button"><img src={logout} alt="" />Log out</button>
      </div>
    </div>
  );
}

export default Profile;
