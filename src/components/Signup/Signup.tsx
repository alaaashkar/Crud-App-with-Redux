import { FormEvent, useState } from 'react';
import './Signup.css'
import { auth, db } from '../../firebase'
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { getFirestore, doc, setDoc, Firestore } from 'firebase/firestore';

export const SignUp = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate(); // Hook to get the navigate function


  const signUp = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const uid = userCredential.user.uid
      const firestore: Firestore = getFirestore()

      await setDoc(doc(firestore, 'users', email), {
        uid,
        email,
        data: []
      });

      navigate('/signin')

      console.log('success');

    } catch (error) {
      console.error(error)
    }
  };

  return (
    <div className='container-fluid' >
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
          <button onClick={signUp} className="btn btn-info">Sign up</button>
        </div>
      </form>
    </div >
  )
};
