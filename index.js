// ===========================
//  Discord 24/7 Music Bot
// ===========================

import { Client, GatewayIntentBits, Collection } from "discord.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { config as dotenvConfig } from "dotenv";
dotenvConfig(); // Load TOKEN, VC_ID, LOFI_URL, etc

// Start keepalive server for Render
import "./keepalive/server.js";

import { player, connectToVC, autoPlayLofi } from "./music.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============ BOT CLIENT ===============
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages
  ]
});

client.commands = new Collection();

// ============ COMMAND LOADER ============
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = await import(`./commands/${file}`);
  client.commands.set(command.default.data.name, command.default);
}

console.log(`Loaded ${client.commands.size} commands.`);

// ============ BOT READY EVENT ============
client.once("ready", async () => {
  console.log(`Logged in as ${client.user.tag}`);

  // Auto-join VC 24/7
  const vcId = process.env.VC_ID;
  if (!vcId) return console.error("❌ VC_ID not set in environment variables.");

  const guildId = process.env.GUILD_ID;
  const guild = client.guilds.cache.get(guildId);

  if (!guild) return console.error("❌ Guild not found. Check GUILD_ID.");

  const channel = guild.channels.cache.get(vcId);
  if (!channel) return console.error("❌ Voice channel not found. Check VC_ID.");

  console.log("Connecting to voice channel...");
  await connectToVC(channel);

  // Start auto-play system
  autoPlayLofi();

  console.log("Bot is fully ready.");
});

// ============ INTERACTION HANDLER ============
client.on("interactionCreate", async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.default.execute(interaction, client, player);
  } catch (e) {
    console.error(e);
    interaction.reply({ content: "❌ Error executing command.", ephemeral: true });
  }
});

// ============ LOGIN BOT ============
client.login(process.env.TOKEN);
