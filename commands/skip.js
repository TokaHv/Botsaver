import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { skipSong } from "../music.js";

export default {
  data: new SlashCommandBuilder()
    .setName("skip")
    .setDescription("Skips the current track"),

  async execute(interaction) {
    await interaction.deferReply();

    try {
      skipSong();

      const embed = new EmbedBuilder()
        .setTitle("⏭ Skipped")
        .setDescription("The current track has been skipped.")
        .setColor("#9b59b6");

      await interaction.editReply({ embeds: [embed] });
    } catch (err) {
      console.error("Skip Error:", err);

      const errorEmbed = new EmbedBuilder()
        .setTitle("❌ Error")
        .setDescription("Could not skip the track.")
        .setColor("#e74c3c");

      await interaction.editReply({ embeds: [errorEmbed] });
    }
  }
};
