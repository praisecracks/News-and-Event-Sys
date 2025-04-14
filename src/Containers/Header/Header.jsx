import "./Header.css";
import ProfileImage from "../../Asset/white profile.png"; 
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useUser } from "../../Context/UserContext";
import { useEffect, useState } from "react";
import { BsMenuButtonWide } from "react-icons/bs";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../Context/Firebase";
import admin from "../../Asset/admin.png";

function Header() {
    const { currentUser } = useUser();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isSubAdmin, setIsSubAdmin] = useState(false);
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        async function fetchUserData() {
            if (currentUser) {
                try {
                    console.log("User:", currentUser);
                    const userRef = doc(db, "Users", currentUser.uid);
                    const userDoc = await getDoc(userRef);
                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        console.log("Fetched User Data:", userData);

                        // Check user roles
                        const isUserAdmin = userData.isAdmin || userData.role === "admin";
                        const isUserSubAdmin = userData.role === "subadmin";
                        
                        console.log("Admin Status:", isUserAdmin);
                        console.log("Sub Admin Status:", isUserSubAdmin);

                        setIsAdmin(isUserAdmin);
                        setIsSubAdmin(isUserSubAdmin);
                    } else {
                        console.log("User document does not exist!");
                    }
                } catch (error) {
                    console.error("Error fetching user data: ", error);
                }
            } else {
                console.log("No logged-in user!");
            }
            setIsLoading(false);
        }
        fetchUserData();
    }, [currentUser]);

    console.log("Button Render Check - isLoading:", isLoading, "isAdmin:", isAdmin, "isSubAdmin:", isSubAdmin);

    const handleToggle = () => setIsActive((prevState) => !prevState);
    const isLoggedIn = !!currentUser;

    return (
        <div className="HomeHeader">
            <Link to="/">
                <div className="logo">
                    <b style={{ fontFamily: "fantasy", letterSpacing: "2px", fontSize: "30px", paddingTop: "10px" }}>
                        DU
                    </b>
                    FEED
                </div>
            </Link>

            <button onClick={handleToggle} className="respobutton">
                <BsMenuButtonWide />
            </button>

            <ul className="headerNav" style={{ top: isActive ? '-650px' : '0px' }}>
                <button onClick={handleToggle} className="respobutton">
                    <BsMenuButtonWide />
                </button>

                <li><NavLink to="/home"> Home</NavLink></li>
                <li><NavLink to="/about">About</NavLink></li>
                {isLoggedIn && <li><NavLink to="/create">Create</NavLink></li>}
                {isLoggedIn && <li><NavLink to="/blogs">My Blogs</NavLink></li>}
                
                {/* ✅ Show "Admin Page" for both Admins & Sub Admins */}
                {!isLoading && (isAdmin || isSubAdmin) && (
                    <li><NavLink to="/admin">Admin Page</NavLink></li>
                )}

                {/* ✅ Show "Create Sub Admin" button only for full Admins */}
                {!isLoading && isAdmin && (
                    <button className="create-admin-btn" onClick={() => navigate("/createadmin")}>
                        <img src={admin} alt="" />
                    </button>
                )}

                <li
                    style={{
                        background: isLoggedIn ? "transparent" : "#507bda",
                        color: isLoggedIn ? "#507bda" : "#fff",
                        borderRadius: "10px",
                        width: "100px",
                        height: "40px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer"
                    }}
                >
                    <NavLink to={isLoggedIn ? "/profile" : "/login"}>
                        {isLoggedIn ? (
                            <div className="major" style={{ marginRight: "-100px" }}>
                                <div className="profile-pic">
                                    <img
                                        src={currentUser?.photoURL || ProfileImage}
                                        alt="User Profile"
                                        className="profile-image"
                                    />
                                </div>
                            </div>
                        ) : (
                            "Login"
                        )}
                    </NavLink>
                </li>
            </ul>
        </div>
    );
}

export default Header;
