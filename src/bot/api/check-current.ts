/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line import/no-extraneous-dependencies
import fetch from "node-fetch";

export default async function check(telegram: string): Promise<boolean> {
  // First, get the session ID associated with the Telegram user
  const endpointSession = `http://localhost:3000/api/session/telegram/${telegram}`;

  const responseSession = await fetch(endpointSession);

  if (!responseSession.ok) {
    console.log("No session ID found for the given Telegram handle.");
    return false;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dataSession: any = await responseSession.json();
  const { sessionId } = dataSession;
  if (sessionId) {
    console.log(`Session ID found for the given Telegram handle: ${sessionId}`);
    return true;
  }
  return false;
}
