/// <reference types="../CTAutocomplete" />
import PogObject from "../PogData"
import Lore from "../Lore"
//prefix
const prefix = "&7[&r&3Item Hover Over&r&7] &r"
//variables
const GuiTextField = Java.type("net.minecraft.client.gui.GuiTextField")
let searchBar = new GuiTextField(0, Client.getMinecraft().field_71466_p,  Renderer.screen.getWidth() / 3.5, Renderer.screen.getHeight() / 2, 100, 10);
let searchTerm = "";
//data
const firstTimeMessage = new Message(new TextComponent(`${prefix} &l&eWelcome, use &4/hoverover &eto check commands. \n&rLore deletes when you change gui, or click an item idk why lol`).setClick("run_command", "/ho").setHover("show_text", "&7Run &e&l/hoverover"))
const data = new PogObject("ItemHoverOver", {
  firsttime: true,
  toggle: false
}, "data.json")

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
  
    default:
      ChatLib.chat(`${prefix} &4Commands&r:\n &4/ho toggle &r: &eToggles the enchant checker`)
      break;
  }
}).setName("hoverover", true).setAliases("ho")
//main
//searchBar (credit ChestSearch for searchbar thing)
register("guiMouseClick", (x, y, button) => {
  searchBar.func_146192_a(x, y, button); // detect when click text box
})

register("guiRender", () => {
  if(data.toggle == true) {
    searchBar.func_146194_f() //draw
    Renderer.drawStringWithShadow("Search Item Enchant", Renderer.screen.getWidth() / 3.52, Renderer.screen.getHeight() / 2.1)
  }
})

register("guiKey", (char, keyCode, gui, event) => {
  if(searchBar.func_146206_l()) { // check if textbox focused
    searchBar.func_146201_a(char, keyCode) // add letter to box
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
    if(enchants.toString().includes(searchTerm) && searchTerm.length > 0 && !enchants.toString().includes("Includes Enchant")) {
      Lore.append(hoverover, "Includes Enchant", false)
    } else if(!enchants.toString().includes(searchTerm) && enchants.toString().includes("Includes Enchant")) {
      let i = 1
      hoverover.getLore().forEach(() => {
        i++
      })
      Lore.remove(hoverover, i)
    }
  }
})