import { PayloadAction, createAsyncThunk, createSlice, current } from "@reduxjs/toolkit";
import axios from "axios";
import { api } from "../services/http";
import { addDoc, arrayUnion, collection, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { auth } from "../firebase";

console.log(auth);


export interface InitialType {
  loading: boolean;
  userList: UserItem[];
  userObj?: UserItem | null;
  errMessage: string;
  isLoading: boolean
  bla: string
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
  errMessage: '',
  isLoading: false,

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
      const userDocRef = doc(db, 'users', auth.currentUser?.email || '');

      setDoc(userDocRef, {
        data: arrayUnion(newUser)
      }, { merge: true }
      )

      return newUser


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

      const updatedDataArray = existingDataArray.filter((user: UserItem) => user.id !== userId)

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
      const userDocRef = doc(db, 'users', auth.currentUser?.email || '');
      const userDocSnapshot = await getDoc(userDocRef);
      const existingDataArray = userDocSnapshot.data()?.data || [];

      const updatedDataArray = existingDataArray.map((user: UserItem) => {
        if (user.id === updatedUser.id) {
          return { ...user, ...updatedUser }
        } else {
          return user
        }
      })

      await updateDoc(userDocRef, { data: updatedDataArray })

      return updatedUser
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
    deleteUser: (state, action: PayloadAction<number>) => {
      state.userList = state.userList.filter(user => user.id !== action.payload);
    },
    resetUserState: (state) => {
      state.loading = true;
      state.userList = [];
      state.userObj = null;
      state.errMessage = '';
    },
    toggleLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    }
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
        state.errMessage = 'Failed to update users';
      })
  },
});

export const { deleteUser, resetUserState, toggleLoading } = usersSlice.actions;
export const usersReducer = usersSlice.reducer;

