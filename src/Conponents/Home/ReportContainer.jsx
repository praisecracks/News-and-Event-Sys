<<<<<<< HEAD
import { useEffect, useState } from "react";
import prof from "../../Asset/profileFilled.svg";
import { truncate } from "../../Context/data"; 
import { Link } from "react-router-dom";
import { db } from "../../Context/Firebase";
import { collection, onSnapshot, query, doc, getDoc } from "firebase/firestore";
import { auth } from "../../Context/Firebase"; 

function ReportContainer() {
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState([]); 
    const [userRole, setUserRole] = useState(null); 
    const [isRoleLoading, setIsRoleLoading] = useState(true);

    useEffect(() => {
        const user = auth.currentUser;
    
        console.log("Current User: ", user);
    
        if (user) {
            const userRef = doc(db, "Users", user.uid);
            getDoc(userRef).then((docSnap) => {
                if (docSnap.exists()) {
                    const userData = docSnap.data();
                    console.log("Fetched User Data:", userData);
    
                    if (userData.admin === true) {
                        setUserRole("Admin");
                    } else if (userData.subAdmin === true) {
                        setUserRole("SubAdmin");
                    } else {
                        setUserRole("User"); // Regular user
                    }
    
                } else {
                    console.log("No user data found in Firestore.");
                    setUserRole("Invalid Role");
                }
                setIsRoleLoading(false);
            }).catch((error) => {
                console.error("Error fetching user role: ", error);
                setUserRole("Invalid Role");
                setIsRoleLoading(false);
            });
        } else {
            console.log("No user is logged in");
            setUserRole("Invalid Role");
            setIsRoleLoading(false);
        }
    }, []);
    

    useEffect(() => {
        const q = query(collection(db, "Blogs"));
        const unsub = onSnapshot(q, (querySnapshot) => {
            const streamArray = [];
            querySnapshot.forEach((doc) => {
                streamArray.push({ ...doc.data(), id: doc.id });
            });

            // Sort blogs by the date field in descending order to show the newest first
            const sortedBlogs = streamArray.sort((a, b) => b.date - a.date); 

            setData(sortedBlogs);
            setIsLoading(false);
        });

        return () => unsub();
    }, []);

    const allBlogs = data.filter((e) => e.isVerified === true);

    return (
        <div>
            {isLoading ? (
                <div>Loading ...</div>
            ) : (
                <div className="report-container">
                    {allBlogs && allBlogs.length > 0 ? (
                        allBlogs.map((blogData) => (
                            <div key={blogData.id} className="reports">
                                <div className="report">
                                    {isRoleLoading ? (
                                        <div>Loading Role...</div>
                                    ) : (
                                        <>
                                            {/* Safe logging */}
                                            {console.log("User Role: ", userRole)}

                                            {/* Role Display */}
                                            {userRole === "Admin" ? (
                                                <h3>Admin</h3>
                                            ) : userRole === "Sub Admin" ? (
                                                <h3>Sub Admin</h3>
                                            ) : userRole === "Student" ? (
                                                <h3>Student</h3>
                                            ) : (
                                              <></>
                                            )}
                                        </>
                                    )}

                                    {/* News Image or Placeholder */}
                                    {blogData.image ? (
                                        <img className="report-imgg" src={blogData.image} alt="News" />
                                    ) : (
                                        <div className="news-only">
                                            <h1 style={{ textAlign: "center" }}>DU Local News</h1>
                                            <p>Image isn't available for this news.</p>
                                        </div>
                                    )}

                                    <div className="home-blog-text">
                                        <h1>{truncate(blogData.title, 20)}</h1>  
                                        <p className="clamped-desc"
                                        dangerouslySetInnerHTML={{
                                            __html: truncate(blogData.desc, 100),
                                        }}
                                        />
                                        <Link to={`/blog/${blogData.id}`}>
                                        <button className="readmorebutton">
                                            Read More
                                        </button>
                                        </Link>
                                    </div>

                                    {/* Review Section */}
                                    <div className="review">
                                        <div className="like">
                                            {blogData.likes?.length || 0} Likes
                                        </div>
                                        <div className="like">
                                            {blogData.dislikes?.length || 0} Dislikes
                                        </div>
                                        <div className="like">
                                            {blogData.comments?.length || 0} Comments
                                        </div>

                                        {/* Navigate to User Profile */}
                                        <Link to={`/profile/${blogData.userId || 'undefined'}`}>
                                            <img className="r" src={prof} alt="User Profile" />
                                        </Link>
                                    </div>
=======
/* eslint-disable react/no-unescaped-entities */
import { useEffect, useState } from "react";
import prof from "../../Asset/profileFilled.svg";
import { truncate } from "../../Context/data";
import { Link } from "react-router-dom";
import { db } from "../../Context/Firebase";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";

function ReportContainer() {
    const [isLoading, setIsLoading] = useState(false);
    const [Data, setData] = useState([]);



    useEffect(() => {
        setIsLoading(true);
        const q = query(collection(db, "Blogs"));
    
        const unsub = onSnapshot(q, (querySnapshot) => {
            const StreamArray = [];
            querySnapshot.forEach((doc) => {
                StreamArray.push({ ...doc.data(), id: doc.id });
            });
    
            // Sort by date descending (newest first)
            StreamArray.sort((a, b) => {
                if (a.date && b.date) {
                    return b.date.toDate() - a.date.toDate(); // Firestore Timestamp to JS Date
                }
                return 0;
            });
    
            setData(StreamArray);
            console.log(StreamArray);
            setIsLoading(false);
        });
    
        return () => unsub();
    }, []);
    
    

    const AllBlogs = Data.filter((e) => e.isVerified === true);

    return (
        <div className="w-full px-4 py-8 mt-[50px]">
            {isLoading ? (
                <div className="flex justify-center items-center min-h-[50vh] text-gray-500 text-lg">
                    Loading...
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {AllBlogs && AllBlogs.length > 0 ? (
                        AllBlogs.map((data) => (
                            <div
                                key={data.id}
                                className="bg-white shadow-md rounded-lg overflow-hidden flex flex-col"
                            >
                                {/* Image Section */}
                                {data.image ? (
                                    <img
                                        src={data.image}
                                        alt="Blog Cover"
                                        className="h-[16rem] w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-[16rem] bg-gray-100 text-gray-700 p-4 text-center">
                                        <h1 className="font-bold text-xl mb-2">DU Local News</h1>
                                        <p className="text-sm">Image isn't available for this news.</p>
                                    </div>
                                )}

                                {/* Blog Text Content */}
                                <div className="flex flex-col flex-grow p-4">
                                    <h1 className="font-semibold text-lg mb-2 text-gray-800">
                                        {truncate(data.title, 20)}
                                    </h1>
                                    <p className="text-gray-600 mb-4 flex-grow">
                                        {truncate(data.desc, 100)}
                                    </p>

                                    <Link to={`/blog/${data.id}`} className="w-full">
                                        <button className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition">
                                            Read More
                                        </button>
                                    </Link>
                                </div>

                                {/* Review Section */}
                                <div className="flex items-center justify-between border-t p-4  bg-gray-200 text-gray-700 text-sm">
                                    <div className="flex gap-2">
                                        <span>{data.likes?.length || 0} Likes</span>
                                        <span>{data.dislikes?.length || 0} Dislikes</span>
                                        <span>{data.comments?.length || 0} Comments</span>
                                    </div>
                                    <Link to={`/profile/${data.userId || 'undefined'}`}>
                                        <img
                                            src={data?.authorImg || prof}
                                            alt="User Profile"
                                            className="w-8 h-8 rounded-full object-cover"
                                        />  
                                    </Link>
>>>>>>> origin/main
                                </div>
                            </div>
                        ))
                    ) : (
<<<<<<< HEAD
                        <p className="no-blogs">No News or Event found.</p>
=======
                        <p className="text-center w-full text-gray-500 text-lg">
                            No News or Event found.
                        </p>
>>>>>>> origin/main
                    )}
                </div>
            )}
        </div>
    );
}

export default ReportContainer;
