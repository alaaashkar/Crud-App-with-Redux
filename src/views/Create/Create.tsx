import React, { useState } from "react";
import { addUser, postUser } from "../../state/UsersSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../state/store";
import { useNavigate } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';

export const Create = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const users = useSelector((state: RootState) => state.users)
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [isLoading, setisLoading] = useState(false)

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    const lastUserId = users.userList?.length > 0 ? users.userList[users.userList.length - 1].id : 0
    const id = lastUserId + 1;

    dispatch(addUser({
      id,
      name,
      email,
    }))

    setisLoading(true)

    setTimeout(() => {
      setisLoading(false)
      navigate('/')
    }, 500);
    dispatch(postUser({ id, name, email }))
  }

  return (
    <div className="container">
      <div className="row justify-content-center align-items-center min-vh-100">
        <div className="col-md-6">
          <div className="border bg-secondary text-white p-5 ">
            <h3 className="mb-4">Add New User</h3>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">Name:</label>
                <input onChange={e => setName(e.target.value)} type="text" name="name" className="form-control" placeholder="Enter name" />
              </div>

              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email:</label>
                <input onChange={e => setEmail(e.target.value)} type="text" name="email" className="form-control" placeholder="Enter email" />
              </div>

              <div className="mb-3">
                {isLoading ? (
                  <ClipLoader color="#36d7b7" />
                ) : (
                  <button type="submit" className="btn btn-info">Submit</button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
};
