import { FormEvent, useState } from 'react';
import { auth } from '../../../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';
import './Signin.css';
import { ClimbingBoxLoader } from 'react-spinners';

export const Signin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Hook to get the navigate function
  const [isLoading, setIsLoading] = useState(false);

  const signIn = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (error) {
      console.error('Sign in error:', error);
    } finally {
    }
  };

  return (
    <div className='container-fluid'>
      {isLoading ? (
        <ClimbingBoxLoader color="#000000" />
      ) : (
        <form>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email:</label>
            <input onChange={(e) => setEmail(e.target.value)} type="text" name="email" className="form-control" placeholder="Enter email" />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password:</label>
            <input onChange={(e) => setPassword(e.target.value)} type="password" name="password" className="form-control" placeholder="Enter password" />
          </div>

          <div className="mb-3 buttons">
            <button onClick={signIn} className="btn btn-info">Sign in</button>

            <button className="btn btn-success">
              <Link to='/signup'>Create Account</Link>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
