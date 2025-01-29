import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const reservationBox = createSlice({
    name: 'invitationAccept',
    initialState: false,
    reducers: {
        setReservationBox: (_state, action: PayloadAction<boolean>) => {
            return action.payload;
        }
    }
})

export const { setReservationBox } = reservationBox.actions;

export default reservationBox.reducer;