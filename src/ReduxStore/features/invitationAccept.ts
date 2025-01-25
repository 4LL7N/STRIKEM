import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const invitationAccept = createSlice({
    name: 'invitationAccept',
    initialState: false,
    reducers: {
        setInvitationAccept: (state, action: PayloadAction<boolean>) => {
            return state = action.payload;
        }
    }
})

export const { setInvitationAccept } = invitationAccept.actions;

export default invitationAccept.reducer;