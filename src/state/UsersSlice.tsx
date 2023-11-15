import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { api } from "../services/http";

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
      const response = await api.get('/users');
      return response.data;
    } catch (error) {
      console.error('error fetching userList', error);
      throw error;
    }
  }
);

export const postUser = createAsyncThunk<UserItem, UserItem>(
  'users/addUser',
  async (newUser) => {
    try {
      const response = await api.post('/users', newUser);
      return response.data;
    } catch (error) {
      console.error('error creating user', error);
      throw error;
    }
  }
);

export const deleteUserFromServer = createAsyncThunk<void, number>(
  'users/deleteUser',
  async (userId) => {
    try {
      await api.delete(`/users/${userId}`);
    } catch (error) {
      console.log('error deleting user', error);
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
    addUser: (state, action: PayloadAction<UserItem>) => {
      state.userList.push(action.payload)
    },
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
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserList.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserList.fulfilled, (state, action: PayloadAction<UserItem[]>) => {
        state.loading = false;
        state.userList = action.payload;
        state.userObj = null;
      })
      .addCase(fetchUserList.rejected, (state) => {
        state.loading = false;
        state.errMessage = 'Failed to fetch user list';
      })
      .addCase(postUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(postUser.fulfilled, (state, action: PayloadAction<UserItem>) => {
        state.loading = false;
        state.userList.push(action.payload)
      })
      .addCase(postUser.rejected, (state) => {
        state.loading = false;
        state.errMessage = "Failed to create user"
      })
      .addCase(deleteUserFromServer.pending, (state) => {
        state.loading = true
      })
      .addCase(deleteUserFromServer.fulfilled, (state, action: PayloadAction<void, string, { arg: number; requestId: string; requestStatus: "fulfilled"; }, never>) => {
        // Use the id from the action payload
        const userId = action.meta.arg;
        state.userList = state.userList.filter(user => user.id !== userId);
        state.loading = false;
      })
      .addCase(deleteUserFromServer.rejected, (state) => {
        state.loading = false;
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

export const { addUser, updateUser, deleteUser } = usersSlice.actions;
export const usersReducer = usersSlice.reducer;
