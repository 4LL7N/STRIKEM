import { createSlice } from "@reduxjs/toolkit";

const unReadMatchup = createSlice({
    name: 'unReadMatchup',
    initialState: 0,
    reducers: {
        setUnReadMatchup: (state, action) => {
            return state = action.payload;
        }
    }
})

export const { setUnReadMatchup } = unReadMatchup.actions;

export default unReadMatchup.reducer;