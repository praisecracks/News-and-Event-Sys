<<<<<<< HEAD
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
=======
import { useState, useRef } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../Context/Firebase";
import { useUser } from "../../Context/UserContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import defaultImage from "../../Asset/Book study.jpg";
import Header from "../../Containers/Header/Header";

function Create() {
  const [imageURL, setImageURL] = useState(null);
  const [isDefaultImage, setIsDefaultImage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [blogTitle, setBlogTitle] = useState("");
  const [blogText, setBlogText] = useState("");
  const [file, setFile] = useState(null);
  const { currentUser } = useUser();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = () => setImageURL(reader.result);
      reader.readAsDataURL(selectedFile);
      setIsDefaultImage(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      const reader = new FileReader();
      reader.onload = () => setImageURL(reader.result);
      reader.readAsDataURL(droppedFile);
      setIsDefaultImage(false);
>>>>>>> origin/main
    }
  };

  const handleImageUpload = async () => {
<<<<<<< HEAD
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
=======
    if (!file) return isDefaultImage ? defaultImage : null;

    const storage = getStorage();
    const storageRef = ref(storage, `blogs/${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    return await getDownloadURL(snapshot.ref);
>>>>>>> origin/main
  };

  const handleUploadBlog = async () => {
    setIsLoading(true);
<<<<<<< HEAD
    const imageUrl = await handleImageUpload();
=======
>>>>>>> origin/main

    try {
      if (!blogTitle.trim()) {
        toast.error("Title is required");
        setIsLoading(false);
        return;
      }

<<<<<<< HEAD
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
=======
      const imageUrl = await handleImageUpload();

      const blog = {
        image: imageUrl || null,
        title: blogTitle,
        authId: currentUser?.uid || "unknown",
        authorImg: currentUser?.photoURL || null,
        desc: blogText,
>>>>>>> origin/main
        likes: [],
        date: new Date(),
        isVerified: false,
      };

<<<<<<< HEAD
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
=======
      await addDoc(collection(db, "Blogs"), blog);
      toast.success("Uploaded! Wait for admin verification.");
      navigate("/");
    } catch (error) {
      console.error(error.message);
>>>>>>> origin/main
      toast.error("Failed to upload blog. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
<<<<<<< HEAD
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
=======
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-700">Create a New Blog</h1>

        {/* Drag and Drop Area */}
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center bg-white cursor-pointer hover:border-indigo-400 transition"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => fileInputRef.current.click()}
        >
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />

          {imageURL || isDefaultImage ? (
            <img
              src={imageURL || defaultImage}
              alt="Selected Preview"
              className="h-60 w-full object-cover rounded-md mb-4"
            />
          ) : (
            <div className="flex flex-col items-center">
              <svg
                className="w-12 h-12 text-gray-400 mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0H3m4 0h4m1 16h6m-3-6h2a2 2 0 002-2V4a2 2 0 00-2-2h-2m-3 6H4a2 2 0 00-2 2v10a2 2 0 002 2h6a2 2 0 002-2v-6z" />
              </svg>
              <p className="text-gray-500">Drag & Drop or Click to upload an image</p>
            </div>
          )}

          {/* Default Image Checkbox */}
          <div className="mt-4 flex items-center space-x-2">
            <input
              type="checkbox"
              checked={isDefaultImage}
              onChange={(e) => setIsDefaultImage(e.target.checked)}
              className="form-checkbox h-4 w-4 text-indigo-600"
            />
            <label className="text-gray-600 text-sm">Use Default Image</label>
          </div>
        </div>

        {/* Blog Form */}
        <div className="mt-8 bg-white p-8 rounded-lg shadow-md space-y-6">
          <div>
            <label htmlFor="title" className="block text-gray-700 font-semibold mb-2">
              Content Title
            </label>
            <input
              id="title"
              type="text"
              value={blogTitle}
              onChange={(e) => setBlogTitle(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Enter your blog title..."
            />
          </div>

          <div>
            <label htmlFor="content" className="block text-gray-700 font-semibold mb-2">
              Blog Content
            </label>
            <textarea
              id="content"
              rows="8"
              value={blogText}
              onChange={(e) => setBlogText(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
              placeholder="Write your blog content here..."
            ></textarea>
          </div>

          <button
            onClick={handleUploadBlog}
            disabled={isLoading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-md transition"
          >
            {isLoading ? "Publishing..." : "Publish Blog"}
          </button>
        </div>
>>>>>>> origin/main
      </div>
    </div>
  );
}

export default Create;
