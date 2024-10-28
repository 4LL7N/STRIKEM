import { useEffect, useRef, useState } from 'react'
import data from "./../data.json";
import AuthLayout from './Components/AuthLayout';
import Login from './Components/Login'
import Signup from './Components/Signup';
import Layout from './Components/Layout';
import Home from './Components/Home';
import Page from './Components/Page';
import Pool from './Components/Pool'
import { Navigate , createBrowserRouter , RouterProvider } from 'react-router-dom';
import axios from 'axios';
import User from './Components/User';



interface usersObj{
    email:string
    password:string
}

function App() {
  const Filmdata = data
  
  const [poolHubData,setPoolHubData] = useState([])

  const Fetch = async () => {
    try {
      const response = await axios.get("http://134.122.88.48/api/poolhouses/",{
        headers:{
          'Authorization':'JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzMwMjA3MzA0LCJpYXQiOjE3MzAxMjA5MDQsImp0aSI6IjEzNTc5NTVkODJjNTRjOGVhYTk3N2I5ZmQ1MWQ3MGI3IiwidXNlcl9pZCI6MTl9.EjArhfgKcSW6m_w8FUWEjY8WU14tvD7XUuxZzUVIEW0'
        }
      });
      
      setPoolHubData(response.data)
    } catch (err) {
      console.error(err);
    }
    
  };

  useEffect(() => {
    Fetch();
  }, []);

  const users= useRef<usersObj[]>([]) //useRef
  const [search, setSearch] = useState<string>('')
  const [logOut, setLogOut] = useState<boolean>(false)


  const router = createBrowserRouter([
    {
      element:<Layout search={search} setSearch={setSearch} logOut={logOut} setLogOut={setLogOut} />,
      children:[
        {
          path:"/home",
          element:<Home Filmdata={Filmdata} poolHubData={poolHubData} search={search} />
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
