import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { clearQueue } from "../music.js";

export default {
  data: new SlashCommandBuilder()
    .setName("clearqueue")
    .setDescription("Clears all tracks in the queue"),

  async execute(interaction) {
    await interaction.deferReply();

    try {
      clearQueue();
      const embed = new EmbedBuilder()
        .setTitle("🗑 Queue Cleared")
        .setDescription("All tracks in the queue have been removed.")
        .setColor("#8e44ad")
        .setFooter({ text: "Ciel Music Bot" });

      await interaction.editReply({ embeds: [embed] });
    } catch (err) {
      console.error("Failed to clear queue:", err);
      const errorEmbed = new EmbedBuilder()
        .setTitle("❌ Error")
        .setDescription("Could not clear the queue.")
        .setColor("#e74c3c")
        .setFooter({ text: "Ciel Music Bot" });

      await interaction.editReply({ embeds: [errorEmbed] });
    }
  },
};
