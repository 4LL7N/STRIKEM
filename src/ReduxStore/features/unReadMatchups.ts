import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const unReadMatchup = createSlice({
    name: 'unReadMatchup',
    initialState: 0,
    reducers: {
        setUnReadMatchup: (_state, action:PayloadAction<number>) => {
            return action.payload;
        },
        unReadMatchupDecrement: (state) => {
            return state > 0?state - 1:state;
        },
        unReadMatchupIncrement: (state) => {
            return state + 1;
        }
    }
})

export const { setUnReadMatchup,unReadMatchupDecrement,unReadMatchupIncrement } = unReadMatchup.actions;

export default unReadMatchup.reducer;