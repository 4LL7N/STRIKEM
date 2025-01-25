import {configureStore} from '@reduxjs/toolkit';

import reservationBox from './features/reservationBox';
import unreadMatchUps from './features/unReadMatchups';

export const store = configureStore({
    reducer: {
        reservationBox,
        unreadMatchUps
    }
})

export type AppStore = typeof store

export type AppDispatch = typeof store.dispatch

export type RootState = ReturnType<typeof store.getState>