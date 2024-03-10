// eslint-disable-next-line import/no-extraneous-dependencies
import fetch from "node-fetch";
import { Context } from "../context.js";

type dataType = {
  sessionId: string;
};

// Function to fetch a new session ID from the API and store it in session storage
export default async function fetchAndStoreSessionId(
  ctx: Context,
): Promise<void> {
  const endpoint = "http://127.0.0.1:3000/api/session/new";

  try {
    const response = await fetch(endpoint, {
      method: "POST", // Specify the method as POST
      headers: {
        "Content-Type": "application/json",
        // Include any other headers your API requires
      },
      // Include any necessary body content. If your API does not require a body, you can omit this.
      // body: JSON.stringify({ key: 'value' }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status} and ${response}`);
    }

    const data: dataType = (await response.json()) as dataType;
    if (data.sessionId) {
      ctx.session.sessionId = data.sessionId; // Assuming session middleware is properly configured
    }
  } catch (error) {
    throw new Error(`Error fetching session ID: ${error}`);
  }
}
