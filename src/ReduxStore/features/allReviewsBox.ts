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
        setAllReviewsBox: (state, action:PayloadAction<RatingBoxState>) => {
            return state = action.payload;
        }
    }
})
export const  {setAllReviewsBox} = allReviewsBox.actions

export default allReviewsBox.reducer