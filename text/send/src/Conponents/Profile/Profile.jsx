import { useEffect, useState } from "react";
import "./Profile.css";
import back from '../../Asset/upload.svg'
import profileImg from '../../Asset/profile.svg'
import del from "../../Asset/delete.svg"
import logout from '../../Asset/logout.svg'
import save from '../../Asset/save.svg'
import Settings from '../../Asset/Setting.svg'
import { Link } from "react-router-dom";
import { Users } from "../../Context/data";
import { useUser } from "../../Context/UserContext";
import { EmailAuthProvider, getAuth, reauthenticateWithCredential, updateProfile } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { toast } from "react-toastify";
import { db } from "../../Context/Firebase";
function Profile() {
  const { currentUser } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [Data, setData] = useState();

  useEffect(() => {
    setIsLoading(true);
    const displayBlogs = async () => {
      try {
        const users = await Users
        console.log(users)
        setData(users)
      }
      catch (error) {
        console.log(error)
      }
    }
    setIsLoading(false);
    return () => displayBlogs();
  }, []);

  const data = Data?.filter(function (e) {
    return e.uid === currentUser && currentUser.uid;
  });
  console.log(currentUser)

  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    name: currentUser?.displayName,
    email: currentUser?.email,
    password: "",
    profilePicture: profileImg,
  });

  const handleEditToggle = () => setIsEditing((prev) => !prev);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setUserData((prev) => ({ ...prev, profilePicture: reader.result }));
      };
      reader.readAsDataURL(file);
    }

    const storage = getStorage();
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      toast.error('No user is signed in.');
      return;
    }

    const storageRef = ref(storage, `profile_pictures/${user.uid}/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
      },
      (error) => {
        console.log(error);
        toast.error('Error');
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          updateProfile(user, { photoURL: downloadURL })
            .then(() => {
              toast.success("profile uploaded")
            })
            .catch((error) => {
              console.log(error);
            });
        });
      }
    );
  };

  const handleDeletePicture = () => {
    setUserData((prev) => ({
      ...prev,
      profilePicture: "https://via.placeholder.com/150",
    }));
   };

  const handleSave =  async () => {
    DName=userData.name
    // Perform save operation (e.g., send data to the backend)
    console.log(userData.name)
    if (userData.name !== currentUser?.displayName) {
      await updateProfile(currentUser, { DName });
      await updateDoc(doc(db, "Users", currentUser?.uid), {
        name: DName,
      });
      setIsEditing(false);
    }

    alert("Profile updated successfully!");
  };

  const handleDeleteAccount = async () => {
    const Password = window.prompt("Enter password to delete account")
    console.log(Password)
    const user = currentUser;

    if (user) {
      try {
        // Password verification before deletion
        const credential = EmailAuthProvider.credential(user.email, Password);
        await reauthenticateWithCredential(user, credential); // Reauthenticate user
        await UpdateUserStatus()
        // Proceed with account deletion
        await user.delete();
        console.log('Account deleted successfully');
        alert("Account Deleted redirecting..")
        navigate("/")
      } catch (error) {
        console.error('Error deleting account:', error.message);
        alert(error.message)
      }
    } else {
      setError('User not authenticated.');
    }


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
          <img className="gg" src={userData.profilePicture} alt="Profile" />
          {isEditing && (
            <>
              <label htmlFor="file">Upload Image  <img src={back} alt="" /></label>
              <input
                type="file"
                id="file"
                accept="image/*"
                onChange={handlePictureChange}
                className="file-input"
              />
              <button
                type="button"
                onClick={handleDeletePicture}
                className="delete-picture-button"
              >
                Remove Image
                <img src={del} alt="" />
              </button>
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

              <button className="save-button" onClick={handleSave}>
                Save
                <img src={save} alt="" />
              </button>
            </>
          ) : (
            <div>
              <h1 className="profile-name">{userData.name}</h1>
              <p className="profile-email">{userData.email}</p>
              <button className="edit-button" onClick={handleEditToggle}>
                Edit Profile
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="profile-details">
        <h2>Profile Details</h2>
        <ul>
          <li>
            <strong>UserName:</strong> {currentUser?.displayName}
          </li>
          <li>
            <strong>Email:</strong> {currentUser?.email}
          </li>
          <li>
            <strong>Joined:</strong> January 2022
          </li>
        </ul>
      </div>
      <div className="profile-actions">
        <button className="delete-button" onClick={handleDeleteAccount}>
          Delete Account
          <img src={del} alt="" />
        </button>
        <button className="logout-button">Log Out  <img src={logout} alt="" /></button>
        <Link to="/setting" className="logout-button">
          More settings  <img src={Settings} alt="" />
        </Link>

      </div>
    </div>
  );
}

export default Profile;
