import { useEffect, useState } from "react";
import prof from "../../Asset/profileFilled.svg";
import { truncate } from "../../Context/data"; 
import { Link } from "react-router-dom";
import { db } from "../../Context/Firebase";
import { collection, onSnapshot, query } from "firebase/firestore";

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

            setData(StreamArray);
            setIsLoading(false);
        });

        return () => unsub();
    }, []);

    const AllBlogs = Data.filter((e) => e.isVerified === true);

    return (
        <div>
            {isLoading ? (
                <div>Loading ...</div>
            ) : (
                <div className="report-container">
                    {AllBlogs && AllBlogs.length > 0 ? (
                        AllBlogs.map((data) => (
                            <div key={data.id} className="reports">
                                <div className="report">
                                    {/* Conditionally Render Image if Available */}
                                    {data.image ? (
                                        <img className="report-imgg" src={data.image} alt="" />
                                    ) : (
                                        <div className="news-only">
                                            <h1 style={{ textAlign: "center" }}>DU Local News</h1>
                                            <p>Image isn't available for this news.</p>
                                        </div>
                                    )}

                                    {/* Blog Text Content */}
                                    <div className="blog-text">
                                        <h1>{truncate(data.title, 20)}</h1>  
                                        <p>{truncate(data.desc, 100)}</p>
                                        <Link to={`/blog/${data.id}`}>
                                            <button className="readmorebutton">
                                                Read More
                                            </button>
                                        </Link>
                                    </div>

                                    {/* Review Section */}
                                    <div className="review">
                                        <div className="like">
                                            {data.likes?.length || 0} Likes
                                        </div>
                                        <div className="like">
                                            {data.dislikes?.length || 0} Dislikes
                                        </div>
                                        <div className="like">
                                            {data.comments?.length || 0} Comments
                                        </div>

                                        {/* Navigate to User Profile on Click */}
                                        <Link to={`/profile/${data.userId || 'undefined'}`}>
                                        <img className="r" src={prof} alt="User Profile" /></Link>

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
