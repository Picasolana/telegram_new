/* eslint-disable import/no-extraneous-dependencies */
import fetch from "node-fetch";

export default async function fetchLeaderboard(): Promise<string> {
  const endpoint = "http://localhost:3000/api/contest/leaderboard";

  try {
    const response = await fetch(endpoint);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const leaderboardData: any = await response.json();

    // Format the leaderboard data into a string
    let leaderboardMessage = "";
    // eslint-disable-next-line no-restricted-syntax
    for (const [index, user] of leaderboardData.entries()) {
      const userScore = user.bestScore.toFixed(6);
      leaderboardMessage += `<b>${index + 1}. ${user.name}</b> - ${userScore}%\n`;
    }

    return leaderboardMessage;
  } catch (error) {
    throw new Error(`Error fetching leaderboard: ${error}`);
  }
}
