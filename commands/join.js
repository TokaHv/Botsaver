import { SlashCommandBuilder } from "discord.js";
import { connectToVC, ensureConnection } from "../music.js";

export default {
  data: new SlashCommandBuilder()
    .setName("join")
    .setDescription("Bot joins your voice channel"),

  async execute(interaction) {
    const memberVC = interaction.member.voice.channel;
    if (!memberVC) {
      return interaction.reply({ content: "❌ You must be in a voice channel!", ephemeral: true });
    }

    try {
      const connection = connectToVC(memberVC);
      ensureConnection(interaction.guild);
      await interaction.reply(`✅ Joined ${memberVC.name}!`);
    } catch (err) {
      console.error("Failed to join VC:", err);
      await interaction.reply({ content: "❌ Could not join the voice channel.", ephemeral: true });
    }
  },
};
