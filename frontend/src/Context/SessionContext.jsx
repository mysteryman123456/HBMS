import React, { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export const SessionContext = createContext();

export const SessionProvider = ({ children }) => {
  const [sessionData, setSessionData] = useState(null);
  const [sessionLoading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedData = jwtDecode(token);
        setSessionData(decodedData);
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem("token");
        setSessionData(null);
      }
    }
    setLoading(false); // Mark loading as complete
  }, []);

  return (
    <SessionContext.Provider value={{ sessionData, setSessionData, sessionLoading }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => useContext(SessionContext);
