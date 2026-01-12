import { useEffect, useRef, useState, useCallback } from 'react';

interface UseWebSocketProps {
  url: string;
  onMessage: (data: any) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
}

export const useWebSocket = ({
  url,
  onMessage,
  onConnect,
  onDisconnect
}: UseWebSocketProps) => {
  const ws = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const reconnectTimeout = useRef<number | undefined>(undefined);

  const connect = useCallback(() => {
    try {
      ws.current = new WebSocket(url);
      
      ws.current.onopen = () => {
        setIsConnected(true);
        onConnect?.();
      };
      
      ws.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          onMessage(data);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };
      
      ws.current.onclose = () => {
        setIsConnected(false);
        onDisconnect?.();
        
        // Auto-reconnect after 3 seconds
        reconnectTimeout.current = setTimeout(() => {
          connect();
        }, 3000);
      };
      
      ws.current.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    } catch (error) {
      console.error('Failed to connect:', error);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  const sendMessage = useCallback((message: any) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message));
    }
  }, []);

  const disconnect = useCallback(() => {
    if (reconnectTimeout.current) {
      clearTimeout(reconnectTimeout.current);
    }
    if (ws.current) {
      ws.current.close();
    }
  }, []);

  useEffect(() => {
    connect();
    
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return { isConnected, sendMessage, disconnect };
};

