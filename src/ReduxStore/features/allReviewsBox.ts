import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RatingBoxState } from "../../type";

const allReviewsBox = createSlice({
    name: 'allReviewsBox',
    initialState: {
        open: false,
        id:-1,
        name:""
    },
    reducers: {
        setAllReviewsBox: (_state, action:PayloadAction<RatingBoxState>) => {
            return action.payload;
        }
    }
})
export const  {setAllReviewsBox} = allReviewsBox.actions

export default allReviewsBox.reducer