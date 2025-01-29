import { createSlice } from "@reduxjs/toolkit";

const userLogIn = createSlice({
    name: 'userLogIn',
    initialState: false,
    reducers: {
        setUserLogIn: (_state, action) => {
            return action.payload;
        }
    }
})

export const {setUserLogIn} = userLogIn.actions

export default userLogIn.reducer