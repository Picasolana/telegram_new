// eslint-disable-next-line import/no-extraneous-dependencies
import fetch from "node-fetch";

// type ResponseDataType = {
//   image: string;
//   index: number;
//   score: object;
// };

// Updated function to submit contest data and return the API response
export default async function submitContestData(
  prompt: string,
  sessionId: string,
): Promise<{ image: string; index: number; score: number }> {
  const endpoint = "http://localhost:3000/api/contest/submit";
  const body = {
    prompt,
    sessionId,
  };

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Include any other headers your API requires
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Parse the JSON response and return it
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const responseData: any = await response.json(); // Assuming the API responds with JSON

    // Return the parsed response
    return {
      image: responseData.image,
      index: responseData.index,
      score: responseData.score.score,
    };
  } catch {
    return { image: "", index: -1, score: -1 };
  }
}
