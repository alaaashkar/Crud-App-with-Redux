import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { usersList } from "../data/data";

export interface User {
  name: string,
  email: string,
  id: number,
}

const initialState: User[] = usersList

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    addUser: (state, action: PayloadAction<User>) => {
      state.push(action.payload)
    },
    updateUser: (state, action: PayloadAction<User>) => {
      const { id, name, email } = action.payload;
      const updatingUser = state.find(user => user.id === id)
      if (updatingUser) {
        updatingUser.name = name;
        updatingUser.email = email;
      }
    },
    deleteUser: (state, action) => {
      return state.filter(user => user.id !== action.payload.id)
    }
  }
})

export const { addUser, updateUser, deleteUser } = usersSlice.actions
export const usersReducer = usersSlice.reducer
//USERS STATE


