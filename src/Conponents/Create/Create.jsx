import "./Create.css";
import deleteImg from "../../Asset/delete.svg";
import createImg from "../../Asset/gallery.svg";
import defaultImage from "../../Asset/Book study.jpg"; 
import { useState } from "react";
import Header from "../../Containers/Header/Header";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../Context/Firebase";
import { useUser } from "../../Context/UserContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

function Create() {
  const [imageURL, setImage] = useState(null); // Start with no image selected
  const [isDefaultImage, setIsDefaultImage] = useState(false); // To toggle default image
  const [isLoading, setIsLoading] = useState(false);
  const [blogText, setBlogText] = useState("");
  const [blogTitle, setBlogTitle] = useState("");
  const [File, setSelectedFile] = useState(null);
  const { currentUser } = useUser();
  const navigate = useNavigate();

  const handleRemoveImage = () => {
    setImage(null);
    setSelectedFile(null);
    setIsDefaultImage(false); // Ensure the default image isn't used
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = async () => {
    if (!File) return isDefaultImage ? defaultImage : null; // Only upload default if explicitly enabled

    const storage = getStorage();
    const storageRef = ref(storage, `blogs/${File.name}`);
    try {
      const snapshot = await uploadBytes(storageRef, File);
      return await getDownloadURL(snapshot.ref);
    } catch (error) {
      console.error("Error uploading image:", error);
      throw new Error("Image upload failed");
    }
  };

  const HandleUploadBlog = async () => {
    setIsLoading(true);
    const imageUrl = await handleImageUpload();

    try {
      if (!blogTitle) {
        toast.error("Title is required");
        setIsLoading(false);
        return;
      }

      const form = {
        image: imageUrl || null, // Image may be null if none selected
        title: blogTitle,
        authId: currentUser?.uid || "unknown",
        desc: blogText,
        likes: [],
        date: new Date(),
        isVerified: false,
      };

      await addDoc(collection(db, "Blogs"), form);
      toast.success("Blog uploaded successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error uploading blog:", error.message);
      toast.error("Failed to upload blog. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="Create-container">
      <Header />
      <div className="Create">
        <div className="full-container">
          <div className="real-container">
            <div className="img-container">
              <p style={{ paddingTop: "50px" }}>
                The Image is optional; you can remove it.
              </p>
              <div className="slides">
                <img
                  src={imageURL || (isDefaultImage && defaultImage)}
                  alt="Preview"
                  className="preview-img"
                />
              </div>

              <div className="sides">
                <div onChange={handleFileChange} className="choose-file">
                  <img src={createImg} alt="Upload Icon" />
                  <label htmlFor="file">Add Image</label>
                  <input type="file" id="file" accept="image/*" onChange={handleFileChange} />
                </div>
                <div className="choose-file" onClick={handleRemoveImage}>
                  <img src={deleteImg} alt="Delete Icon" />
                  <label >Remove</label>
                </div>
              </div>

              {/* Option to Use Default Image */}
              <div className="choose-file">
                <label>
                  <input
                    type="checkbox"
                    checked={isDefaultImage}
                    onChange={(e) => setIsDefaultImage(e.target.checked)}
                  />
                  Use Default Image
                </label>
              </div>
            </div>

            <div className="input-fields">
              <label htmlFor="title">Content Title</label>
              <textarea id="title" onChange={(e) => setBlogTitle(e.target.value)}></textarea>
              <label htmlFor="content">Content Blog</label>
              <textarea id="content" onChange={(e) => setBlogText(e.target.value)}></textarea>
              <button onClick={HandleUploadBlog}>{isLoading ? "Loading..." : "Publish"}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Create;
