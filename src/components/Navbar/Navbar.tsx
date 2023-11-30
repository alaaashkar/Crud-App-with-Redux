import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import { useDispatch } from "react-redux";
import { resetUserState, toggleLoading } from "../../state/UsersSlice";
import './Navbar.css'



export const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const signOutUser = () => {
    dispatch(toggleLoading(true));

    // Delay the loading state change for visual effect
    setTimeout(async () => {
      try {
        await signOut(auth);
        dispatch(resetUserState());
        navigate('/signin');
      } catch (error) {
        console.error('Sign out error:', error);
      } finally {
        dispatch(toggleLoading(false));
      }
    }, 2000);
  };

  return (
      <header>
        <h2></h2>
        <button onClick={signOutUser} className="btn btn-danger">
          Sign out
        </button>
      </header>
  );
};
