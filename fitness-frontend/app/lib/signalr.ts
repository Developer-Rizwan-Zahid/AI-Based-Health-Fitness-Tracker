'use client';

import * as signalR from '@microsoft/signalr';

let hubConnection: signalR.HubConnection | null = null;

export const getHubConnection = () => {
  if (!hubConnection) {
    hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('http://localhost:5137/fitnessHub', {
        accessTokenFactory: () => localStorage.getItem('token') || '',
      })
      .withAutomaticReconnect()
      .build();
  }
  return hubConnection;
};

export const startHub = async () => {
  const connection = getHubConnection();
  if (connection.state === signalR.HubConnectionState.Disconnected) {
    try {
      await connection.start();
      console.log('✅ SignalR Connected');
    } catch (err) {
      console.error('❌ SignalR Connection Error:', err);
    }
  }
  return connection;
};
