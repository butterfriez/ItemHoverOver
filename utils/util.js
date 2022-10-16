/// <reference types="../../CTAutocomplete" />
export default function checkSkyblock() {
    if(Scoreboard.getTitle().removeFormatting().includes("SKYBLOCK")) {
        return true
    } else return false
}