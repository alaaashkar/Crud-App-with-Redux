import { FormEvent, useState } from 'react';
import './Signin.css';
import { auth } from '../../../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';


export const Signin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Hook to get the navigate function

  const signIn = (e: FormEvent) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log(userCredential);

        navigate('/')
      })
      .catch((error) => {
        console.error('Sign in error:', error.message);
      });
  };

  return (
    <div className='container-fluid'>
      <form>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email:</label>
          <input onChange={e => setEmail(e.target.value)} type="text" name="email" className="form-control" placeholder="Enter email" />
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password:</label>
          <input onChange={e => setPassword(e.target.value)} type="password" name="password" className="form-control" placeholder="Enter password" />
        </div>

        <div className="mb-3 buttons">
          <button onClick={signIn} className="btn btn-info">Sign in</button>

          <button onClick={signIn} className="btn btn-success">
            <Link to='/signup'>
              Create Account
            </Link>
          </button>

        </div>
      </form>
    </div>

  );
};
