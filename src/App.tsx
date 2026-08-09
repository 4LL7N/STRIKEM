// App.tsx
// Bootstrap's CSS is imported from index.css now (layered there, see the comment above the
// `@import "bootstrap/dist/css/bootstrap.min.css" layer(bootstrap);` line) instead of here, so it
// participates in the same cascade-layer system Tailwind's utilities use.

import { lazy, Suspense, useState } from 'react'
import { Navigate , createBrowserRouter , RouterProvider } from 'react-router-dom';
import { WebSocketProvider } from './Components/Websocket';
// import Layout from './Components/Layout';
// import Home from './Components/Home';s
// import Pool from './Components/Pool'
import User from './Components/User';
// import Messenger from './Components/Messenger';
// import Matchup from './Components/Matchup';
import EmailVerifivation from './Components/UsersMemo/EmailVerifivation';
import LoadingPage from './Components/LoadingPage';


const Layout = lazy(() => import("./Components/Layout"));
const Home = lazy(() => import("./Components/Home"));
const Pool = lazy(() => import("./Components/Pool"));
// const User = lazy(() => import("./Components/User"));
const Messenger = lazy(() => import("./Components/Messenger"));
const Matchup = lazy(() => import("./Components/Matchup"));
// const EmailVerification = lazy(() => import("./Components/UsersMemo/EmailVerifivation"));
import { useGeolocated } from "react-geolocated";
import { GeoLocation } from './type';

function App() {  

  const [search, setSearch] = useState<string>('')
  const [usersSearch,setUsersSearch] = useState<string>('')
  const [logOut, setLogOut] = useState<boolean>(false)
  const [acceptInvitation,setAcceptInvitation] = useState<number>(0)

  const { coords, isGeolocationAvailable, isGeolocationEnabled }:GeoLocation =
      useGeolocated({
        positionOptions: {
          enableHighAccuracy: true,
        },
        userDecisionTimeout: 5000,
      });

  const router = createBrowserRouter([
    {
      element: (
        <Suspense fallback={<LoadingPage />}>
          <Layout
            search={search}
            setSearch={setSearch}
            usersSearch={usersSearch}
            setUsersSearch={setUsersSearch}
            logOut={logOut}
            setLogOut={setLogOut}
            acceptInvitation={acceptInvitation}
            setAcceptInvitation={setAcceptInvitation}
          />
        </Suspense>
      ),
      children: [
        {
          path: "/",
          element: <Navigate to="/home" />,
        },
        {
          path: "/home",
          element: (
            <Suspense fallback={<LoadingPage />}>
              <Home search={search} coords={coords} isGeolocationAvailable={isGeolocationAvailable} isGeolocationEnabled={isGeolocationEnabled} />
            </Suspense>
          ),
        },
        {
          path: "/Pools/:Pool",
          element: (
            <Suspense fallback={<LoadingPage />}>
              <Pool coords={coords} isGeolocationAvailable={isGeolocationAvailable} isGeolocationEnabled={isGeolocationEnabled} />
            </Suspense>
          ),
        },
        {
          path: "/users/:currentUser",
          element: (
            // <Suspense fallback={<Loading />}>
              <User />
            // </Suspense>
          ),
        },
        {
          path: "/messenger",
          element: (
            <Suspense fallback={<LoadingPage />}>
              <Messenger />
            </Suspense>
          ),
        },
        {
          path: "/matchmake",
          element: (
            <Suspense fallback={<LoadingPage />}>
              <Matchup
                usersSearch={usersSearch}
                setUsersSearch={setUsersSearch}
                setAcceptInvitation={setAcceptInvitation}
              />
            </Suspense>
          ),
        },
      ],
    },
    {
      element:<EmailVerifivation/>,
      path:'/activate/:uid/:token'
    }
  ])

  


  




  return (
    <>
     <WebSocketProvider>
      <RouterProvider  router={router}  />
      </WebSocketProvider>
    </>
  )
}

export default App
