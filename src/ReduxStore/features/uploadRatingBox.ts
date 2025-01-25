import { createSlice, PayloadAction } from "@reduxjs/toolkit";


interface uploadRatingBoxState {
    open: boolean,
    id:number,
    name:string
}


const uploadRatingBox = createSlice({
    name: 'uploadRatingBox',
    initialState: {
        open: false,
        id:-1,
        name:""
    },
    reducers: {
        setUploadRatingBox: (state, action:PayloadAction<uploadRatingBoxState>) => {
            return state = action.payload;
        }
    }
})
export const  {setUploadRatingBox} = uploadRatingBox.actions

export default uploadRatingBox.reducer