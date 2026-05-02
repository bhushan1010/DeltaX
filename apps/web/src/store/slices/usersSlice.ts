import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from './authSlice';

interface UsersState {
  users: User[];
}

const mockUsers: User[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@hsrmotors.com',
    role: 'Sales Agent',
  },
  {
    id: '2',
    name: 'Mike Chen',
    email: 'mike.chen@hsrmotors.com',
    role: 'Sales Agent',
  },
  {
    id: '3',
    name: 'Admin User',
    email: 'admin@hsrmotors.com',
    role: 'Business Manager',
  },
];

const initialState: UsersState = {
  users: mockUsers,
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUsers: (state, action: PayloadAction<User[]>) => {
      state.users = action.payload;
    },
    addUser: (state, action: PayloadAction<User>) => {
      state.users.push(action.payload);
    },
    updateUserInList: (state, action: PayloadAction<User>) => {
      const index = state.users.findIndex(user => user.id === action.payload.id);
      if (index !== -1) {
        state.users[index] = action.payload;
      }
    },
    deleteUser: (state, action: PayloadAction<string>) => {
      state.users = state.users.filter(user => user.id !== action.payload);
    },
  },
});

export const { setUsers, addUser, updateUserInList, deleteUser } = usersSlice.actions;
export default usersSlice.reducer;
