import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { connectToVC, ensureConnection } from "../music.js";

export default {
  data: new SlashCommandBuilder()
    .setName("join")
    .setDescription("Bot joins your voice channel"),

  async execute(interaction) {
    // Defer reply immediately
    await interaction.deferReply();

    const memberVC = interaction.member.voice.channel;
    if (!memberVC) {
      const errorEmbed = new EmbedBuilder()
        .setTitle("❌ Not in a Voice Channel")
        .setDescription("You must be in a voice channel for the bot to join.")
        .setColor("#8e44ad")
        .setFooter({ text: "Ciel Music Bot" });
      return interaction.editReply({ embeds: [errorEmbed] });
    }

    try {
      connectToVC(memberVC);
      ensureConnection(interaction.guild);

      const embed = new EmbedBuilder()
        .setTitle("✅ Joined Voice Channel")
        .setDescription(`Now connected to **${memberVC.name}**.`)
        .setColor("#8e44ad")
        .setFooter({ text: "Ciel Music Bot" });

      await interaction.editReply({ embeds: [embed] });
    } catch (err) {
      console.error("Failed to join VC:", err);
      const errorEmbed = new EmbedBuilder()
        .setTitle("❌ Error")
        .setDescription("Could not join the voice channel.")
        .setColor("#e74c3c")
        .setFooter({ text: "Ciel Music Bot" });

      await interaction.editReply({ embeds: [errorEmbed] });
    }
  },
};
