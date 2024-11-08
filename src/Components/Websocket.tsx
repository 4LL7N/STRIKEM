/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react-hooks/exhaustive-deps */
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import useWebSocket from "react-use-websocket";


// interface User {
//     id: number;
//     email: string;
//     first_name: string;
//     last_name: string;
//     username:string;
//   }
  
//   interface Profile {
//     games_played: number;
//     games_won: number;
//     id: number;
//     inviting_to_play: boolean;
//     opponents_met: number;
//     profile_image: string;
//     total_points: number;
//     user:User
//   }

const WebSocketContext = createContext<any>(null);

export const useWebSocketContext = () => useContext(WebSocketContext);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [invitationAccept,setInvitationAccept] = useState<any>()
  const [wsToken, setWsToken] = useState<string | null>(null);
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
    fetchWsToken();
  }, [token]);

  const { sendJsonMessage, lastJsonMessage } = useWebSocket(
    wsToken ? `wss://strikem.site/ws/base/?uuid=${wsToken}` : null,
    {
      onOpen: () => console.log("WebSocket connection opened"),
      onClose: () => console.log("WebSocket connection closed"),
      onError: (event) => console.error("WebSocket error:", event),
    }
  );

  // Provide the WebSocket context to children
  return (
    <WebSocketContext.Provider value={{ sendJsonMessage, lastJsonMessage,invitationAccept,setInvitationAccept}}>
      {children}
    </WebSocketContext.Provider>
  );
};
