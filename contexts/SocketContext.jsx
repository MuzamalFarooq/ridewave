'use client';

import { createContext, useContext, useEffect, useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { io } from 'socket.io-client';

const SocketContext = createContext({
  socket: null,
  isConnected: false,
  onlineUsers: [],
  unreadCount: 0,
  setUnreadCount: () => {},
});

export function SocketProvider({ children }) {
  const { data: session } = useSession();
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!session?.user?.id) return;

    // Initialize socket connection
    const newSocket = io(process.env.NEXT_PUBLIC_APP_URL || '', {
      path: '/api/socket',
      auth: { userId: session.user.id, userName: session.user.name },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    socketRef.current = newSocket;

    newSocket.on('connect', () => {
      setIsConnected(true);
      newSocket.emit('user:join', { userId: session.user.id });
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
    });

    newSocket.on('connect_error', (err) => {
      console.warn('Socket connection error:', err.message);
      setIsConnected(false);
    });

    newSocket.on('users:online', (users) => {
      setOnlineUsers(users);
    });

    newSocket.on('notification:new', () => {
      // Trigger a bell animation / update unread notification count
      setUnreadCount((prev) => prev + 1);
    });

    newSocket.on('message:received', () => {
      setUnreadCount((prev) => prev + 1);
    });

    setSocket(newSocket);

    // Fetch initial unread count
    fetch('/api/conversations/unread')
      .then((r) => r.json())
      .then((d) => setUnreadCount(d.count || 0))
      .catch(() => {});

    return () => {
      newSocket.disconnect();
      socketRef.current = null;
    };
  }, [session?.user?.id]);

  return (
    <SocketContext.Provider value={{ socket, isConnected, onlineUsers, unreadCount, setUnreadCount }}>
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => useContext(SocketContext);
