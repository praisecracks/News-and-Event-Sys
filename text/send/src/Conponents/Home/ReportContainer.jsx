import { useEffect, useState } from "react";
import LikeIcon from "../../Asset/profileFilled.svg"
import { Blogs, truncate } from "../../Context/data"
import { Link } from "react-router-dom";
function ReportContainer() {
    const [isLoading, setIsLoading] = useState(false);
    const [Data, setData] = useState();

    useEffect(() => {
        setIsLoading(true);
        const displayBlogs = async () => {
            try {
                const blogs = await Blogs
                console.log(blogs)
                setData(blogs)
            }
            catch (error) {
                console.log(error)
            }
        }
        setIsLoading(false);

        return () => displayBlogs();
    }, []);
    const AllBlogs = Data?.filter(function (e) {
        return e.isVerified === true;
    });
    return (

        <div>
            {
                isLoading ?
                 <div>Loading ...</div> :
                    <div className="report-container">
                        {AllBlogs && AllBlogs.length > 0 ? (

                            AllBlogs.map((data) => {
                                return (
                                    <div key={data.id} className="reports">
                                        <div className="report">
                                            <img src={data.image} alt="" />

                                            <div className="blog-text">
                                                <h1>{data.title}</h1>
                                                <p>
                                                    {truncate(data.desc, 100)}
                                                </p>
                                                <Link to={`/blog/${data.id}`}>
                                                    <button
                                                        className="readmorebutton"
                                                    >
                                                        Read More
                                                    </button>
                                                </Link>
                                            </div>
                                            <div className="review">
                                                <div className="like">
                                                    {data.likes.length} Likes
                                                </div>
                                                <img className='r' src={LikeIcon} alt="" />
                                            </div>
                                        </div>

                                    </div>
                                );
                            })
                        ) :
                            <p className="no-blogs">No blogs found.</p>
                        }
                    </div>
            }
        </div>
    )
}

export default ReportContainer