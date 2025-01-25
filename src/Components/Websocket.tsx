/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react-hooks/exhaustive-deps */
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import useWebSocket from "react-use-websocket";
import { jwtDecode } from "jwt-decode";



const WebSocketContext = createContext<any>(null);

export const useWebSocketContext = () => useContext(WebSocketContext);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wsUrl, setWsUrl] = useState<string|null>(null);


  const token = Cookies.get("token");


  const isTokenExpired = (token:string) => {
      try {
          const decoded = jwtDecode(token);
          const currentTime = Math.floor(Date.now() / 1000);
          if(decoded.exp){ // Current time in seconds
          return decoded.exp > currentTime
          }
          return false // Check if the token is expired
      } catch (error) {
          console.error("Invalid token:", error);
          return true; // Treat as expired if decoding fails
      }
  };

  useEffect(() => {
    if(token && token != 'logout' && isTokenExpired(token))triggerConnection();
  }, [token]);

  const { sendJsonMessage, lastJsonMessage } = useWebSocket(
    wsUrl,
    {
      onOpen: () => console.log("WebSocket connection opened"),
      onClose: () => console.log("WebSocket connection closed"),
      onError: (event) => console.error("WebSocket error:", event),
      shouldReconnect: () => true
    }
  );

  const triggerConnection = () => {
    const fetchWsToken = async () => {
      try {
        const response = await axios("https://strikem.site/users/auth_for_ws_connection/", {
          headers: { Authorization: `JWT ${token}` },
        });
        if (response.data.uuid) {
          setWsUrl(`wss://strikem.site/ws/base/?uuid=${response.data.uuid}`);
        } else {
          console.error("Cannot connect: Token is missing.");
        }
      } catch (error) {
        console.error("Failed to fetch WebSocket token:", error);
      }
    };
    fetchWsToken()
  };

  return (
    <WebSocketContext.Provider value={{ sendJsonMessage, lastJsonMessage,triggerConnection}}>
      {children}
    </WebSocketContext.Provider>
  );
};
