import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
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
    // Defer reply
    await interaction.deferReply({ ephemeral: true });

    // Only the bot owner can use this
    if (interaction.user.id !== process.env.OWNER_ID) {
      const errorEmbed = new EmbedBuilder()
        .setTitle("❌ Access Denied")
        .setDescription("Only the bot owner can use this command.")
        .setColor("#e74c3c")
        .setFooter({ text: "Ciel Music Bot" });
      return interaction.editReply({ embeds: [errorEmbed] });
    }

    const url = interaction.options.getString("url");

    if (!url.startsWith("http")) {
      const errorEmbed = new EmbedBuilder()
        .setTitle("❌ Invalid URL")
        .setDescription("Please provide a valid YouTube URL.")
        .setColor("#e74c3c")
        .setFooter({ text: "Ciel Music Bot" });
      return interaction.editReply({ embeds: [errorEmbed] });
    }

    try {
      setLofi(url);
      const embed = new EmbedBuilder()
        .setTitle("✅ LOFI Updated")
        .setDescription(`LOFI URL has been updated to:\n${url}`)
        .setColor("#8e44ad")
        .setFooter({ text: "Ciel Music Bot" });

      await interaction.editReply({ embeds: [embed] });
    } catch (err) {
      console.error("Failed to set LOFI URL:", err);
      const errorEmbed = new EmbedBuilder()
        .setTitle("❌ Error")
        .setDescription("Could not update LOFI URL.")
        .setColor("#e74c3c")
        .setFooter({ text: "Ciel Music Bot" });

      await interaction.editReply({ embeds: [errorEmbed] });
    }
  },
};
