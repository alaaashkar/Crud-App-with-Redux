import React, { useState } from "react";
import { addUser } from "../../state/UsersSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../state/store";
import { useNavigate } from 'react-router-dom';

export const Create = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const users = useSelector((state: RootState) => state.users)
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    const lastUserId = users.userList?.length > 0 ? users.userList[users.userList.length - 1].id : 0

    const id = lastUserId + 1;

    dispatch(addUser({
      id,
      name,
      email,
    }))

    navigate('/')
  }

  return (
    <div className="d-flex w-100 vh-100 justify-content-center align-items-center">
      <div className="w-50 border bg-secondary text-white p-5">
        <h3>Add New User</h3>

        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name">Name:</label>
            <input onChange={e => setName(e.target.value)} type="text" name="name" className="form-control" placeholder="enter name" />
          </div>

          <div>
            <label htmlFor="email">Email:</label>
            <input onChange={e => setEmail(e.target.value)} type="text" name="email" className="form-control" placeholder="enter email" />
          </div><br />

          <button className="btn btn-info">Submit</button>
        </form>
      </div>
    </div>
  )
};
