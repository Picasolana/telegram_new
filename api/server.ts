import type { IncomingMessage, ServerResponse } from "node:http";
import { createBot } from "#root/bot/index.js";
import { config } from "#root/config.js";
import { createServer } from "#root/server/index.js";
import { prisma } from "#root/prisma/index.js";

const bot = createBot(config.BOT_TOKEN, { prisma });
const server = await createServer(bot);

export default async (request: IncomingMessage, response: ServerResponse) => {
  await server.ready();
  server.server.emit("request", request, response);
};
