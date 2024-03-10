/* eslint-disable no-plusplus */
import { Composer } from "grammy";
import type { Context } from "#root/bot/context.js";
import { logHandle } from "#root/bot/helpers/logging.js";
import fetchLeaderboard from "../api/get-leaderboard.js";

const composer = new Composer<Context>();

const feature = composer.chatType("private");

feature.command("leaderboard", logHandle("command-start"), async (ctx) => {
  // Generate leaderboard
  let leaderboardText = "🚀 Leaderboard:\n\n";
  const leaderboardList = await fetchLeaderboard();
  leaderboardText += leaderboardList;

  return ctx.reply(leaderboardText, { parse_mode: "HTML" });
});

export { composer as leaderboardFeature };
