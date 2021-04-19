import {VK} from 'vk-io';
import {SessionManager} from '@vk-io/session';
import {SceneManager} from '@vk-io/scenes';
let PropertyProvider = require('./PropertyProvider')
import * as fs from 'fs';


const vk: VK = new VK({
  token: new PropertyProvider().token
});

const sessionManager: SessionManager = new SessionManager<{}>();
const sceneManager: SceneManager = new SceneManager();

vk.updates.on("message_new", sessionManager.middleware);
vk.updates.on("message_new", sceneManager.middleware);
vk.updates.on("message_new", sceneManager.middlewareIntercept);

vk.updates.on("message_new", (context, next) => {
  return context.scene.enter('abit'); //todo: implement SceneProvider with abit:Array<Scene> @garcher @midnighter
})

vk.updates.start().then(r => console.log("Start success!!!"));
