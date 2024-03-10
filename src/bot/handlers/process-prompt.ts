import { InputFile } from "grammy";
import type { Context } from "#root/bot/context.js";
import fs from "node:fs";
import submitContestData from "../api/submit.js";
import saveSession from "../api/save.js";
import getBest from "../api/get-best.js";

export default async function processPrompt(text: string, ctx: Context) {
  // creates new session id and stores it in the context
  // Fetch the photo from the API
  if (ctx.session.sessionId === undefined) {
    await ctx.reply("Session id is undefined, restart the bot with /game");
    return;
  }
  const response = await submitContestData(text, ctx.session.sessionId);
  if (response.index === -1) {
    await ctx.reply("You have already played today, try tomorrow!");
    return;
  }
  // stringify response to see the object
  const base64Data = response.image;
  // Ensure the base64 string does not include the data URL scheme
  const base64Image = base64Data.split(";base64,").pop();

  if (base64Image === undefined) {
    // Handle the case where base64Image is undefined
    throw new TypeError("base64Image is undefined");
  }

  const imageBuffer = Buffer.from(base64Image, "base64");

  const filePath = `./temp-photo-${Date.now()}.jpg`;
  fs.writeFileSync(filePath, imageBuffer);
  const file = new InputFile(filePath);
  if (response.index === 4) {
    if (ctx.chat !== undefined) {
      await saveSession(ctx.session.sessionId, ctx.chat.id.toString());
    }
    await ctx
      .replyWithPhoto(file, {
        caption: `This was your LAST try: ${response.score} points. \n\n Well done!`,
      })
      .then(() => {
        fs.unlinkSync(filePath); // Clean up the file after sending
      })
      .catch((error) => {
        throw new Error(`Failed to send photo: ${error}`);
        ctx.reply("Failed to send photo.");
      });

    // send the best try
    await getBest(ctx.from?.id.toString() ?? "", ctx);
    await ctx.reply(
      "You have reached the maximum number of tries. \n\nCheck our bot at the end of the day and we will send you a message if your image was the closest to the one we provided to receive your NFT 🙌",
    );
  } else {
    await ctx
      .replyWithPhoto(file, {
        caption: `Here is the result: ${response.score} points. \n\nThis is the try ${response.index + 1} out of 5. \n\nCan you make it better? Try with modified prompt! \n\n P.S Pay attention to the details.`,
      })
      .then(() => {
        fs.unlinkSync(filePath); // Clean up the file after sending
      })
      .catch((error) => {
        throw new Error(`Failed to send photo: ${error}`);
        ctx.reply("Failed to send photo.");
      });
  }
}
