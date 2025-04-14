import "./Login.css"
import { useState } from "react"
import cont from '../../Asset/Book study.jpg'
import emailImage from '../../Asset/email.svg'
import passwordHidden from '../../Asset/lock.svg'
import { auth, db } from "../../Context/Firebase"
import { createUserWithEmailAndPassword, sendPasswordResetEmail, signInWithEmailAndPassword, updateProfile } from "firebase/auth"
import { doc, setDoc } from "firebase/firestore"
import { toast } from "react-toastify"
import { useNavigate } from "react-router"


function Login() {
  // const [signState, setSignState] = useState("Welcome back")
  const [signState, setSignState] = useState("Create an account")
  // const [signState, setSignState] = useState("Recover Your Account")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()


  const HandleSignUP = async () => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(result.user, {
        displayName: name,
      });

      await setDoc(doc(db, "Users", result.user.uid), {
        uid: result.user.uid,
        email,
        name,
        RegisteredDate: new Date().getDate(),
        RegisteredTime: new Date().getTime(),
        isAdmin: false,
      });
      toast.success("Account Created Redirecting")
      navigate("/home")
    } catch (error) {
      console.error("Error signing up with Google:", error);
      toast.error("error Creating Account Try Again")
      throw error;
    }
  }

  const HandleSignIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Account Created Redirecting")
      navigate("/home")
    } catch (error) {
      console.error(error.message);
      toast.error("error logging in Try Again")
      throw error;
    }
  }

  const HandleRecoverAccount = async () =>{
    try {
       await sendPasswordResetEmail(auth, email);
       toast.success("Check Email to Proceed With Account Recovery")
      } catch (error) {
        console.error("Error signing out:", error);
        toast.error("Error Try again")
        if(error.message.includes("netword")){
          console.error("");
        }
      throw error;
    }
  
  }
  return (
    <div>
      <div className="login">
        <div className="form-container">
          <div className="form-image">
            <div className="form-img">
              <div className="contRealImage">
                <img src={cont} alt="" />
              </div>

              {signState === "Create an account" ?

                <div className="inner-t">
                  <h2>Create Your Account</h2>
                  <p>Join us and get started with DU FEEDS. Signing up is quick, and you’ll be able to access all our amazing features.</p>
                </div> :

                <div className="inner-t">
                  <h2>Welcome Back to DU FEEDS!</h2>
                  <p>We have missed you! Please log in to continue exploring and managing your account. If you dont have an account yet, feel free to sign up and join our community!</p>
                </div>
              }
            </div>
          </div>

          <div className="form-field">
            <div className="form-title">
              <h1>{signState}</h1>


              {

                signState === "Recover Your Account" ?
                  <div className="inputs">
                    <div className="input">
                      <label htmlFor="name">Email:</label><br />
                      <input type="email" name="email" id="emailrecovery"
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter Recover Email"
                        required
                      />
                    </div>

                    <button type="submit" onClick={() => HandleRecoverAccount()}>Proceed</button>

                  </div>
                  :
                  <div className="inputs">

                    {signState === "Create an account" ?
                      <div className="input">
                        <label htmlFor="name">Username:</label><br />
                        <input type="text" name="name" id="name"
                          onChange={(e) => setName(e.target.value)}
                          placeholder="User Name"
                          required
                        />
                      </div> :
                      <></>
                    }

                    <div className="input">
                      <label htmlFor="email">Email:</label><br />
                      <input type="email" name="email" id="email"
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="example@gmail.com"
                      />
                      <img src={emailImage} alt="" />
                    </div>

                    <div className="input">
                      <label htmlFor="password">Password:</label><br />
                      <input type="password" name="password"
                        placeholder="******"
                        required
                        onChange={(e) => setPassword(e.target.value)}
                        id="password" />
                      <img src={passwordHidden} alt="" /> <br />
                      {signState === "Create an account" ?
                        <></> :
                        <span className="forget">Dont remember? <a onClick={() => { setSignState("Recover Your Account")} } >Forget Password</a></span>
                      }
                    </div>


                    {signState === "Create an account" ?
                      <p>Already have an account <a onClick={() => { setSignState("Welcome back") }}>Sign in</a></p> :
                      <p>Dont have account <a onClick={() => { setSignState("Create an account") }}>Sign Up</a></p>
                    }

                    {signState === "Create an account" ?

                      <button type="submit" onClick={() => HandleSignUP()}>Sign up</button>
                      :
                      <button type="submit" onClick={() => HandleSignIn()}>Sign in</button>
                    }
                  </div>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login