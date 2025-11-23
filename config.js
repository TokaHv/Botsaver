import dotenv from "dotenv";
dotenv.config();

export const config = {
  TOKEN: process.env.TOKEN,
  CLIENT_ID: process.env.CLIENT_ID,
  GUILD_ID: process.env.GUILD_ID,
  VC_ID: process.env.VC_ID,
  OWNER_ID: process.env.OWNER_ID,
  LOFI_URL: process.env.LOFI_URL,
  PORT: process.env.PORT || 3000
};
