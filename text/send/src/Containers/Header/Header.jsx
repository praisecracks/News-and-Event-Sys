import "./Header.css"
import ProfileImage from "../../Asset/white profile.png"
import { Link, NavLink } from "react-router-dom"
import { useUser } from "../../Context/UserContext"
import { Users } from "../../Context/data";
import { useEffect, useState } from "react";
import { BsMenuButtonWide } from "react-icons/bs";
function Header() {
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

    const [isActive, setisActive] = useState(false);
    const handleToggle = () => {
        setisActive((current) => !current);
    };

    const isAdmin = data && data[0]?.isAdmin
    const isLoggedIn = currentUser && currentUser
    return (
        <div className="HomeHeader">
            <Link to="/"><div className="logo">
                LOGO
            </div></Link>
            <button onClick={handleToggle} className="respobutton">
                <BsMenuButtonWide />
            </button>

            <ul style={{ top: `${isActive ? "0px" : "-350px"}` }} className="headerNav">
                <button onClick={handleToggle} className="respobutton">
                    <BsMenuButtonWide />
                </button>

                <li><NavLink to="/home">Home</NavLink></li>
                <li><NavLink to="/about">About</NavLink></li>
                {isLoggedIn && <li><NavLink to="/create">Create</NavLink></li>}
                {isLoggedIn && <li><NavLink to="/blogs">My Blogs</NavLink></li>}
                {isAdmin &&
                    <li> <NavLink to="/admin">
                        Admin Page
                    </NavLink>
                    </li>
                }
                <li><NavLink to={isLoggedIn ? "/profile" : "/login"}> {isLoggedIn ?
                    <div className="major">
                        <div className="profile-pic">
                            <img src={ProfileImage} alt="" />
                        </div>

                    </div>
                    :
                    "Login"
                }
                </NavLink></li>
            </ul>
        </div>

    )
}
export default Header