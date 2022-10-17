/// <reference types="../../CTAutocomplete" />
export default function checkSkyblock() {
    return Scoreboard.getTitle().toLowerCase().removeFormatting().includes("SKYBLOCK")
}