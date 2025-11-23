// ==============================
// Register Slash Commands Script
// ==============================

import { REST, Routes } from "discord.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;
const TOKEN = process.env.TOKEN;

if (!CLIENT_ID || !GUILD_ID || !TOKEN) {
  console.error("❌ Please set CLIENT_ID, GUILD_ID, and TOKEN in .env");
  process.exit(1);
}

// Load all command files
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));

const commands = [];

for (const file of commandFiles) {
  const command = await import(`./commands/${file}`);
  if (command.default && command.default.data) {
    commands.push(command.default.data.toJSON());
  }
}

const rest = new REST({ version: "10" }).setToken(TOKEN);

(async () => {
  try {
    console.log(`Registering ${commands.length} commands globally...`);
    await rest.put(
      Routes.applicationCommands(CLIENT_ID),
      { body: commands }
    );
    console.log("✅ Commands registered successfully!");
  } catch (err) {
    console.error("❌ Failed to register commands:", err);
  }
})();
    // Register slash commands placeholder