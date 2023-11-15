import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

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
      const response = await axios.get('http://localhost:3000/users')
      return response.data
    } catch (error) {
      console.error('error fetching userList', error)
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
    deleteUser: (state, action: PayloadAction<Pick <UserItem,'id'>>) => {
      state.userList = state.userList.filter(user => user.id !== action.payload.id);
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
      });
  },
});

export const { addUser, updateUser, deleteUser } = usersSlice.actions;
export const usersReducer = usersSlice.reducer;
