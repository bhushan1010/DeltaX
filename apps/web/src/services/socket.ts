import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const initSocket = (userId: string) => {
  if (!socket) {
    socket = io(import.meta.env.VITE_API_URL || 'http://localhost:3001', {
      auth: {
        userId,
      },
    });

    socket.on('connect', () => {
      console.log('Socket connected:', socket?.id);
    });

    socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
    });
  }
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const joinLeadRoom = (leadId: string) => {
  if (socket) {
    socket.emit('join_lead_room', leadId);
  }
};

export const leaveLeadRoom = (leadId: string) => {
  if (socket) {
    socket.emit('leave_lead_room', leadId);
  }
};

export const onLeadUpdated = (callback: (data: any) => void) => {
  if (socket) {
    socket.on('lead_updated', callback);
  }
};

export const onLeadAssigned = (callback: (data: any) => void) => {
  if (socket) {
    socket.on('lead_assigned', callback);
  }
};

export const onNewActivity = (callback: (data: any) => void) => {
  if (socket) {
    socket.on('new_activity', callback);
  }
};

export const onStatusChanged = (callback: (data: any) => void) => {
  if (socket) {
    socket.on('status_changed', callback);
  }
};

export const onNotification = (callback: (data: any) => void) => {
  if (socket) {
    socket.on('notification', callback);
  }
};