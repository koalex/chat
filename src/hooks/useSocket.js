import { useState, useEffect } from 'react';
import * as io from 'socket.io-client';

const Socket = io('http://localhost:3000', {
  transports: ['websocket'],
  forceNew: false, // single connection is used when connecting to different namespaces (to minimize resources)
  rejectUnauthorized: true,
  secure: process.env.REACT_APP_HTTPS === 'true',
});

function useSocket() {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    Socket.on('connect', () => {
      console.info('socket connected');
      setSocket(Socket);
    });
  }, []);

  useEffect(() => {
    if (!socket) return;
    socket.on('connect_error', console.error);
    socket.on('error', console.error);
    socket.on('disconnect', reason => {
      if (['io server disconnect'].some(v => v === reason)) {
        socket.open();
      }
    });
    socket.on('reconnect_attempt', attemptNumber => {
      if (attemptNumber > 5) {
        socket.io.opts.transports = ['polling', 'websocket'];
      }
    });
  }, [socket]);

  return socket;
}

export default useSocket;
