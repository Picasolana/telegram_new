import { Composer } from "grammy";
import type { Context } from "#root/bot/context.js";
import { logHandle } from "#root/bot/helpers/logging.js";

const composer = new Composer<Context>();

const feature = composer.chatType("private");

feature.command("session", logHandle("command-session"), async (ctx) => {
  return ctx.reply(`Session id is ${ctx.session.sessionId}`);
});

export { composer as sessionFeature };
