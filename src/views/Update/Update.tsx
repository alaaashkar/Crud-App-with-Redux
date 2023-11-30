import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { AppDispatch, RootState } from "../../state/store";
import { updateUsersOnServer } from "../../state/UsersSlice";


export const Update = () => {
  const { id } = useParams();
  const users = useSelector((state: RootState) => state.users);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [isLoading, setisLoading] = useState(false);

  // Ensure selectedUser is an array with at least one element
  const selectedUser = users.userList.filter(user => user.id === Number(id));
  const hasSelectedUser = selectedUser.length > 0;

  const initialName = hasSelectedUser ? selectedUser[0].name : "";
  const initialEmail = hasSelectedUser ? selectedUser[0].email : "";

  const [uName, setUName] = useState(initialName);
  const [uEmail, setUEmail] = useState(initialEmail);

  useEffect(() => {
    setUName(initialName);
    setUEmail(initialEmail);
  }, [initialName, initialEmail]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (id && hasSelectedUser) {
      setisLoading(true);

      setTimeout(() => {
        setisLoading(false);
        navigate('/');
      }, 500);

      dispatch(updateUsersOnServer({
        id: +id,
        name: uName,
        email: uEmail
      }));
    }
  };

  if (!hasSelectedUser) {
    // Handle the case where no user with the specified id is found
    return <div>No user found with the specified id.</div>;
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
                <button className="btn btn-info">Submit</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
