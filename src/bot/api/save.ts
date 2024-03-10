// eslint-disable-next-line import/no-extraneous-dependencies
import fetch from "node-fetch";

export default async function saveSession(
  sessionId: string,
  telegramHandle: string,
) {
  const endpoint = "http://localhost:3000/api/session/save";
  const body = {
    sessionId,
    telegramHandle,
  };

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (
      data &&
      typeof data === "object" &&
      "status" in data &&
      data.status === "OK"
    ) {
      console.log("Session saved successfully.");
      return "OK";
    }
    console.log("Failed to save session. Server did not return OK status.");
    return "Error";
  } catch (error) {
    console.error("Error saving session:", error);
    return "Error";
  }
}
