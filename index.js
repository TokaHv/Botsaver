import { Client, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";
import { player, connectToVC, ensureConnection } from "./music.js";
import fs from "fs";
import path from "path";

dotenv.config();

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates] });

// Load commands dynamically
client.commands = new Map();
const commandsPath = path.join(process.cwd(), "commands");
const commandFiles = fs.readdirSync(commandsPath).filter(f => f.endsWith(".js"));

for (const file of commandFiles) {
  const { default: command } = await import(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

// ================= BOT READY ===================
client.once("ready", async () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
  
  // Auto-join VC if needed
  const guild = client.guilds.cache.get(process.env.GUILD_ID);
  if (guild) {
    ensureConnection(guild);
  }

  console.log("🎧 Bot is ready and listening for commands");
});

// ================= INTERACTIONS =================
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (err) {
    console.error("Error executing command:", err);
    await interaction.reply({ content: "❌ There was an error while executing this command.", ephemeral: true });
  }
});

client.login(process.env.TOKEN);
