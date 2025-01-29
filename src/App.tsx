// App.tsx
import 'bootstrap/dist/css/bootstrap.min.css'; // Global CSS

import { lazy, Suspense, useState } from 'react'
import { Navigate , createBrowserRouter , RouterProvider } from 'react-router-dom';
import { WebSocketProvider } from './Components/Websocket';
// import Layout from './Components/Layout';
// import Home from './Components/Home';
// import Pool from './Components/Pool'
import User from './Components/User';
// import Messenger from './Components/Messenger';
// import Matchup from './Components/Matchup';
import EmailVerifivation from './Components/UsersMemo/EmailVerifivation';


const Layout = lazy(() => import("./Components/Layout"));
const Home = lazy(() => import("./Components/Home"));
const Pool = lazy(() => import("./Components/Pool"));
// const User = lazy(() => import("./Components/User"));
const Messenger = lazy(() => import("./Components/Messenger"));
const Matchup = lazy(() => import("./Components/Matchup"));
// const EmailVerification = lazy(() => import("./Components/UsersMemo/EmailVerifivation"));

const Loading = () => <div>Loading...</div>;

function App() {  

  const [search, setSearch] = useState<string>('')
  const [usersSearch,setUsersSearch] = useState<string>('')
  const [logOut, setLogOut] = useState<boolean>(false)
  const [acceptInvitation,setAcceptInvitation] = useState<number>(0)

  const router = createBrowserRouter([
    {
      element: (
        <Suspense fallback={<Loading />}>
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
        // </Suspense>
      ),
      children: [
        {
          path: "/",
          element: <Navigate to="/home" />,
        },
        {
          path: "/home",
          element: (
            <Suspense fallback={<Loading />}>
              <Home search={search} />
            </Suspense>
          ),
        },
        {
          path: "/Pools/:Pool",
          element: (
            <Suspense fallback={<Loading />}>
              <Pool />
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
            <Suspense fallback={<Loading />}>
              <Messenger />
            </Suspense>
          ),
        },
        {
          path: "/matchmake",
          element: (
            <Suspense fallback={<Loading />}>
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
