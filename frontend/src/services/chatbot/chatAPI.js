import axios from "axios";
import { env } from "../utils/env";

const apiBaseURL = `${env.BACKEND_URL}`;

const apiClient = axios.create({
  baseURL: `${env.BACKEND_URL}/v1/chat`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const streamChat = (message, sessionId, onChunk, onDone, onError) => {
  try {
    const url = new URL(apiBaseURL + "/v1/chat/stream", window.location.origin);
    console.log("URL : ", url);
    url.searchParams.append("message", message);
    url.searchParams.append("session_id", sessionId);

    const es = new EventSource(url.toString(), { withCredentials: true });

    es.onmessage = (evt) => {
      try {
        const data = JSON.parse(evt.data);

        if (data?.error) {
          onError(new Error(data?.message || "Streaming failed"));
          es.close();
          return;
        }

        if (data.chunk) onChunk(data.chunk);
        if (data.done) {
          onDone();
          es.close();
        }
      } catch (err) {
        console.error("SSE parse error: ", err);
        onError(new Error("Invalid stream payload from server"));
        es.close();
      }
    };

    es.onerror = (err) => {
      onError(new Error("Stream connection failed or interrupted"));
      es.close();
    };

    return es;
  } catch (error) {
    console.log("Stream setup error: ", error);
    onError(new Error("Failed to initiate chat stream"));
  }
};

export const getWelcomeMessage = async () => {
  const res = await apiClient.get("/welcome");
  return res.data;
};

export const getChatHistory = async (sessionId) => {
  const res = await apiClient.get("/history", {
    params: { session_id: sessionId },
  });
  return res.data;
};

export const getOrCreateChatSessionId = () => {
  const key = "chat_session_id";
  const current = localStorage.getItem(key);

  if (current) return current;

  const nextId =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `chat-${Date.now()}-${Math.random().toString(16).slice(2)}`;

  localStorage.setItem(key, nextId);
  return nextId;
};
