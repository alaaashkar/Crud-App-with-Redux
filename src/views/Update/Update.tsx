import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { AppDispatch, RootState } from "../../state/store";
import { UserItem, updateUser, updateUsersOnServer } from "../../state/UsersSlice";
import { ClipLoader } from 'react-spinners';

export const Update = () => {
  const { id } = useParams()
  const users = useSelector((state: RootState) => state.users)
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const [isLoading, setisLoading] = useState(false)

  let selectedUser: UserItem[] = []
  if (id) {
    selectedUser = users.userList.filter(user => user.id === +id)
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

      setisLoading(true)

      setTimeout(() => {
        setisLoading(false)
        navigate('/')
      }, 500);

      dispatch(updateUsersOnServer(
        {
          id: +id,
          name: uName,
          email: uEmail
        }
      ))
    }

  }

  return (
    <div className="container">
      <div className="row justify-content-center align-items-center min-vh-100">
        <div className="col-md-6">
          <div className="border bg-secondary text-white p-5">
            <h3 className="mb-4">Update User</h3>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label" htmlFor="name">Name:</label>
                <input value={uName} onChange={e => setUName(e.target.value)} type="text" name="name" className="form-control" placeholder="enter name" />
              </div>

              <label className="form-label" htmlFor="email">Email:</label>
              <input value={uEmail} onChange={e => setUEmail(e.target.value)} type="text" name="email" className="form-control" placeholder="enter email" />
              <br />

              <div className="mb-3">
                {isLoading ? (
                  <ClipLoader color="#36d7b7" />
                ) : (
                  <button className="btn btn-info">Submit</button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
};