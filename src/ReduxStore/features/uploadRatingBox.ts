import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RatingBoxState } from "../../type";





const uploadRatingBox = createSlice({
    name: 'uploadRatingBox',
    initialState: {
        open: false,
        id:0,
        name:""
    },
    reducers: {
        setUploadRatingBox: (_state, action:PayloadAction<RatingBoxState>) => {
            return action.payload;
        }
    }
})
export const  {setUploadRatingBox} = uploadRatingBox.actions

export default uploadRatingBox.reducer