import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import UserSignUp from './userSignUp.jsx';
import PropertyRegister from './propertyRegister.jsx';
import AgentSignUp from './agentSignUp.jsx';


const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path:'/usersignup',
    element:<UserSignUp/>
  },
  {
    path:'/registerproperty',
    element:<PropertyRegister/>
  },
  {
    path:'/agentregister',
    element:<AgentSignUp/>
  }
]
 
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
