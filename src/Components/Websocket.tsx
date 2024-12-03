/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react-hooks/exhaustive-deps */
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import useWebSocket from "react-use-websocket";



const WebSocketContext = createContext<any>(null);

export const useWebSocketContext = () => useContext(WebSocketContext);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [invitationAccept,setInvitationAccept] = useState<any>()
    const [logedIn,setLogedIn] = useState<boolean>(false)
  const [wsToken, setWsToken] = useState<string | null>(null);
  const [wsUrl, setWsUrl] = useState<string|null>(null);
  const token = Cookies.get("token");

  // Fetch the WebSocket token
  useEffect(() => {
    const fetchWsToken = async () => {
      try {
        const response = await axios("https://strikem.site/users/auth_for_ws_connection/", {
          headers: { Authorization: `JWT ${token}` },
        });
        setWsToken(response.data.uuid);
      } catch (error) {
        console.error("Failed to fetch WebSocket token:", error);
      }
    };
    if(token && token != 'logout')fetchWsToken();
  }, [token]);

  const { sendJsonMessage, lastJsonMessage } = useWebSocket(
    wsUrl,
    {
      onOpen: () => console.log("WebSocket connection opened"),
      onClose: () => console.log("WebSocket connection closed"),
      onError: (event) => console.error("WebSocket error:", event),
    }
  );

  const triggerConnection = () => {
    if (wsToken) {
      setWsUrl(`wss://strikem.site/ws/base/?uuid=${wsToken}`);
    } else {
      console.error("Cannot connect: wsToken is missing.");
    }
  };

  return (
    <WebSocketContext.Provider value={{ sendJsonMessage, lastJsonMessage,invitationAccept,setInvitationAccept,logedIn,setLogedIn,triggerConnection}}>
      {children}
    </WebSocketContext.Provider>
  );
};
