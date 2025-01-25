import {configureStore} from '@reduxjs/toolkit';

import reservationBox from './features/reservationBox';

export const store = configureStore({
    reducer: {
        reservationBox,
    }
})

export type AppStore = typeof store

export type AppDispatch = typeof store.dispatch

export type RootState = ReturnType<typeof store.getState>