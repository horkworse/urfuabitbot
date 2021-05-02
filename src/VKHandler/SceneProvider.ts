import {IScene, IStepContext, SceneManager, StepScene} from '@vk-io/scenes';
import {ButtonColor, Keyboard} from 'vk-io';
let vk = require('./MainFrame')

enum Steps{
  main,
  findMentor,
  mentorRTF,
  mentorINMT,
  infoMenu,
  entryHostelInfo,
  stipendInfo,
  askQuestion,
  whoIsMentor
}

class SceneProvider {
  constructor(sm: SceneManager){
    sm.addScenes([this.scene])
  }
  private async helloMenu(context: IStepContext){
    if(context.scene.step.firstTime){
      return context.send({
        message: "Здравствуй, что требуется?",
        keyboard: Keyboard.builder()
          .textButton({
            label: "Найти наставника",
            payload: {
              command: Steps.findMentor
            },
            color: ButtonColor.PRIMARY
          })
          .row()
          .textButton({
            label: "Информация",
            payload: {
              command: Steps.infoMenu
            },
            color: ButtonColor.PRIMARY
          })
          .row()
          .textButton({
            label: "Кто такие наставники?",
            payload: {
              command: Steps.whoIsMentor
            },
            color: ButtonColor.PRIMARY
          })
          .oneTime().inline()
      })
    }
    return context.scene.step.go(context.messagePayload['command'])
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
          .row()
          .textButton({
            label: "В главное меню",
            payload: {
              command: Steps.main
            },
            color: ButtonColor.SECONDARY
          })
          .oneTime().inline()
      })
    return context.scene.step.go(context.messagePayload['command']);
  }

  private async mentorRTF(context: IStepContext){
    return context.send({

    })
    return context.scene.step.go(context.messagePayload['command']);
  } //Антон плиз заполни

  private async mentorINMT(context: IStepContext){
    return context.send({

    })
    return context.scene.step.go(context.messagePayload['command']);
  }//И это тоже

  private async infoMenu(context: IStepContext) {
    if(context.scene.step.firstTime)
      return context.send({
        message: "Что вы хотите узнать?",
        keyboard: Keyboard.builder()
          .textButton({
            label: "Задать вопрос",
            payload: {
              command: Steps.askQuestion
            },
            color: ButtonColor.PRIMARY
          })
          .row()
          .textButton({
            label: "О поселении в общежитие",
            payload: {
              command: Steps.entryHostelInfo
            },
            color: ButtonColor.PRIMARY
          })
          .row()
          .textButton({
            label: "О стипендии",
            payload: {
              command: Steps.stipendInfo
            },
            color: ButtonColor.PRIMARY
          })
          .row()
          .textButton({
            label: "В главное меню",
            payload: {
              command: Steps.main,
            },
            color: ButtonColor.SECONDARY
          })
          .oneTime().inline()
      })
      return context.scene.step.go(context.messagePayload['command'])
    }

  private async entryHostelInfo(context: IStepContext){
    if(context.scene.step.firstTime)
        return context.send({
          message: "Тебе нужно:\n" +
            "1) Пройти медкомиссию в Медсанчасти УрФУ(ул. Комсомольская, 59)\n" +
            "Не забудь взять:\n -паспорт + копия\n -мед. полис + копия\n -справка 086у\n -прививочный сертификат\n -флюрография не более 1 года (можно сделать в мсч)\n\n" +
            "а) Предъявить в регистратуру перечисленные документы\n" +
            "б) Оплатить стоимость медосмотра в кассе или через сервис pay.urfu.ru\n" +
            "в) Пройти осмотр у терапевта и предъявить ему квитанцию об оплате\n\n" +
            "2) Получить выписку из протокола Комиссии Университета (ордер) и договор найма жилого помещения в общежитии (3 экземпляра)\n\n" +
            "3) Оплатить общежитие\nПроизвести оплату можно 5 способами:\n " +
            "-pay.urfu.ru\n" +
            " -отделение СКБ-Банка\n" +
            " -бухгалтерия Студгородка УрФУ\n" +
            " -в отделении Сбербанка\n" +
            " -через приложение Сбербанк Онлайн\n\n" +
            "4) Оформить временную регистрацию по месту пребывания.\n" +
            "Нужно пройти в Паспортный отдел Студгородка университета со следующими документами:\n" +
            " -паспорт\n" +
            " -доровор найма жилого помещения (3 экземпляра)\n" +
            " -выписка из протокола Комиссии Университета (ордер)\n\n" +
            "5) Оформить проживание Идем в общежитие, указанное в выписке из ордера со следующими документами:\n" +
            " -выписка из протокола Комиссии Университета (ордер)\n" +
            " -договор найма жилого помещения в 2х экземплярах (один с отметкой паспортного стола - отдается зав. общежитием, второй остатеся у студента)\n" +
            "-фотографии 3х4см 6шт и фотографии в\n" +
            " -оформленная медицинская карта\n" +
            " -квитанция об оплате общежития\n",
          keyboard: Keyboard.builder()
            .textButton({
              label: "В главное меню",
              payload: {
                command: Steps.main,
              },
              color: ButtonColor.SECONDARY
            })
            .oneTime()
        })
        return context.scene.step.go(context.messagePayload['command'])
      }

  private async stipendInfo(context: IStepContext){
    if(context.scene.step.firstTime)
      return context.send({
        message:"Государственная стипендия (без учета районного коэффициента):\n" +
          "-академическая стипендия по программам ВО (бакалавриат и специалитет) — 2160 ₽;\n" +
          "-академическая стипендия по программам ВО (магистратура) — 3240 ₽\n\n" +
          "Академическая стипендия студентам, сдавшим сессию на «отлично»:\n" +
          "-академическая стипендия по программам ВО (бакалавриат и специалитет) — 3240 ₽; \n" +
          "-академическая стипендия по программам ВО (магистратура) — 4856 ₽\n\n" +
          "Социальная стипендия:\n" +
          "-студентам, являющимся ветеранами боевых действий, а также студентам, проходившим в течение не менее трех лет военную службу по контракту \nна воинских должностях\n" +
          "1) по программам ВО — 2545 ₽\n" +
          "2) по программам СПО — 1835 ₽\n" +
          "-студентам, являющимся детьми-сиротами и детьми, оставшимися без попечения родителей (с полным списком можно ознакомиться в приказе 720/\n03 от 28.08.2019 на сайте УрФУ)\n\n" +
          "Также студенты УрФУ могут претендовать на именные стипендии. Вот некоторые из них:\n" +
          "-cтипендия Губернатора Свердловской области:\n" +
          "Для нее необходимо наличие достижений в учебе: победители и/или призеры международных, всероссийских, региональных олимпиад, чемпионатов, \nконкурсов; участие в международных, всероссийских и региональных конференциях, форумах, фестивалях и т.д.\n" +
          "-cтипендия первого Президента России Б.Н. Ельцина:\n" +
          "-cтипендия Президента Российской Федерации",
        keyboard: Keyboard.builder()
          .textButton({
            label: "В главное меню",
            payload: {
              command: Steps.main,
            },
            color: ButtonColor.SECONDARY
          })
          .oneTime()
      })
    return context.scene.step.go(context.messagePayload['command'])
  }

  private async askQuestion (context: IStepContext) {

    if (context.isOutbox || context.scene.step.firstTime){
      context.send("Задайте свой вопрос, с вами свяжутся в ближайшее время")
      return;
    }
    await context.send({
      peer_id: 345583109,
      message: "Help me get out:" //todo: @Garcher - сделать композицию запроса *DaleUnixal
    })
    await context.send("Заявка отправлена!")
    return context.scene.step.go(0);
  } //to @DaleUnixal  понедельнику наверное будет работать
    //todo: @Garcher | Блять, что это за "наверное":?!. Комменты через TODO, прошу вас... *DaleUnixal


  private async whoIsMentor(context: IStepContext){
    if(context.scene.step.firstTime)
      return context.send({
        message:"Наставники это студенты старших курсов, которые с удовольствием помогут вам начать жизнь в институте. " +
        "Научат всему что сами умеют и ответят на все вопросы \n" + "Подробнее можете прочесть по ссылке: https://urfu.ru/ru/students/leisure/oso/associacija-studentov-nastavnikov/",
        keyboard: Keyboard.builder()
          .textButton({
            label: "В главное меню",
            payload: {
              command: Steps.main,
            },
            color: ButtonColor.SECONDARY
          })
          .oneTime()
      })
    return context.scene.step.go(context.messagePayload['command'])
  }

  private scene:IScene = new StepScene('abit',[
    this.helloMenu,
    this.findMentorMenu,
    this.mentorRTF,
    this.mentorINMT,
    this.infoMenu,
    this.entryHostelInfo,
    this.stipendInfo,
    this.askQuestion,
    this.whoIsMentor
  ])
}

module.exports = SceneProvider;
