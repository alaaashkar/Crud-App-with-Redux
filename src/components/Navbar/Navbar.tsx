import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import { useDispatch } from "react-redux";
import { resetUserState } from "../../state/UsersSlice";

export const Navbar = () => {
  const navigate = useNavigate(); // Hook to get the navigate function
  const dispatch = useDispatch()

  const signOutUser = () => {
    signOut(auth).then(() => {
      navigate('/signin')
    })
    dispatch(resetUserState())
  }

  return (
    <div className="container">
      <header>
        <h2>Crud App with JSON Server</h2>
        <button onClick={signOutUser} className="btn btn-danger">Sign out</button>
      </header>
    </ div>
  )
};
