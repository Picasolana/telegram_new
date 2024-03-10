import { autoChatAction } from "@grammyjs/auto-chat-action";
import { hydrate } from "@grammyjs/hydrate";
import { hydrateReply, parseMode } from "@grammyjs/parse-mode";
import { BotConfig, StorageAdapter, Bot as TelegramBot, session } from "grammy";
import {
  Context,
  SessionData,
  createContextConstructor,
} from "#root/bot/context.js";
import {
  adminFeature,
  gameFeature,
  languageFeature,
  leaderboardFeature,
  sessionFeature,
  unhandledFeature,
  welcomeFeature,
} from "#root/bot/features/index.js";
import { errorHandler } from "#root/bot/handlers/index.js";
import { i18n, isMultipleLocales } from "#root/bot/i18n.js";
import { updateLogger } from "#root/bot/middlewares/index.js";
import { config } from "#root/config.js";
import { logger } from "#root/logger.js";
import type { PrismaClientX } from "#root/prisma/index.js";
import processPrompt from "./handlers/process-prompt.js";

type Options = {
  prisma: PrismaClientX;
  sessionStorage?: StorageAdapter<SessionData>;
  config?: Omit<BotConfig<Context>, "ContextConstructor">;
};

export function createBot(token: string, options: Options) {
  const { sessionStorage, prisma } = options;
  const bot = new TelegramBot(token, {
    ...options.config,
    ContextConstructor: createContextConstructor({ logger, prisma }),
  });
  const protectedBot = bot.errorBoundary(errorHandler);

  // Middlewares
  bot.api.config.use(parseMode("HTML"));

  if (config.isDev) {
    protectedBot.use(updateLogger());
  }

  protectedBot.use(autoChatAction(bot.api));
  protectedBot.use(hydrateReply);
  protectedBot.use(hydrate());
  protectedBot.use(
    session({
      initial: () => ({}),
      storage: sessionStorage,
    }),
  );
  protectedBot.use(i18n);

  // Handlers
  protectedBot.use(welcomeFeature);
  protectedBot.use(gameFeature);
  protectedBot.use(adminFeature);
  protectedBot.use(sessionFeature);
  protectedBot.use(leaderboardFeature);

  if (isMultipleLocales) {
    protectedBot.use(languageFeature);
  }

  protectedBot.use(async (ctx) => {
    if (ctx.message !== undefined && "text" in ctx.message) {
      // Check if the message is a text message
      const userSession = ctx.session;
      // eslint-disable-next-line unicorn/prefer-ternary
      if (userSession.sessionId) {
        if (ctx.message.text !== undefined) {
          await ctx.reply("Processing your prompt...");
          await processPrompt(ctx.message.text, ctx);
        }
      } else {
        // No active session ID, perhaps prompt the user to start a game or initiate an action
        await ctx.reply(
          "It looks like you don't have an active session. Type /game to start.",
        );
      }
    }
  });
  // must be the last handler
  protectedBot.use(unhandledFeature);

  return bot;
}

export type Bot = ReturnType<typeof createBot>;
