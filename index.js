/// <reference types="../CTAutocomplete" />

//useless shit
//import "./fuckofftictactoeplayer"

import PogObject from "../PogData"
import Lore from "../Lore"
//util
import { checkSkyblock, checkSound } from "./utils/util"
//prefix
const prefix = "&7[&r&3Item Hover Over&r&7] &r"
//variables
const GuiTextField = Java.type("net.minecraft.client.gui.GuiTextField")
let searchBar = new GuiTextField(0, Client.getMinecraft().field_71466_p,  Renderer.screen.getWidth() / 3.5, Renderer.screen.getHeight() / 1.7, 100, 10);
let searchTerm = "";
const soundComponent = new TextComponent(" &4/ho sound <sound> &r: &eChanges typing sound&r &lChoose sound from this website: https://www.minecraftforum.net/forums/mapping-and-modding-java-edition/mapping-and-modding-tutorials/2213619-1-8-all-playsound-sound-arguments&r &e&l<CASE SENSITIVE>").setHover("show_text", ("Open Sound Url")).setClick("open_url", "https://www.minecraftforum.net/forums/mapping-and-modding-java-edition/mapping-and-modding-tutorials/2213619-1-8-all-playsound-sound-arguments")
//data
const firstTimeMessage = new TextComponent(`${prefix} &l&eWelcome, use &4/hoverover &eto check commands. \n&rLore deletes when you change gui, or click an item idk why lol`).setClick("run_command", "/ho").setHover("show_text", "&7Run &e&l/hoverover")
const data = new PogObject("ItemHoverOver", {
  firsttime: true,
  toggle: false,
  sound: "note.hat",
}, "data.json")
let sound = data.sound

if(data.firsttime == true) {
  data.firsttime = false
  firstTimeMessage.chat()
}
//togglecommand
register("Command", (...args) => {
  switch (args[0]) {
    case "toggle":
      if(data.toggle == false) {
        data.toggle = true
        data.save()
        ChatLib.chat(`${prefix} &4Hover: &r&l${data.toggle}`)
      } else {
        data.toggle = false
        data.save()
        ChatLib.chat(`${prefix} &4Hover: &r&l${data.toggle}`)
      }
      break;
    case "sound":
      let args1 = args[1]
      if(checkSound(args1) == true) {
        sound = args1
        ChatLib.chat(`${prefix} &4Sound check success!`)
        data.save()
      } else {
        ChatLib.chat(`${prefix} &4Sound check unsuccessful! Make sure sound exist in the website. &e&l<CASE SENSITIVE>`)
      }
      console.log(args1 + checkSound(args1))
      break;
    default:
      ChatLib.chat(`${prefix} &4Commands&r:\n &4/ho toggle &r: &eToggles the enchant checker&r`)
      soundComponent.chat()
      break;
  }
}).setName("hoverover", true).setAliases("ho")
//main
//searchBar (credit ChestSearch for searchbar thing)
register("guiMouseClick", (x, y, button) => {
  searchBar.func_146192_a(x, y, button); // detect when click text box
})

register("guiRender", (x, y, gui) => {
  if(data.toggle == true && checkSkyblock()) {
    if(gui.class.getName().toLowerCase().includes("profileviewer") || gui.class.getName() == "net.minecraft.client.gui.GuiIngameMenu") {
      return
    } else {
      searchBar.func_146194_f() //draw
      Renderer.drawStringWithShadow("Search Item Enchant", Renderer.screen.getWidth() / 3.52, Renderer.screen.getHeight() / 1.8)
    }
  }
})

register("guiKey", (char, keyCode, gui, event) => {
  if(searchBar.func_146206_l()) { // check if textbox focused
    searchBar.func_146201_a(char, keyCode) // add letter to box
    World.playSound(sound, 10, 10)
    if(keyCode != 1) {
      cancel(event)
    }
  }
})

register("tick", () => {
  if(Client.isInGui() == false) {
    searchBar.func_146195_b(false) //set focus
  } else {
    searchTerm = searchBar.func_146179_b()
  }
  //add lore
  if(data.toggle == true) {
    let hoveroverslot = Client.currentGui.get()?.getSlotUnderMouse()
    if(hoveroverslot == (undefined || null)) {
      return
    } else {
      hoveroverslot = Client.currentGui.get().getSlotUnderMouse().field_75222_d;
    }
    let hoverover = Player.getContainer()?.getStackInSlot(hoveroverslot)
    if(hoverover == (undefined || null)) return
    let enchants = hoverover?.getNBT()?.getTag("tag")?.getTag("display")?.get("Lore")
    if(enchants == (undefined || null)) return
    searchTerm.split(", ").forEach(term => {
      if(enchants.toString().includes(term) && term.length > 0 && !enchants.toString().includes("Includes Lore")) {
        Lore.append(hoverover, "Includes Lore", false)
      } else if(!enchants.toString().includes(term) && enchants.toString().includes("Includes Lore")) {
        let i = 1
        hoverover.getLore().forEach(() => {
          i++
        })
        Lore.remove(hoverover, i)
      }
    })
  }
})

/**
 * TODO
 * 1. add pos change to textfield
 */