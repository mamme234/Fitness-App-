import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { bot } from './bot.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// 🏋️ Mock Database Data for Frontend API
const mockWorkouts = [
  { id: 1, name: "Push Day", exercises: "Bench Press, Overhead Press, Tricep Dips", duration: "60 mins" },
  { id: 2, name: "Pull Day", exercises: "Deadlifts, Pull-ups, Barbell Rows", duration: "50 mins" },
  { id: 3, name: "Leg Day", exercises: "Squats, Romanian Deadlifts, Calf Raises", duration: "70 mins" }
];

// 🌐 REST API Endpoints for Vercel Frontend
app.get('/api/workouts', (req, res) => {
  res.json(mockWorkouts);
});

// 🤖 Telegram Bot Webhook Integration
// In production, Render uses webhooks instead of long polling to stay fast and stable
if (process.env.NODE_ENV === 'production') {
  const webhookUrl = `${process.env.RENDER_EXTERNAL_URL}/bot${process.env.BOT_TOKEN}`;
  app.use(bot.webhookCallback(`/bot${process.env.BOT_TOKEN}`));
  bot.telegram.setWebhook(webhookUrl);
  console.log(`🤖 Bot webhook set to: ${webhookUrl}`);
} else {
  // Local development fallback
  bot.launch();
  console.log("🤖 Bot launched via Long Polling (Local Dev Mode)");
}

app.listen(PORT, () => {
  console.log(`🚀 Gym Server running smoothly on port ${PORT}`);
});
