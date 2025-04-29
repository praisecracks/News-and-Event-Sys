import "./EditBlog.css";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db } from "../../Context/Firebase";
import backImg from "../../Asset/arrow_back.svg";
import blog from "../../Asset/Book study.jpg";
import ReactQuill from "react-quill"; // Import Quill
import "react-quill/dist/quill.snow.css"; // Import Quill CSS for the snow theme

function Edit() {
  const [userData, setUserData] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlog = async () => {
      const docRef = doc(db, "Blogs", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setUserData(docSnap.data());
      } else {
        console.log("No such document!");
      }
    };
    fetchBlog();
  }, [id]);

  const handlePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setUserData((prev) => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);

    try {
      const docRef = doc(db, "Blogs", id);

      if (imageFile) {
        const storage = getStorage();
        const storageRef = ref(storage, `blog-images/${id}`);
        await uploadBytes(storageRef, imageFile);
        const imageUrl = await getDownloadURL(storageRef);

        await updateDoc(docRef, { ...userData, image: imageUrl });
      } else {
        await updateDoc(docRef, userData);
      }

      alert("Changes saved successfully!");
      navigate(-1);
    } catch (error) {
      console.error("Error saving changes:", error);
      alert("Failed to save changes.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <div className="topSection">
        <div className="Leave">
          <img src={backImg} alt="" onClick={() => navigate(-1)} />
          <button onClick={handleSaveChanges} disabled={isSaving}>
            {isSaving ? "Saving Content..." : "Save Changes"}
          </button>
        </div>

        <div className="edit-container">
          <div className="image-edit">
            <img src={userData.image || blog} alt="" />
            <input
              type="file"
              name="file"
              id="file"
              accept="image/*"
              onChange={handlePictureChange}
              style={{ display: "none" }}
            />
            <button style={{ outline: "none", cursor: "pointer", color: "White", backgroundColor: "#0077cc"}}>
              <label htmlFor="file">Change Image</label>
            </button>
          </div>

          <div className="blog-edit">
            <div className="blog-body">
              <h2>Edit Title</h2>
              <input
                type="text"
                value={userData.title || ""}
                onChange={(e) => setUserData((prev) => ({ ...prev, title: e.target.value }))}
              />
              <h2>Edit Text</h2>
              <ReactQuill
                value={userData.desc || ""}
                onChange={(content) => setUserData((prev) => ({ ...prev, desc: content }))}
                theme="snow"
                modules={{
                  toolbar: [
                    ['bold', 'italic', 'underline', 'link'],
                    [{ list: 'ordered' }, { list: 'bullet' }],
                    ['image'],
                  ],
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Edit;
