import { useState } from 'react';
import { io } from 'socket.io-client';

const createSocketConnection = (namespace) =>{
    
  // Connect to the server with the specified namespace
  const socket = io(`http://localhost:3000`, {
    query: { title: namespace }
  });

  // Handle the connection event
  socket.on('connect', () => {
    console.log(`Connected to room: ${namespace} `);
    
  });
  function sendInputUpdate(input) {
    socket.emit('inputUpdate', input);
  }
  // Handle the disconnection event
  socket.on('disconnect', () => {
    console.log(`Disconnected from room: ${namespace}`);
  });

 

  // Return the socket and sendMessage function for use in your application
  return { socket};
}

export default createSocketConnection;
