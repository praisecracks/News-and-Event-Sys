import "./Create.css";
// import userPost from "../Images/a.jpg";
import deleteImg from "../../Asset/delete.svg";
import createImg from "../../Asset/gallery.svg";
import defaultImage from "../../Asset/Book study.jpg"; // Import the default image
import { useState } from "react";
import Header from "../../Containers/Header/Header";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../Context/Firebase";
import { useUser } from "../../Context/UserContext";
import { toast } from "react-toastify";


function Create() {
  const [image, setImage] = useState(null); // State for uploaded image
  const [isLoading, setIsLoading] = useState(false);
  const [blogText, setBlogText] = useState("")
  const [blogTitle, setBlogTitle] = useState("")
  // Handle image upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result); // Update the image state
      };
      reader.readAsDataURL(file); // Convert the file to base64
    }
  };

  const { currentUser } = useUser();


  // Handle image removal
  const handleRemoveImage = () => {
    setImage(null); // Reset the image state
  };

  const HandleUploadBlog = async () => {
    setIsLoading(true);

    const form = {
      image,
      title: blogTitle,
      authId: currentUser.uid,
      // authId: 222,
      desc: blogText,
      likes: [],
      date: new Date(),
      isVerified: false,
    }

    try {
      // console.log(form.image)
      if (!form.image || !form.title) {
        toast.error("all fields are reuired");
      }
      else {
        await addDoc(collection(db, "Blogs"), { form });
      }
      setIsLoading(false);

    } catch (error) {
      console.log(error.message)
    }
  }

  return (
    <div className="Create-container">
      <Header />
      <div className="Create">
        <div className="full-container">
          <div className="real-container">
            <div className="img-container">
              {/* Display uploaded or default image */}
              <div className="sides">

                <img
                  src={image || defaultImage}
                  alt="Uploaded Preview"
                  className="preview-img"
                />
              </div>

              {/* Upload button */}
              <div className="sides">

                <div className="choose-file">
                  <label htmlFor="file">Add Image</label>
                  <img src={createImg} alt="Upload Icon" />
                  {/* <button> */}

                  <input
                    type="file"
                    id="file"
                    accept="image/*"
                    onChange={handleImageUpload} // Attach handler
                  />
                  {/* </button> */}
                </div>
                <div className="choose-file">
                  <label onClick={handleRemoveImage}>Remove</label>
                  <img src={deleteImg} alt="Delete Icon" />
                </div>
              </div>

            </div>

            {/* Remove button */}

            {/* Input fields */}

            <div className="input-field">
              <label htmlFor="title">Content Title</label>
              <br />
              <textarea id="title" onChange={(e) => setBlogTitle(e.target.value)} ></textarea>
              <br />
              <label htmlFor="content">Content Blog</label>
              <br />
              <textarea id="content" onChange={(e) => setBlogText(e.target.value)}></textarea>
              <button onClick={HandleUploadBlog} >{isLoading ? "Loading" : "Publish"}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Create;
