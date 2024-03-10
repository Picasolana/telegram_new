/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line import/no-extraneous-dependencies
import fetch from "node-fetch";
import { InputFile } from "grammy";
import fs from "node:fs";
import { Context } from "../context.js";

export default async function getBest(
  telegram: string,
  ctx: Context,
): Promise<void> {
  // First, get the session ID associated with the Telegram user
  const endpointSession = `http://localhost:3000/api/session/telegram/${telegram}`;

  try {
    const responseSession = await fetch(endpointSession);
    if (!responseSession.ok) {
      throw new Error(`HTTP error! status: ${responseSession.status}`);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dataSession: any = await responseSession.json();
    const { sessionId } = dataSession;

    if (!sessionId) {
      console.log("No session ID found for the given Telegram handle.");
      await ctx.reply("No session information available.");
      return;
    }

    // Now, use the session ID to get the best score
    const endpointBestScore = `http://localhost:3000/api/contest/best/${sessionId}`;
    const responseBestScore = await fetch(endpointBestScore);
    if (!responseBestScore.ok) {
      throw new Error(`HTTP error! status: ${responseBestScore.status}`);
    }
    const dataBestScore: any = await responseBestScore.json();

    // Prepare the message with prompt, score, and send the image as a separate message
    const message = `Best score: ${dataBestScore.score}\nPrompt: ${dataBestScore.prompt}`;

    // Send the base64 image as a photo
    // Assuming dataBestScore.image contains the base64-encoded image
    const base64Image = dataBestScore.image.split(";base64,").pop();

    if (base64Image === undefined) {
      // Handle the case where base64Image is undefined
      throw new TypeError("base64Image is undefined");
    }

    const imageBuffer = Buffer.from(base64Image, "base64");

    const filePath = `./temp-photo-${Date.now()}.jpg`;
    fs.writeFileSync(filePath, imageBuffer);
    const file = new InputFile(filePath);

    await ctx
      .replyWithPhoto(file, {
        caption: message,
      })
      .then(() => {
        fs.unlinkSync(filePath); // Clean up the file after sending
      })
      .catch((error) => {
        ctx.reply("Failed to send photo.");
        throw new Error(`Failed to send photo: ${error}`);
      });
  } catch (error) {
    await ctx.reply("Failed to fetch best score information.");
    throw new Error(`Error fetching best score: ${error}`);
  }
}
