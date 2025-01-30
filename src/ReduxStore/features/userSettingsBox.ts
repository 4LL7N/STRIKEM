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

    },
})

export const {setUserSettingsBoxOpen,setSettingsPage,setUserSettingsBoxClose} = userSettingsBox.actions

export default userSettingsBox.reducer