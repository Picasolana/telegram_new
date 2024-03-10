import { Composer, InputFile } from "grammy";
import type { Context } from "#root/bot/context.js";
import { logHandle } from "#root/bot/helpers/logging.js";
import fs from "node:fs";
import fetchAndStoreSessionId from "../api/get-session.js";
import fetchTargetPhoto from "../api/get-image.js";
import check from "../api/check-current.js";

const composer = new Composer<Context>();

const feature = composer.chatType("private");

feature.command("game", logHandle("command-game"), async (ctx) => {
  if (await check(ctx.msg.from.id.toString())) {
    return ctx.reply("You have already played today, try tomorrow!");
  }
  // creates new session id and stores it in the context
  await fetchAndStoreSessionId(ctx);
  // Fetch the photo from the API
  const base64Data = await fetchTargetPhoto();
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

  await ctx
    .replyWithPhoto(file, {
      caption:
        "Welcome to the game! \n\n Now send a prompt that you think will get you close to this picture",
    })
    .then(() => {
      fs.unlinkSync(filePath); // Clean up the file after sending
    })
    .catch((error) => {
      throw new Error(`Failed to send photo: ${error}`);
      ctx.reply("Failed to send photo.");
    });
});

export { composer as gameFeature };
