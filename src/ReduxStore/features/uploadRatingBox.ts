import { createSlice, PayloadAction } from "@reduxjs/toolkit";

 
const uploadRatingBox = createSlice({
    name: 'uploadRatingBox',
    initialState: false,
    reducers: {
        setUploadRatingBox: (state, action:PayloadAction<boolean>) => {
            return state = action.payload;
        }
    }
})
export const  {setUploadRatingBox} = uploadRatingBox.actions

export default uploadRatingBox.reducer