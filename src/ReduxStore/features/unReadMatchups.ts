import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const unReadMatchup = createSlice({
    name: 'unReadMatchup',
    initialState: 0,
    reducers: {
        setUnReadMatchup: (state, action:PayloadAction<number>) => {
            return state = action.payload;
        },
        decrement: (state) => {
            return state - 1;
        }
    }
})

export const { setUnReadMatchup,decrement } = unReadMatchup.actions;

export default unReadMatchup.reducer;