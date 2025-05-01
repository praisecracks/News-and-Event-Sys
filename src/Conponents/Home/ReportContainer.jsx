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
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="no-blogs">No News or Event found.</p>
                    )}
                </div>
            )}
        </div>
    );
}

export default ReportContainer;
