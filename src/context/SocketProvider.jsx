import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { BACKEND } from '../library/constants';
import useAuthorize from '../hooks/useAuthorize';

const SocketContext = createContext();
export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  
  const [isAuthorized] = useAuthorize();

  useEffect(() => {
    if (isAuthorized) {
      const newSocket = io(BACKEND, {
        auth: {
          type: "login"
        },
        withCredentials: true,
      });
      setSocket(newSocket);
      return () => {
        newSocket.close();
        setSocket(null);
      }
    }
    if (!isAuthorized && socket) {
      socket.close();
      setSocket(null);
    }
  }, [isAuthorized]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  )
}

export default SocketProvider
