import { useRef, useState } from 'react'
import data from "./../data.json";
import AuthLayout from './Components/AuthLayout';
import Signup from './Components/Signup';
import Layout from './Components/Layout';
import Home from './Components/Home';
import Page from './Components/Page';
import Pool from './Components/Pool'
import { Navigate , createBrowserRouter , RouterProvider } from 'react-router-dom';
import User from './Components/User';
import Messenger from './Components/Messenger';
import Matchup from './Components/Matchup';
import { WebSocketProvider } from './Components/Websocket';



interface usersObj{
    email:string
    password:string
}

function App() {
  const Filmdata = data
  

  const users= useRef<usersObj[]>([]) 
  const [search, setSearch] = useState<string>('')
  const [usersSearch,setUsersSearch] = useState<string>('')
  const [logOut, setLogOut] = useState<boolean>(false)
  const [acceptInvatation,setAcceptInvatation] = useState<number>(0)

  const router = createBrowserRouter([
    {
      element:<Layout search={search} setSearch={setSearch} usersSearch={usersSearch} setUsersSearch={setUsersSearch} logOut={logOut} setLogOut={setLogOut} acceptInvatation={acceptInvatation} setAcceptInvatation={setAcceptInvatation} />,
      children:[
        {
          path:"/",
          element:<Navigate to="/home" />
        },
        {
          path:"/home",
          element:<Home  search={search} />
        },
        {
          path:"/:page",
          element:<Page Filmdata={Filmdata} search={search} />
        },
        {
          element:<Pool/>,
          path:"/Pools/:Pool"
        },
        {
          element:<User/>,
          path:'/users/:currentUser'
        },
        {
          path:'/messenger',
          element:<Messenger/>
        },
        {
          path:'/matchmake',
          element:<Matchup usersSearch={usersSearch} setUsersSearch={setUsersSearch} setAcceptInvatation={setAcceptInvatation}  />
        }
      ]
    },
    {
      element:<AuthLayout/>,
      children:[
        
        {
          path:"/signup",
          element:<Signup users={users} />
        }
      ]
    },
  
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
