import {configureStore} from '@reduxjs/toolkit';

import invitationAccept from './features/invitationAccept';

export const store = configureStore({
    reducer: {
        invitationAccept,
    }
})

export type AppStore = typeof store

export type AppDispatch = typeof store.dispatch

export type RootState = ReturnType<typeof store.getState>