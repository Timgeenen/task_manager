import React, { createContext, useContext, useEffect, useState } from 'react';
import { authorizeUser } from '../api/Event';
import { io } from 'socket.io-client';
import { BACKEND } from '../library/constants';

const SocketContext = createContext();
export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(false);

  const validateUser = async () => {
    const res = await authorizeUser();
    console.log(res.message === "Succesfully authorized user")
    if (res.message === "Succesfully authorized user") {
      setIsAuthorized(true);
    }
  };

  useEffect(() => {
    validateUser();
  }, [])

  useEffect(() => {
    if (isAuthorized) {
      const newSocket = io(BACKEND, {
        auth: {
          type: "login"
        },
        withCredentials: true,
      });
      setSocket(newSocket);
      return () => newSocket.close();
    }
  }, [isAuthorized])
  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  )
}

export default SocketProvider
