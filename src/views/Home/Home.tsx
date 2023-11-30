import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from '../../state/store';
import { Link, useNavigate } from 'react-router-dom';
import { deleteUser, deleteUserFromServer, fetchUserList } from "../../state/UsersSlice";
import { ClipLoader } from 'react-spinners';
import './Home.css';


interface DeleteConfirmationModalProps {
  onDelete: (id: number) => void;
  onCancel: () => void;
}


export const Home = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(0);
  const users = useSelector((state: RootState) => state.users);
  const dispatch = useDispatch<AppDispatch>();

  const handleDelete = (id: number) => {
    setShowModal(true);
    setSelectedUserId(id);
  };

  const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({ onDelete, onCancel }) => (
    <div className="modal-content">
      <h5>Delete User</h5>
      <p>Are you sure you want to delete this user?</p>
      <div className="delete-wrapper">
        <button className="cancel-button" onClick={onCancel}>Cancel</button>
        <button className="delete-button" onClick={() => onDelete(selectedUserId)}>Delete</button>
      </div>
    </div>
  );

  const handleConfirmDelete = (id: number) => {
    dispatch(deleteUser(id));
    dispatch(deleteUserFromServer(id));
    setShowModal(false);
  };

  const handleCancelDelete = () => {
    setSelectedUserId(0);
    setShowModal(false);
  };

  return (
    <>
      <div
        className="container">

        {users.loading || users.isLoading ? (
          <ClipLoader className="cliploader" color="#000" />
        ) : (
          <>
            <Link to='/create' className="btn btn-success my-3 text-white">Create +</Link>
            {users.userList.length > 0 && (
              <table className="table animate__animated animate__fadeIn animate__faster">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.userList.map((user, index) => (
                    <tr key={index} className="table-item ">
                      <td>{user.id}</td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>
                        <Link to={`/edit/${user.id}`} className="btn btn-sm btn-primary">Edit</Link>
                        <button onClick={() => handleDelete(user.id)} className="btn btn-sm btn-danger ms-2">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

          </>
        )}
      </div>
      {showModal && (
        <>
          <div className="dark-background"></div>
          <DeleteConfirmationModal
            onDelete={() => handleConfirmDelete(selectedUserId)}
            onCancel={handleCancelDelete} />
        </>
      )}
    </>
  );
};
