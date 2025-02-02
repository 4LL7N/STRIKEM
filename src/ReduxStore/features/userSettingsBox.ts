import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const userSettingsBox = createSlice({
    name:"userSettings",
    initialState:{
        open:false,
        settingsPage:"settings"
    },
    reducers:{
        setUserSettingsBoxOpen:(state)=>{
            state.open = true
        },
        setSettingsPage: (state, action: PayloadAction<string>) => {
            state.settingsPage = action.payload;
        },
        setUserSettingsBoxClose:(state)=>{
            state.open = false
            state.settingsPage = "settings"
        },
        setSetPasswordPage:(state,action:PayloadAction<{open:boolean,settingsPage:string}>)=>{
            state.open = action.payload.open
            state.settingsPage = action.payload.settingsPage
        }

    },
})

export const {setUserSettingsBoxOpen,setSettingsPage,setUserSettingsBoxClose,setSetPasswordPage} = userSettingsBox.actions

export default userSettingsBox.reducer