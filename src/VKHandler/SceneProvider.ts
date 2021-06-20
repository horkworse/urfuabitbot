import {IScene, IStepContext, SceneManager, StepScene} from '@vk-io/scenes';
import {ButtonColor, Keyboard, MessageContext, VK} from 'vk-io';
import {API} from 'vk-io';
import * as http from 'http';
import {IContext} from '@vk-io/session';
import axios from 'axios';

let PropertyProvider = require('./PropertyProvider');

const vk = new VK({
  token: new PropertyProvider().token
});

const api = new API({
  token: new PropertyProvider().token
});


const baseUrl = new PropertyProvider().baseUrl;

const ax = axios.create({
  headers: {
    'Content-Type': 'application/json',
    Connection: 'keep-alive'
  },
  proxy: false
})



enum Steps {
  main,
  findMentor,
  mentorRTF,
  mentorINMT,
  mentorINFO,
  resolveMentor,
  infoMenu,
  entryHostelInfo,
  stipendInfo,
  askQuestion,
  whoIsMentor
}

class SceneProvider {

  constructor(sm: SceneManager) {
    sm.addScenes([this.scene]);
  }

  private async helloMenu(context: IStepContext) {
    if (context.scene.step.firstTime) {
      return context.send({
        message: 'Что требуется?',
        keyboard: Keyboard.builder()
          .textButton({
            label: 'Найти наставника',
            payload: {
              command: Steps.findMentor
            },
            color: ButtonColor.PRIMARY
          })
          .row()
          .textButton({
            label: 'Информация',
            payload: {
              command: Steps.infoMenu
            },
            color: ButtonColor.PRIMARY
          })
          .row()
          .textButton({
            label: 'Кто такие наставники?',
            payload: {
              command: Steps.whoIsMentor
            },
            color: ButtonColor.PRIMARY
          })
          .oneTime()
      });
    }
    return context.scene.step.go(context.messagePayload['command']);
  }

  private async findMentorMenu(context: IStepContext) {
    if (context.scene.step.firstTime) {
      return context.send({
        message: 'В какой институт вы поступили?',
        keyboard: Keyboard.builder()
          .textButton({
            label: 'ИРИТ-РтФ',
            payload: {
              command: Steps.mentorRTF
            },
            color: ButtonColor.PRIMARY
          })
          .row()
          .textButton({
            label: 'ИНМиТ',
            payload: {
              command: Steps.mentorINMT
            },
            color: ButtonColor.PRIMARY
          })
          .textButton({
            label: 'ИнФО',
            payload: {
              command: Steps.mentorINFO
            },
            color: ButtonColor.PRIMARY
          })
          .row()
          .textButton({
            label: 'В главное меню',
            payload: {
              command: Steps.main
            },
            color: ButtonColor.SECONDARY
          })
          .oneTime()
      });
    }
    return context.scene.step.go(context.messagePayload['command']);
  }

  private async mentorRTF(context: IStepContext | MessageContext) {
    if(context.scene.step.firstTime){
      return  context.send({
        message: 'Для того чтобы найти наставника, введите номер группы в формате:"РИ-110023"',
      });
    }

    return context.scene.step.go(Steps.resolveMentor);
  }

  private async mentorINMT(context: IStepContext) {
    if (context.scene.step.firstTime) {
      return context.send({
        message: 'Для того чтобы найти наставника, введите номер группы в формате:"МТ-110023"'
      });
    }

    return context.scene.step.go(Steps.resolveMentor);
  }

  private async mentorINFO(context: IStepContext) {
    if (context.scene.step.firstTime) {
      return context.send({
        message: 'Для того чтобы найти наставника, введите номер группы в формате:"ФО-110023"'
      });
    }

    return context.scene.step.go(Steps.resolveMentor);
  }

  private async resolveMentor(context: IStepContext) {
    if (context.scene.step.firstTime) {
      let groupIndex = context.text;
      const reExpression = /^(РИ-|ФO-|МТ-)\d{6}/gi;
      if (!reExpression.test(groupIndex))
        return context.send({
          message: "Некорректный номер группы, попробуйте ещё раз",
          keyboard: Keyboard.builder()
            .textButton({
              label: 'Ввести заново',
              payload: {
                command: Steps.findMentor
              },
              color: ButtonColor.PRIMARY
            })
            .row()
            .textButton({
              label: 'В главное меню',
              payload: {
                command: Steps.main
              },
              color: ButtonColor.SECONDARY
            }).oneTime()
          })
      console.log(groupIndex);
      return ax.get("http://localhost:5000/"+encodeURI(`bot/getMentors/group=${groupIndex}`)).then(res => {
        console.log(res);
        context.send({
          message: "Твои наставники: \n"+res.data.text + "\nСкорее пиши им, они тебе все расскажут",
          keyboard: Keyboard.builder()
            .textButton({
              label: 'В главное меню',
              payload: {
                command: Steps.main
              },
              color: ButtonColor.SECONDARY
            })
            .oneTime()
        });
      });
    }
    return context.scene.step.go(context.messagePayload['command']);
  }

