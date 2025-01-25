import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const reservationBox = createSlice({
    name: 'invitationAccept',
    initialState: false,
    reducers: {
        setReservationBox: (state, action: PayloadAction<boolean>) => {
            return state = action.payload;
        }
    }
})

export const { setReservationBox } = reservationBox.actions;

export default reservationBox.reducer;