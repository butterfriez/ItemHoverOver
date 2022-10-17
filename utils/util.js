/// <reference types="../../CTAutocomplete" />
import { soundList } from "./SoundList"
function checkSkyblock() {
    return Scoreboard.getTitle().removeFormatting().includes("SKYBLOCK")
}

function checkSound(String) {
    return soundList.includes(String)
}

export { checkSkyblock, checkSound }