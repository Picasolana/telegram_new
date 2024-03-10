import { Composer } from "grammy";
import type { Context } from "#root/bot/context.js";
import { logHandle } from "#root/bot/helpers/logging.js";

const composer = new Composer<Context>();

const feature = composer.chatType("private");

feature.command("start", logHandle("command-start"), (ctx) => {
  return ctx.reply(
    "Welcome to the Picassolana! \n\n📍Rules:\n1 - You can play once a day. You have 5 tries to get as close as possible to provided image using AI \n2 - You have to guess the prompt that will get you close to the picture\n3 - Try to get as close as possible to win your generated art as an NFT on Solana 💫 \n\nTo start a game, use /game command. \n\nAt the end of the day we will announce winners!",
  );
});

export { composer as welcomeFeature };
