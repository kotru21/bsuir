import { SportSection } from "../types.js";

export const sportSections: SportSection[] = [
  {
    id: "athletic-gymnastics",
    title: "Атлетическая гимнастика",
    summary:
      "Силовая программа со штангой и тренажерами для комплексного развития и самостоятельного планирования нагрузок.",
    focus: ["strength", "coordination", "weightManagement"],
    format: "mixed",
    contactLevel: "nonContact",
    intensity: "medium",
    recommendedFor: [
      {
        fitnessLevel: "low",
        note: "Плавное знакомство с упражнениями с отягощениями.",
      },
      {
        fitnessLevel: "medium",
        note: "Позволяет стабильно повышать рабочие веса.",
      },
      {
        fitnessLevel: "high",
        note: "Интенсивные программы для опытных занимающихся.",
      },
    ],
    expectedResults: {
      shortTerm:
        "Закрепите технику и основы безопасной работы с весами, улучшите тонус мышц.",
      midTerm: "Прибавите 5-15% в основных упражнениях, стабилизируете осанку.",
      longTerm:
        "Сформируете устойчивый тренировочный режим и заметно укрепите тело.",
    },
    extraBenefits: [
      "Основы планирования тренировок",
      "Контроль нагрузки и дневник прогресса",
      "Формирование здоровых привычек",
    ],
    prerequisites: "Готовность соблюдать технику и рекомендации тренера.",
    imagePath: "./data/images/athletic-gymnastics.jpg",
  },
  {
    id: "basketball",
    title: "Баскетбол",
    summary:
      "Командная дисциплина с акцентом на скорость, прыгучесть и тактическое мышление в трехлетней программе.",
    focus: ["teamwork", "endurance", "coordination", "competition"],
    format: "group",
    contactLevel: "lightContact",
    intensity: "high",
    recommendedFor: [
      {
        fitnessLevel: "medium",
        note: "Нужен базовый уровень быстроты и координации.",
      },
      {
        fitnessLevel: "high",
        note: "Подходит для тех, кто стремится к соревнованиям.",
      },
    ],
    expectedResults: {
      shortTerm: "Освоите ведение мяча, передачи и индивидуальную защиту.",
      midTerm: "Улучшите спринт, прыжок и взаимодействие в команде.",
      longTerm: "Сможете уверенно выступать на студенческих турнирах.",
    },
    extraBenefits: [
      "Развитие лидерских качеств",
      "Тактическое мышление",
      "Высокий расход энергии",
    ],
    imagePath: "./data/images/basketball.jpg",
  },
  {
    id: "wrestling",
    title: "Борьба",
    summary:
      "Единоборство, развивающее силу, ловкость и прикладные навыки самообороны через технические комплексы.",
    focus: ["strength", "martialArts", "competition", "coordination"],
    format: "group",
    contactLevel: "fullContact",
    intensity: "high",
    recommendedFor: [
      {
        fitnessLevel: "medium",
        note: "Помогает развить функциональную силу и гибкость.",
      },
      {
        fitnessLevel: "high",
        note: "Требует высокой выносливости и готовности к соревнованиям.",
      },
    ],
    expectedResults: {
      shortTerm: "Освоите страховку и базовую акробатику.",
      midTerm: "Будете уверенно выполнять многокомпонентные броски.",
      longTerm: "Получите готовность к участию в турнирах.",
    },
    extraBenefits: ["Самодисциплина", "Устойчивость к стрессу"],
    prerequisites: "Комфортное отношение к тесному контакту.",
    imagePath: "./data/images/wrestling.jpg",
  },
  {
    id: "volleyball",
    title: "Волейбол",
    summary:
      "Программа для развития координации, прыгучести и владения мячом в условиях командной игры.",
    focus: ["teamwork", "coordination", "endurance"],
    format: "group",
    contactLevel: "nonContact",
    intensity: "medium",
    recommendedFor: [
      {
        fitnessLevel: "low",
        note: "Подходит новичкам при регулярных посещениях.",
      },
      { fitnessLevel: "medium", note: "Позволяет улучшить прыжки и реакцию." },
    ],
    expectedResults: {
      shortTerm: "Разберетесь в техниках подачи, передачи и перемещений.",
      midTerm: "Укрепите прыжковую подготовку и групповые взаимодействия.",
      longTerm: "Сможете уверенно играть на выбранной позиции.",
    },
    extraBenefits: ["Быстрые реакции", "Щадящая нагрузка на суставы"],
    prerequisites: "Необходима регулярность для закрепления навыков.",
    imagePath: "./data/images/volleyball.jpg",
  },
  {
    id: "aikido",
    title: "Айкидо",
    summary:
      "Парное единоборство без жесткого контакта, направленное на координацию и контролируемую самооборону.",
    focus: ["martialArts", "coordination", "flexibility", "rehabilitation"],
    format: "group",
    contactLevel: "lightContact",
    intensity: "medium",
    recommendedFor: [
      { fitnessLevel: "low", note: "Мягкий вход с акцентом на безопасность." },
      {
        fitnessLevel: "medium",
        note: "Позволяет отрабатывать сложные связки с партнером.",
      },
    ],
    expectedResults: {
      shortTerm: "Научитесь безопасным кувыркам и страховке.",
      midTerm: "Соберете цепочки бросков и контролей.",
      longTerm: "Станете уверенно реагировать на разные атаки.",
    },
    extraBenefits: ["Снижение стресса", "Осознанность тела"],
    prerequisites: "Готовность работать в парах и изучать терминологию.",
    imagePath: "./data/images/aikido.jpg",
  },
  {
    id: "muay-thai",
    title: "Тайский бокс",
    summary:
      "Интенсивное ударное единоборство, развивающее выносливость, силу и уверенность через работу по снарядам и спарринги.",
    focus: ["martialArts", "endurance", "strength", "competition"],
    format: "group",
    contactLevel: "fullContact",
    intensity: "high",
    recommendedFor: [
      { fitnessLevel: "medium", note: "Требует хорошей общей выносливости." },
      {
        fitnessLevel: "high",
        note: "Подходит тем, кто нацелен на соревнования.",
      },
    ],
    expectedResults: {
      shortTerm: "Укрепите кардио и освоите базовые комбинации.",
      midTerm: "Сможете держать высокий темп на лапах и в клинче.",
      longTerm: "Достигнете уровня готовности к любительскому рингу.",
    },
    extraBenefits: ["Высокий расход калорий", "Рост уверенности"],
    prerequisites: "Необходима готовность к контактной работе и защите.",
    imagePath: "./data/images/muay-thai.jpg",
  },
  {
    id: "track-and-field",
    title: "Легкая атлетика",
    summary:
      "Беговой курс с сочетанием спринта, кросса, прыжков и силовой подготовки.",
    focus: ["endurance", "strength", "competition"],
    format: "mixed",
    contactLevel: "nonContact",
    intensity: "medium",
    recommendedFor: [
      {
        fitnessLevel: "low",
        note: "Позволяет постепенно развивать выносливость.",
      },
      {
        fitnessLevel: "medium",
        note: "Дает структурированные нормативы по бегу и прыжкам.",
      },
      {
        fitnessLevel: "high",
        note: "Помогает прогрессировать к личным рекордам.",
      },
    ],
    expectedResults: {
      shortTerm: "Улучшите технику бега и базовые показатели выносливости.",
      midTerm: "Сократите время спринтов и усилите прыжковую силу.",
      longTerm:
        "Сможете держать соревновательный темп на выбранных дистанциях.",
    },
    extraBenefits: [
      "Тренировки на свежем воздухе",
      "Укрепление сердечно-сосудистой системы",
    ],
    imagePath: "./data/images/track-and-field.jpg",
  },
  {
    id: "futsal",
    title: "Мини-футбол",
    summary:
      "Динамичный формат футбола в зале с акцентом на контроль мяча и быстрые решения.",
    focus: ["teamwork", "coordination", "endurance", "competition"],
    format: "group",
    contactLevel: "lightContact",
    intensity: "high",
    recommendedFor: [
      { fitnessLevel: "medium", note: "Нужна хорошая подвижность и реакция." },
      { fitnessLevel: "high", note: "Подходит для соревновательного темпа." },
    ],
    expectedResults: {
      shortTerm: "Улучшите дриблинг и ускорение на коротких отрезках.",
      midTerm: "Станете быстрее в передачах и тактических перестроениях.",
      longTerm: "Будете уверенно играть весь матч в высоком темпе.",
    },
    extraBenefits: ["Развитие ускорений", "Слаженность команды под давлением"],
    imagePath: "./data/images/futsal.jpg",
  },
  {
    id: "swimming",
    title: "Плавание",
    summary:
      "Постепенное обучение от уверенного поведения в воде до спортивной техники и выносливости.",
    focus: ["aquatic", "endurance", "rehabilitation"],
    format: "mixed",
    contactLevel: "nonContact",
    intensity: "low",
    recommendedFor: [
      {
        fitnessLevel: "low",
        note: "Безопасная нагрузка и бережное отношение к суставам.",
      },
      {
        fitnessLevel: "medium",
        note: "Позволяет улучшить технику и скорость плавания.",
      },
    ],
    expectedResults: {
      shortTerm: "Обретете уверенность в воде и ровное дыхание.",
      midTerm: "Сможете уверенно проплывать 50 метров с контролем поворотов.",
      longTerm: "Будете выполнять 100-метровые отрезки в стабильном темпе.",
    },
    extraBenefits: ["Коррекция осанки", "Минимальная ударная нагрузка"],
    prerequisites: "Нужна готовность регулярно посещать бассейн.",
    imagePath: "./data/images/swimming.jpg",
  },
  {
    id: "rhythmic-gymnastics",
    title: "Ритмическая гимнастика",
    summary:
      "Фитнес на основе танцев с акцентом на гибкость, координацию и выразительность движений.",
    focus: ["dance", "flexibility", "aesthetics", "coordination"],
    format: "group",
    contactLevel: "nonContact",
    intensity: "medium",
    recommendedFor: [
      {
        fitnessLevel: "low",
        note: "Подходит новичкам, постепенно усложняя связки.",
      },
      {
        fitnessLevel: "medium",
        note: "Помогает работать над фигурой и пластикой.",
      },
    ],
    expectedResults: {
      shortTerm: "Повысите мобильность и освоите базовые комбинации.",
      midTerm: "Укрепите корпус и улучшите выразительность движения.",
      longTerm: "Сможете выполнять длительные связки без потери техники.",
    },
    extraBenefits: ["Коррекция осанки", "Снятие эмоционального напряжения"],
    prerequisites: "Нужна готовность заниматься хореографией.",
    imagePath: "./data/images/rhythmic-gymnastics.jpg",
  },
  {
    id: "special-medical",
    title: "Специальное отделение",
    summary:
      "Персональные занятия под медицинским контролем для студентов с ограничениями по здоровью.",
    focus: ["rehabilitation", "flexibility", "weightManagement"],
    format: "individual",
    contactLevel: "nonContact",
    intensity: "low",
    recommendedFor: [
      {
        fitnessLevel: "low",
        note: "Оптимально для восстановления после заболеваний.",
      },
    ],
    expectedResults: {
      shortTerm: "Освоите безопасные модификации упражнений.",
      midTerm: "Расширите диапазон допустимых нагрузок.",
      longTerm:
        "Сформируете устойчивую привычку к самоконтролю и оздоровительной активности.",
    },
    extraBenefits: [
      "Медицинское сопровождение",
      "Индивидуальное дозирование нагрузки",
    ],
    prerequisites: "Требуется допуск врача и периодические осмотры.",
    imagePath: "./data/images/special-medical.jpg",
  },
  {
    id: "football",
    title: "Футбол",
    summary:
      "Полноформатные тренировки по технике, тактике и выносливости для игры на открытом поле.",
    focus: ["teamwork", "endurance", "competition"],
    format: "group",
    contactLevel: "lightContact",
    intensity: "high",
    recommendedFor: [
      {
        fitnessLevel: "medium",
        note: "Нужна хорошая координация и работа с мячом.",
      },
      {
        fitnessLevel: "high",
        note: "Подходит тем, кто стремится играть на соревновательном уровне.",
      },
    ],
    expectedResults: {
      shortTerm: "Отточите ведение мяча, передачи и удары.",
      midTerm: "Сократите время спринтов и улучшите позиционную игру.",
      longTerm:
        "Сможете поддерживать высокий темп весь матч и выполнять норматив Купера.",
    },
    extraBenefits: ["Командная сплоченность", "Высокий расход энергии"],
    imagePath: "./data/images/football.jpg",
  },
];
