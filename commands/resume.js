import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { resumeSong, player } from "../music.js";

export default {
  data: new SlashCommandBuilder()
    .setName("resume")
    .setDescription("Resumes the currently paused song"),

  async execute(interaction) {
    // Defer reply to prevent timeout
    await interaction.deferReply();

    // Check if something is paused
    if (player.state.status !== "paused") {
      const errorEmbed = new EmbedBuilder()
        .setTitle("❌ Nothing is paused")
        .setDescription("There is no paused track to resume.")
        .setColor("#e74c3c")
        .setFooter({ text: "Ciel Music Bot" });
      return interaction.editReply({ embeds: [errorEmbed] });
    }

    try {
      resumeSong();
      const embed = new EmbedBuilder()
        .setTitle("▶ Resumed")
        .setDescription("The current track has been resumed.")
        .setColor("#8e44ad")
        .setFooter({ text: "Ciel Music Bot" });

      await interaction.editReply({ embeds: [embed] });
    } catch (err) {
      console.error("Failed to resume song:", err);
      const errorEmbed = new EmbedBuilder()
        .setTitle("❌ Error")
        .setDescription("Could not resume the song.")
        .setColor("#e74c3c")
        .setFooter({ text: "Ciel Music Bot" });

      await interaction.editReply({ embeds: [errorEmbed] });
    }
  },
};
