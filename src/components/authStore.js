import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
};

const locationSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    save: (state, param) => {
      const { payload } = param;
      state.user = payload;
      sessionStorage.setItem('user', JSON.stringify(payload));
    },
  }
});
const { actions, reducer } = locationSlice

export function getUser(){  
  if (locationSlice.user)
    return this.state.user;
  
  if (sessionStorage.getItem('user'))
    return JSON.parse(sessionStorage.getItem('user'));
  
  return null;
}

export const { save } = actions;
export default reducer;
