import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { pauseSong, player } from "../music.js";

export default {
  data: new SlashCommandBuilder()
    .setName("pause")
    .setDescription("Pauses the current song"),

  async execute(interaction) {
    await interaction.deferReply();

    if (player.state.status !== "playing") {
      const errorEmbed = new EmbedBuilder()
        .setTitle("❌ Nothing is playing")
        .setDescription("There is no track currently playing.")
        .setColor("#e74c3c")
        .setFooter({ text: "Ciel Music Bot" });
      return interaction.editReply({ embeds: [errorEmbed] });
    }

    try {
      pauseSong();
      const embed = new EmbedBuilder()
        .setTitle("⏸ Paused")
        .setDescription("The current track has been paused.")
        .setColor("#8e44ad")
        .setFooter({ text: "Ciel Music Bot" });

      await interaction.editReply({ embeds: [embed] });
    } catch (err) {
      console.error("Failed to pause song:", err);
      const errorEmbed = new EmbedBuilder()
        .setTitle("❌ Error")
        .setDescription("Could not pause the song.")
        .setColor("#e74c3c")
        .setFooter({ text: "Ciel Music Bot" });

      await interaction.editReply({ embeds: [errorEmbed] });
    }
  },
};
