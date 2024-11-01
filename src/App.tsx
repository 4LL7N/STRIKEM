import { useRef, useState } from 'react'
import data from "./../data.json";
import AuthLayout from './Components/AuthLayout';
import Login from './Components/Login'
import Signup from './Components/Signup';
import Layout from './Components/Layout';
import Home from './Components/Home';
import Page from './Components/Page';
import Pool from './Components/Pool'
import { Navigate , createBrowserRouter , RouterProvider } from 'react-router-dom';
import User from './Components/User';



interface usersObj{
    email:string
    password:string
}

function App() {
  const Filmdata = data
  

  const users= useRef<usersObj[]>([]) //useRef
  const [search, setSearch] = useState<string>('')
  const [logOut, setLogOut] = useState<boolean>(false)


  const router = createBrowserRouter([
    {
      element:<Layout search={search} setSearch={setSearch} logOut={logOut} setLogOut={setLogOut} />,
      children:[
        {
          path:"/home",
          element:<Home  search={search} />
        },
        {
          path:"/:page",
          element:<Page Filmdata={Filmdata} search={search} />
        }
      ]
    },
    {
      element:<AuthLayout/>,
      children:[
        {
          path:"/",
          element:<Navigate to="/login" />
        },
        {
          path:"/login",
          element:<Login users={users} setLogOut={setLogOut} />
        },
        {
          path:"/signup",
          element:<Signup users={users} />
        }
      ]
    },
    {
      element:<Pool/>,
      path:"/Pools/:Pool"
    },
    {
      element:<User/>,
      path:'/user'
    }
  ])

  


  




  return (
    <>
      <RouterProvider  router={router}  />
    </>
  )
}

export default App
