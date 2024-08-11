import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { createViewerToken } from "../API/userAPI";
export const useViewerToken = (hostIdentity) => {
  const [token, setToken] = useState("");
  const [identity, setIdentity] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const createToken = async () => {
      try {
        const response = await createViewerToken(hostIdentity);
        const viewerToken = response?.token;
        if (viewerToken) {
          setToken(viewerToken);
          const decodeToken = jwtDecode(viewerToken);
          const identity = decodeToken.sub;
          setIdentity(identity);
        } else {
          console.error("Token is undefined");
        }
      } catch (error) {
        console.error("Error fetching token:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    createToken();
  }, [hostIdentity]);

  return {
    token,
    identity,
    loading,
    error,
  };
};
