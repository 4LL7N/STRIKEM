/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import useWebSocket from "react-use-websocket";
import { jwtDecode } from "jwt-decode";
import { API_BASE_URL } from "../config";



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

  // Declared above the effect below (rather than after it) so nothing references it before its
  // own declaration point - functionally identical either way, since the effect callback only
  // ever runs after this whole component function has finished executing once, but keeping
  // declaration order matching reference order is what the linter (and a plain top-to-bottom
  // read) expects.
  const triggerConnection = () => {
    const fetchWsToken = async () => {
      try {
        const response = await axios(`${API_BASE_URL}/users/auth_for_ws_connection/`, {
          headers: { Authorization: `JWT ${token}` },
        });
        if (response.data.uuid) {
          // Was hardcoded to ws://localhost:5100 - missed by the earlier API_BASE_URL rewrite
          // pass since that only matched http:// strings, not this ws:// one. Derived from
          // API_BASE_URL instead (https -> wss, http -> ws) so it points at whatever backend the
          // rest of the app is actually talking to, local or deployed.
          const wsScheme = API_BASE_URL.startsWith("https") ? "wss" : "ws";
          const wsBase = API_BASE_URL.replace(/^https?/, wsScheme);
          setWsUrl(`${wsBase}/ws/base/?uuid=${response.data.uuid}`);
        } else {
          console.error("Cannot connect: Token is missing.");
        }
      } catch (error) {
        console.error("Failed to fetch WebSocket token:", error);
      }
    };
    fetchWsToken()
  };

  useEffect(() => {
    if(token && token != 'logout' && isTokenExpired(token))triggerConnection();
  }, [token]);

  // Additive pub/sub alongside lastJsonMessage below - lets a component react to incoming
  // messages from inside a real subscription callback (fired straight from the socket's own
  // onmessage event) instead of a useEffect keyed on lastJsonMessage, which calls setState
  // synchronously in the effect body every time a message arrives. lastJsonMessage itself is
  // untouched and still updates the same way it always did, for anything still reading it
  // directly (e.g. InvitationAcceptMemo reads it as a prop, not through an effect, so it doesn't
  // need to move).
  const listenersRef = useRef<Set<(data: any) => void>>(new Set());
  const subscribe = useCallback((listener: (data: any) => void) => {
    listenersRef.current.add(listener);
    return () => {
      listenersRef.current.delete(listener);
    };
  }, []);

  const { sendJsonMessage, lastJsonMessage } = useWebSocket(
    wsUrl,
    {
      onOpen: () => console.log("WebSocket connection opened"),
      onClose: () => console.log("WebSocket connection closed"),
      onError: (event) => console.error("WebSocket error:", event),
      onMessage: (event) => {
        try {
          const data = JSON.parse(event.data);
          listenersRef.current.forEach((listener) => listener(data));
        } catch (err) {
          console.error("Failed to parse WebSocket message:", err);
        }
      },
      shouldReconnect: () => true
    }
  );

  return (
    <WebSocketContext.Provider value={{ sendJsonMessage, lastJsonMessage, triggerConnection, subscribe }}>
      {children}
    </WebSocketContext.Provider>
  );
};
