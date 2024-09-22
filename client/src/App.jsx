import { useEffect, useState } from "react";

import "./App.css";
// import { Button } from "./components/ui/button";
import Signup from "./component/Signup";

import Login from "./component/Login";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "./component/MainLayout";
import Home from "./component/Home";
import Profile from "./component/Profile";
import EditProfile from "./component/EditProfile";
import ChatPage from "./component/ChatPage";
import { io } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { setSocket } from "./redux/socketSlice";
import { setOnlineUser } from "./redux/chatSlice";
import { setLikeNotification } from "./redux/rtnSlice";
import ProtectedRoute from "./component/ProtectedRoute";

  // const [count, setCount] = useState(0);
  const browserRouter = createBrowserRouter([
    {
      path: "/",
      element: <ProtectedRoute><MainLayout /></ProtectedRoute>,
      children: [
        { path: "/", element:<ProtectedRoute> <Home /></ProtectedRoute> },
        { path: "/profile/:id", element:<ProtectedRoute> <Profile /></ProtectedRoute> },
        { path: "/profile/edit", element: <ProtectedRoute><EditProfile /></ProtectedRoute> },
        { path: "/chat", element: <ProtectedRoute><ChatPage /></ProtectedRoute> },
      ],
    },
    {
      path: "/login",
      element: <Login />,
    },
    { path: "/signup", element: <Signup /> },
  ]);
function App() {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const {socket} = useSelector(store=>store.socketio)
  useEffect(() => {
    if (user) {
      const socketio = io(`${import.meta.env.VITE_APP}`, {
        query: {
          userId: user?._id,
        },
        transports: ["websocket"],
      });
      dispatch(setSocket(socketio));
      socketio.on("getOnlineUsers", (onlineUsers) => {
        dispatch(setOnlineUser(onlineUsers));
      });
      socketio.on('notification',(notification)=>{
        dispatch(setLikeNotification(notification))
      })
      return () => {
        socketio.close();
        dispatch(setSocket(null));
      };
    } else if(socket){
      socket.close();
      dispatch(setSocket(null));
    }
  }, [user, dispatch]);
  return (
    <>
      <RouterProvider router={browserRouter} />
    </>
  );
}

export default App;
