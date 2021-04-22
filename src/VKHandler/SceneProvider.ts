import {IScene, IStepContext, SceneManager, StepScene} from '@vk-io/scenes';
import {ButtonColor, Keyboard} from 'vk-io';

enum Steps{
  main,
  student,
  abit,
  findMentor,
  mentorRTF,
  mentorINMT,
  info
}

class SceneProvider {
  constructor(sm: SceneManager){
    sm.addScenes([this.scene])
  }

  private async findMentorMenu(context: IStepContext){
    if(context.scene.step.firstTime)
      return context.send({
        message: "В какой институт вы поступили?",
        keyboard: Keyboard.builder()
          .textButton({
            label: "ИРИТ-РтФ",
            payload: {
              command: Steps.mentorRTF
            },
            color: ButtonColor.PRIMARY
          })
          .textButton({
            label: "ИНМиТ",
            payload: {
              command: Steps.mentorINMT
            },
            color: ButtonColor.PRIMARY
          })
          .oneTime()
      })


    return context.scene.step.go(context.messagePayload['command']);
  }

  private async abitMenu(context: IStepContext){
    if(context.scene.step.firstTime)
      return context.send({
        message: "Нереализованое меню Абитуриент",
        keyboard: Keyboard.builder()
          .textButton({
            label: "В главное меню",
            payload: {
              command: Steps.main
            },
            color: ButtonColor.SECONDARY
          })
          .textButton({
            label: "Информация",
            payload: {
              command: Steps.info
            },
            color: ButtonColor.PRIMARY
          })
          .textButton({
            label: "Найти наставника",
            payload: {
              command: Steps.findMentor
            },
            color: ButtonColor.PRIMARY
          })
          .oneTime()
      })


    return context.scene.step.go(context.messagePayload['command']);
  }

  private async studentMenu(context: IStepContext){
    if(context.scene.step.firstTime)
      return context.send({
        message: "Нереализованое меню Студент",
        keyboard: Keyboard.builder()
          .textButton({
            label: "В главное меню",
            payload: {
              command: Steps.main
            },
            color: ButtonColor.SECONDARY
          })
      })


    return context.scene.step.go(context.messagePayload['command']);
  }

  private async helloMenu(context: IStepContext){
    if(context.scene.step.firstTime){
      return context.send({
        message: "Hello World",
        keyboard: Keyboard.builder()
          .textButton({
            label: "Студент",
            payload: {
              command: Steps.student
            },
            color: ButtonColor.SECONDARY
          })
          .textButton({
            label: "Абитурьент",
            payload: {
              command: Steps.abit
            },
            color: ButtonColor.PRIMARY
          })
          .oneTime()
      })
    }


    return context.scene.step.go(context.messagePayload['command'])
  }
//Порядок функций устанавливается согласно Steps
  private scene:IScene = new StepScene('abit',[
    this.helloMenu,
    this.studentMenu,
    this.abitMenu,
    this.findMentorMenu,
    this.lookupRTF,
    this.lookupINMT
  ])
}

module.exports = SceneProvider;
