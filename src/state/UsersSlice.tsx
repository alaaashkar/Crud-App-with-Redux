import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { api } from "../services/http";
import { addDoc, arrayUnion, collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { auth } from "../firebase";

console.log(auth);


export interface InitialType {
  loading: boolean;
  userList: UserItem[];
  userObj?: UserItem | null;
  errMessage: string;
}

export interface UserItem {
  name: string;
  email: string;
  id: number;
}

const initialState: InitialType = {
  loading: true,
  userList: [],
  userObj: null,
  errMessage: ''
}

export const fetchUserList = createAsyncThunk<UserItem[]>(
  'users/fetchUserList',
  async () => {
    try {
      const userDocRef = doc(db, 'users', auth.currentUser?.email || '');
      const userDocSnapshot = await getDoc(userDocRef);
      const existingDataArray = userDocSnapshot.data()?.data || [];
      return existingDataArray;
    } catch (error) {
      console.error('error fetching userList', error);
      throw error;
    }
  }
);


export const postUser = createAsyncThunk<UserItem, UserItem>(
  'users/postUser',
  async (newUser) => {
    try {
      const { id, ...userWithoutId } = newUser;
      const userDocRef = doc(db, 'users', auth.currentUser?.email || '');
      console.log('userDocRef:', userDocRef)

      const userDocSnapshot = await getDoc(userDocRef);
      console.log('userDocSnapshot:', userDocSnapshot.data());

      const existingDataArray = userDocSnapshot.data()?.data || [];
      console.log('existingDataArray:', existingDataArray);

      const customId = existingDataArray.length + 1;
      console.log('customId:', customId);

      await updateDoc(userDocRef, {
        data: arrayUnion({ id: customId, ...userWithoutId }),
      });

      const updatedUser = { ...newUser, id: customId };

      return updatedUser;
    } catch (error) {
      console.error('Failed to add user document:', error);
      throw error;
    }
  }
);



export const deleteUserFromServer = createAsyncThunk<void, number>(
  'users/deleteUser',
  async (userId) => {
    try {
      const userDocRef = doc(db, 'users', auth.currentUser?.email || '')

      const userDocSnapshot = await getDoc(userDocRef);
      const existingDataArray = userDocSnapshot.data()?.data || [];

      const updatedDataArray = existingDataArray.filter((user: { id: number; }) => user.id !== userId)

      await updateDoc(userDocRef, { data: updatedDataArray });
    } catch (error) {
      console.error(error)
      throw error;
    }
  }
);

export const updateUsersOnServer = createAsyncThunk<UserItem, UserItem>(
  'users/updateUsersOnServer',
  async (updatedUser) => {
    try {
      const response = await api.patch(`/users/${updatedUser.id}`, updatedUser);
      return response.data;
    } catch (error) {
      console.error('failed updating a user !');
      throw error;
    }
  }
);

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    // addUser: (state, action: PayloadAction<UserItem>) => {
    //   state.userList.push(action.payload)
    // },
    updateUser: (state, action: PayloadAction<UserItem>) => {
      const { id, name, email } = action.payload;
      const updatingUser = state.userList.find(user => user.id === id)
      if (updatingUser) {
        updatingUser.name = name;
        updatingUser.email = email;
      }
    },
    deleteUser: (state, action: PayloadAction<number>) => {
      state.userList = state.userList.filter(user => user.id !== action.payload);
    },
    resetUserState: (state) => {
      state.loading = true;
      state.userList = [];
      state.userObj = null;
      state.errMessage = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserList.fulfilled, (state, action: PayloadAction<UserItem[]>) => {
        state.loading = false;
        state.userList = action.payload;
        state.userObj = null;
      })
      .addCase(postUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(postUser.fulfilled, (state, action: PayloadAction<UserItem>) => {
        state.loading = false;
        state.userList.push(action.payload); // Update the user list after posting a new user
      })
      .addCase(deleteUserFromServer.rejected, (state) => {
        state.errMessage = 'Failed to delete user';
      })
      .addCase(updateUsersOnServer.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUsersOnServer.fulfilled, (state, action: PayloadAction<UserItem>) => {
        state.loading = false;
        const foundUser = state.userList.find(user => user.id === action.payload.id);
        if (foundUser) {
          foundUser.name = action.payload.name;
          foundUser.email = action.payload.email;
        }
      })
      .addCase(updateUsersOnServer.rejected, (state) => {
        state.loading = false;
        state.errMessage = 'Failed to update user';
      })
  },
});

export const { updateUser, deleteUser, resetUserState } = usersSlice.actions;
export const usersReducer = usersSlice.reducer;
