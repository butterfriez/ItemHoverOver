/// <reference types="../../CTAutocomplete" />
export default function checkSkyblock() {
    return Scoreboard.getTitle().removeFormatting().includes("SKYBLOCK")
}