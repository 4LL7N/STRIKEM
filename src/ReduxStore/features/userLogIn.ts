import { createSlice } from "@reduxjs/toolkit";

const userLogIn = createSlice({
    name: 'userLogIn',
    initialState: false,
    reducers: {
        setUserLogIn: (state, action) => {
            return state = action.payload;
        }
    }
})

export const {setUserLogIn} = userLogIn.actions