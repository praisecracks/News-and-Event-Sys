import "./Create.css";
import deleteImg from "../../Asset/delete.svg";
import createImg from "../../Asset/gallery.svg";
import defaultImage from "../../Asset/Book study.jpg";
import { useState, useRef, useEffect } from "react";
import Header from "../../Containers/Header/Header";
import { addDoc, collection, updateDoc, doc } from "firebase/firestore";
import { db } from "../../Context/Firebase";
import { useUser } from "../../Context/UserContext";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import ReactQuill from "react-quill"; // Import ReactQuill
import "react-quill/dist/quill.snow.css"; // Import the necessary styles

function Create() {
  const [imageURL, setImage] = useState(null);
  const [isDefaultImage, setIsDefaultImage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [blogTitle, setBlogTitle] = useState("");
  const { currentUser } = useUser();
  const navigate = useNavigate();
  const [File, setSelectedFile] = useState(null);
  const [blogId, setBlogId] = useState(null); // State for the blog ID if editing
  const location = useLocation(); // To get the current path
  const [blogContent, setBlogContent] = useState(""); // Blog content state

  useEffect(() => {
    // Check if we are editing a blog and fetch data if needed
    if (location.state?.blogId) {
      setBlogId(location.state.blogId);
      // Fetch the blog details and set it
      // Example: fetchBlogDetails(blogId)
    }
  }, [location]);

  const handleRemoveImage = () => {
    setImage(null);
    setSelectedFile(null);
    setIsDefaultImage(false);
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
    if (!File) return isDefaultImage ? defaultImage : null;
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

  const handleUploadBlog = async () => {
    setIsLoading(true);
    const imageUrl = await handleImageUpload();

    try {
      if (!blogTitle.trim()) {
        toast.error("Title is required");
        setIsLoading(false);
        return;
      }

      if (!blogContent.trim()) {
        toast.error("Content cannot be empty");
        setIsLoading(false);
        return;
      }

      const form = {
        image: imageUrl || null,
        title: blogTitle,
        authId: currentUser?.uid || "unknown",
        desc: blogContent,  // Store the rich-text content
        likes: [],
        date: new Date(),
        isVerified: false,
      };

      if (blogId) {
        // If updating, use updateDoc
        const blogRef = doc(db, "Blogs", blogId);
        await updateDoc(blogRef, form);
        toast.success("Blog updated successfully!");
      } else {
        // If creating a new blog
        await addDoc(collection(db, "Blogs"), form);
        toast.success("Blog uploaded successfully!");
      }

      navigate("/"); // Navigate back to home or list of blogs
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
                  <label>Remove</label>
                </div>
              </div>

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
              <textarea
                id="title"
                onChange={(e) => setBlogTitle(e.target.value)}
                value={blogTitle}
              ></textarea>

              <label>Content Blog</label>

              {/* ReactQuill for rich text editing */}
              <ReactQuill
                value={blogContent}
                onChange={(content) => setBlogContent(content)}
                theme="snow"
                modules={{
                  toolbar: [
                    ['bold', 'italic', 'underline', 'link'],
                    [{ list: 'ordered' }, { list: 'bullet' }],
                    ['image'],
                  ],
                }}
              />

              <button onClick={handleUploadBlog}>
                {isLoading ? "Loading..." : blogId ? "Update" : "Publish"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Create;
