import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const userSettings = createSlice({
    name:"userSettings",
    initialState:false,
    reducers:{
        setUserSettings:(_state:boolean,action:PayloadAction<boolean>)=>{
            return action.payload
        }        
    },
})

export const {setUserSettings} = userSettings.actions

export default userSettings.reducer