// eslint-disable-next-line import/no-extraneous-dependencies
import fetch from "node-fetch";

interface TargetPhotoResponse {
  image: string; // The image encoded in base64
}

// Function to fetch the target photo and return the image data
export default async function fetchTargetPhoto(): Promise<string> {
  const endpoint = "http://localhost:3000/api/contest/target";

  try {
    const response = await fetch(endpoint);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Assuming the response is a JSON object containing the base64 encoded image
    const data: TargetPhotoResponse =
      (await response.json()) as TargetPhotoResponse;

    // Return the image data directly
    return data.image;
  } catch (error) {
    throw new Error(`Error fetching target photo: ${error}`);
  }
}
