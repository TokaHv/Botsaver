import { SlashCommandBuilder } from "discord.js";
import { setLofi } from "../music.js";

export default {
  data: new SlashCommandBuilder()
    .setName("setlofi")
    .setDescription("Sets a new LOFI URL for when the queue is empty")
    .addStringOption(option =>
      option
        .setName("url")
        .setDescription("YouTube URL of the LOFI track")
        .setRequired(true)
    ),

  async execute(interaction) {
    // Only the bot owner can use this
    if (interaction.user.id !== process.env.OWNER_ID) {
      return interaction.reply({ content: "❌ Only the bot owner can use this command.", ephemeral: true });
    }

    const url = interaction.options.getString("url");

    if (!url.startsWith("http")) {
      return interaction.reply({ content: "❌ Please provide a valid URL.", ephemeral: true });
    }

    try {
      setLofi(url);
      await interaction.reply(`✅ LOFI URL updated to: ${url}`);
    } catch (err) {
      console.error("Failed to set LOFI URL:", err);
      await interaction.reply({ content: "❌ Could not update LOFI URL.", ephemeral: true });
    }
  },
};
// Set Lofi command placeholder
