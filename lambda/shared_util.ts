import { DISCORD_COMMAND_PREFIX } from "../minecloud_configs/config";

export function getFullDiscordCommand(command: string){
    return `${DISCORD_COMMAND_PREFIX}_${command}`
  }