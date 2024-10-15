import { APP_URL, PORT, TELEGRAM_TOKEN } from "./constants";
import express, { Application } from "express";
import { Telegraf } from "telegraf";

// Initialize Express and Telegraf bot
const bot = new Telegraf(TELEGRAM_TOKEN);
const app: Application = express();

// Serve static files
app.use(express.static("static"));
app.use(express.json());

// Basic route
app.get("/", (_, res) => {
  res.send("Hello World");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

// Start command for Telegram bot
bot.command("start", (ctx) => {
  // Check if APP_URL is HTTPS
  if (APP_URL.startsWith("https://")) {
    return ctx.reply(`Play Cool Frog!`, {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: `Play Game`,
              web_app: { url: `${APP_URL}` },  // Use web_app button with HTTPS URL
            },
          ],
        ],
      },
    });
  } else {
    return ctx.reply(`The provided URL is not valid. Please use an HTTPS URL.`);
  }
});

// Error handling for the bot launch
bot.launch().then(() => {
  console.log("Bot is up and running");
}).catch((error) => {
  console.error("Failed to launch the bot:", error);
});

// Graceful shutdown
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

export default app;
