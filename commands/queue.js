import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { queue, currentTrack, isPlayingLofi } from "../music.js";

export default {
  data: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("Displays the current music queue"),

  async execute(interaction) {
    await interaction.deferReply();

    try {
      if (!currentTrack && queue.length === 0 && !isPlayingLofi) {
        const emptyEmbed = new EmbedBuilder()
          .setTitle("❌ Queue Empty")
          .setDescription("There are no songs in the queue right now.")
          .setColor("#e74c3c")
          .setFooter({ text: "Ciel Music Bot" });
        return interaction.editReply({ embeds: [emptyEmbed] });
      }

      const embed = new EmbedBuilder()
        .setTitle("🎵 Current Queue")
        .setColor("#8e44ad")
        .setFooter({ text: "Ciel Music Bot" });

      if (currentTrack) {
        embed.addFields({ name: "Now Playing", value: currentTrack });
      } else if (isPlayingLofi) {
        embed.addFields({ name: "Now Playing", value: "LOFI Stream" });
      }

      if (queue.length > 0) {
        const upNext = queue
          .map((track, i) => `${i + 1}. ${track}`)
          .join("\n")
          .slice(0, 1024);

        embed.addFields({ name: "Up Next", value: upNext });
      }

      await interaction.editReply({ embeds: [embed] });
    } catch (err) {
      console.error("Failed to show queue:", err);
      const errorEmbed = new EmbedBuilder()
        .setTitle("❌ Error")
        .setDescription("Could not retrieve the queue.")
        .setColor("#e74c3c")
        .setFooter({ text: "Ciel Music Bot" });
      await interaction.editReply({ embeds: [errorEmbed] });
    }
  },
};
