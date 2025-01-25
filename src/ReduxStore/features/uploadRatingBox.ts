import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RatingBoxState } from "../../type";





const uploadRatingBox = createSlice({
    name: 'uploadRatingBox',
    initialState: {
        open: false,
        id:-1,
        name:""
    },
    reducers: {
        setUploadRatingBox: (state, action:PayloadAction<RatingBoxState>) => {
            return state = action.payload;
        }
    }
})
export const  {setUploadRatingBox} = uploadRatingBox.actions

export default uploadRatingBox.reducer