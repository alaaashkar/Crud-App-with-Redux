import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { RootState } from "../../state/store";
import { User, updateUser } from "../../state/UsersSlice";


export const Update = () => {
  const { id } = useParams()
  const users = useSelector((state: RootState) => state.users)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  let selectedUser: User[] = []
  if (id) {
    selectedUser = users.filter(user => user.id === +id)
  }

  const { name, email } = selectedUser[0]
  const [uName, setUName] = useState(name)
  const [uEmail, setUEmail] = useState(email)

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (id !== undefined) {
      dispatch(updateUser({
        id: +id,
        name: uName,
        email: uEmail
      }))
    }
    navigate('/')
  }

  return (
    <div className="d-flex w-100 vh-100 justify-content-center align-items-center">
      <div className="w-50 border bg-secondary text-white p-5">
        <h3>Update User</h3>

        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name">Name:</label>
            <input value={uName} onChange={e => setUName(e.target.value)} type="text" name="name" className="form-control" placeholder="enter name" />
          </div>

          <div>
            <label htmlFor="email">Email:</label>
            <input value={uEmail} onChange={e => setUEmail(e.target.value)} type="text" name="email" className="form-control" placeholder="enter email" />
          </div><br />

          <button className="btn btn-info">Submit</button>
        </form>
      </div>
    </div>
  )
};