  private async infoMenu(context: IStepContext) {
    if (context.scene.step.firstTime) {
      return context.send({
        message: 'Что вы хотите узнать?',
        keyboard: Keyboard.builder()
          .textButton({
            label: 'О поселении в общежитие',
            payload: {
              command: Steps.entryHostelInfo
            },
            color: ButtonColor.PRIMARY
          })
          .row()
          .textButton({
            label: 'О стипендии',
            payload: {
              command: Steps.stipendInfo
            },
            color: ButtonColor.PRIMARY
          })
          .row()
          .textButton({
            label: 'Задать вопрос',
            payload: {
              command: Steps.askQuestion
            },
            color: ButtonColor.PRIMARY
          })
          .row()
          .textButton({
            label: 'В главное меню',
            payload: {
              command: Steps.main,
            },
            color: ButtonColor.SECONDARY
          })
          .oneTime()
      });
    }
    return context.scene.step.go(context.messagePayload['command']);
  }

  private async entryHostelInfo(context: IStepContext) {
    if (context.scene.step.firstTime) {
      return context.send({
        message: "По моей информации",
        template: JSON.stringify({
          type : "carousel",
            elements: [{
              photo_id: "-194532672_457239042",
              action: {
                "type": "open_photo"
              },
              buttons: [{
                action: {
                  type: "text",
                  label: "В главное меню",
                  payload: {command: Steps.main}
                }
              }]
            },
              {
                photo_id: "-194532672_457239043",
                action: {
                  "type": "open_photo"
                },
                buttons: [{
                  action: {
                    type: "text",
                    label: "В главное меню",
                    payload: {command: Steps.main}
                  }
                }]
              },
              {
                photo_id: "-194532672_457239045",
                action: {
                  "type": "open_photo"
                },
                buttons: [{
                  action: {
                    type: "text",
                    label: "В главное меню",
                    payload: {command: Steps.main}
                  }
                }]
              },
              {
                photo_id: "-194532672_457239046",
                action: {
                  "type": "open_photo"
                },
                buttons: [{
                  action: {
                    type: "text",
                    label: "В главное меню",
                    payload: {command: Steps.main}
                  }
                }]
              },
              {
                photo_id: "-194532672_457239047",
                action: {
                  "type": "open_photo"
                },
                buttons: [{
                  action: {
                    type: "text",
                    label: "В главное меню",
                    payload: {command: Steps.main}
                  }
                }]
              }]
          })
        })
      }
    return context.scene.step.go(context.messagePayload['command']);
  }

  private async stipendInfo(context: IStepContext) {
    if (context.scene.step.firstTime) {
      return context.send({
        message: 'По моей информации:',
        template: JSON.stringify({
          type : "carousel",
          elements: [{
            photo_id: "-194532672_457239049",
            action: {
              "type": "open_photo"
            },
            buttons: [{
              action: {
                type: "text",
                label: "В главное меню",
                payload: {command: Steps.main}
              }
            }]
          },
            {
              photo_id: "-194532672_457239050",
              action: {
                "type": "open_photo"
              },
              buttons: [{
                action: {
                  type: "text",
                  label: "В главное меню",
                  payload: {command: Steps.main}
                }
              }]
            },
            {
              photo_id: "-194532672_457239051",
              action: {
                "type": "open_photo"
              },
              buttons: [{
                action: {
                  type: "text",
                  label: "В главное меню",
                  payload: {command: Steps.main}
                }
              }]
            },
            {
              photo_id: "-194532672_457239052",
              action: {
                "type": "open_photo"
              },
              buttons: [{
                action: {
                  type: "text",
                  label: "В главное меню",
                  payload: {command: Steps.main}
                }
              }]
            },
            {
              photo_id: "-194532672_457239053",
              action: {
                "type": "open_photo"
              },
              buttons: [{
                action: {
                  type: "text",
                  label: "В главное меню",
                  payload: {command: Steps.main}
                }
              }]
            }]
        })
      })
    }
    return context.scene.step.go(context.messagePayload['command']);
  }

  private async askQuestion(context: IStepContext) {
    const [userData] = await api.users.get({user_id: context.senderId});
    let userLink = '@id' + context.senderId + '(' + userData.first_name + ')';
    if (context.scene.step.firstTime || context.isOutbox) {
      context.send('Задайте свой вопрос, с вами свяжутся в ближайшее время');
      return;
    }
    await vk.api.messages.send({
      //peer_id: 345583109, //dale
      // peer_id: 103861777, //Jenya
      //peer_id: 252077263, // garche
      random_id: 0,
      peer_id: 2000000005,
      message: userLink + '\n' + context.text
    });
    await context.send('Запрос отправлен, c вами скоро свяжутся');
    return context.scene.step.go(0);
  }

  private async whoIsMentor(context: IStepContext) {
    if (context.scene.step.firstTime) {
      return context.send({
        message: 'По моей информации:',
        template: JSON.stringify({
          type: "carousel",
          elements: [{
            photo_id: "-194532672_457239048",
            action: {
              "type": "open_photo",
            },
            buttons: [
              {
                action: {
                  type: "open_link",
                  label: "Подробнее на сайте",
                  link: "https://urfu.ru/ru/students/leisure/oso/associacija-studentov-nastavnikov/"
                }
              },
              {
                action: {
                  type: "text",
                  label: "В главное меню",
                  payload: {command: Steps.main}
                }
              }
            ]
          }]
        })
      })
    }
    return context.scene.step.go(context.messagePayload['command']);
  }

  private scene: IScene = new StepScene('abit', [
    this.helloMenu,
    this.findMentorMenu,
    this.mentorRTF,
    this.mentorINMT,
    this.mentorINFO,
    this.resolveMentor,
    this.infoMenu,
    this.entryHostelInfo,
    this.stipendInfo,
    this.askQuestion,
    this.whoIsMentor
  ]);
}

module.exports = SceneProvider;
