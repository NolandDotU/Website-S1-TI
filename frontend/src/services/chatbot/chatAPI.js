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

export const streamChat = (
    message,
    sessionId,
    onChunk,
    onDone,
    onError
) => {
    const url = new URL(apiBaseURL + "/v1/chat/stream");
    url.searchParams.append("message", message);
    url.searchParams.append("session_id", sessionId);

    const es = new EventSource(url.toString());

    es.onmessage = (evt) => {
        try {
            const data = JSON.parse(evt.data);
            if (data.chunk) onChunk(data.chunk);
            if (data.done) {
                onDone();
                es.close();
            }
        } catch (err) {
            console.error("SSE parse error: ", err);
        }
    };

    es.onerror = (err) => {
        onError(err);
        es.close();
    };

    return es;
};

export const getWelcomeMessage = async () => {
    const res = await apiClient.get("/welcome");
    return res.data;
}