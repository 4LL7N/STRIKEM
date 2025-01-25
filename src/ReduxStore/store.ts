import {configureStore} from '@reduxjs/toolkit';

import reservationBox from './features/reservationBox';
import unreadMatchUps from './features/unReadMatchups';
import userLogIn from './features/userLogIn'
import uploadRatingBox  from './features/uploadRatingBox';

export const store = configureStore({
    reducer: {
        reservationBox,
        unreadMatchUps,
        userLogIn,
        uploadRatingBox
    }
})

export type AppStore = typeof store

export type AppDispatch = typeof store.dispatch

export type RootState = ReturnType<typeof store.getState>