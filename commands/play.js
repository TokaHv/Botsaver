import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { addToQueue, player } from "../music.js";

export default {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Plays a YouTube link or adds it to the queue")
    .addStringOption(option =>
      option
        .setName("url")
        .setDescription("YouTube URL to play")
        .setRequired(true)
    ),

  async execute(interaction) {
    const url = interaction.options.getString("url");

    if (!url.startsWith("http")) {
      const errorEmbed = new EmbedBuilder()
        .setTitle("❌ Invalid URL")
        .setDescription("Please provide a valid YouTube link.")
        .setColor("#e74c3c");
      return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }

    await interaction.deferReply();

    try {
      addToQueue(url);

      const isPlaying = player.state.status === "playing";
      const embed = new EmbedBuilder()
        .setTitle(isPlaying ? "➕ Added to Queue" : "▶ Now Playing")
        .setDescription(`[Click here to open the track](${url})`)
        .setColor("#8e44ad")
        .setFooter({ text: "Ciel Music Bot" });

      await interaction.editReply({ embeds: [embed] });
    } catch (err) {
      console.error("Failed to add to queue:", err);
      const errorEmbed = new EmbedBuilder()
        .setTitle("❌ Error")
        .setDescription("Could not play the track.")
        .setColor("#e74c3c");
      await interaction.editReply({ embeds: [errorEmbed] });
    }
  },
};
