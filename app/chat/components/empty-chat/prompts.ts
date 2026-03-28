import {
  HeartIcon,
  SunIcon,
  CloudIcon,
  SparklesIcon,
  MoonIcon,
  WindIcon,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Language } from "@/app/generated/prisma/browser";

type Translations = Record<Language, string>;

export interface WellbeingPrompt {
  id: string;
  icon: LucideIcon;
  label: Translations;
  description: Translations;
  message: string;
}

export interface ResolvedWellbeingPrompt {
  id: string;
  icon: LucideIcon;
  label: string;
  description: string;
  message: string;
}

interface Greeting {
  title: Translations;
  subtitle: Translations;
}

interface ResolvedGreeting {
  title: string;
  subtitle: string;
}

const t = (translations: Translations, lang: Language): string =>
  translations[lang];

const LANGUAGE_NAMES: Partial<Record<Language, string>> = {
  es: "Spanish",
  fr: "French",
  de: "German",
  pl: "Polish",
  pt: "Portuguese",
};

// ── Mood prompts ──

const moodMorning: WellbeingPrompt[] = [
  {
    id: "mood-morning-1",
    icon: HeartIcon,
    label: {
      en: "How are you feeling today?",
      es: "¿Cómo te sientes hoy?",
      fr: "Comment vous sentez-vous aujourd'hui ?",
      de: "Wie fühlst du dich heute?",
      pl: "Jak się dziś czujesz?",
      pt: "Como você está se sentindo hoje?",
    },
    description: {
      en: "Take a moment before the day gets busy. I'm here to listen and help you start on the right foot.",
      es: "Tómate un momento antes de que el día se ponga ajetreado. Estoy aquí para escucharte y ayudarte a empezar con buen pie.",
      fr: "Prenez un moment avant que la journée ne s'accélère. Je suis là pour vous écouter et vous aider à bien démarrer.",
      de: "Nimm dir einen Moment, bevor der Tag hektisch wird. Ich bin hier, um zuzuhören und dir zu helfen, gut in den Tag zu starten.",
      pl: "Zatrzymaj się na chwilę zanim dzień nabierze tempa. Jestem tu, żeby cię wysłuchać i pomóc dobrze zacząć dzień.",
      pt: "Tire um momento antes que o dia fique agitado. Estou aqui para ouvir e ajudar você a começar com o pé direito.",
    },
    message:
      "Proceed with a morning check-in for the user. Ask how they are feeling as they start their day and gently explore their current emotional state.",
  },
  {
    id: "mood-morning-2",
    icon: HeartIcon,
    label: {
      en: "What's on your mind this morning?",
      es: "¿Qué tienes en mente esta mañana?",
      fr: "Qu'avez-vous en tête ce matin ?",
      de: "Was beschäftigt dich heute Morgen?",
      pl: "Co masz dziś rano na myśli?",
      pt: "O que está na sua mente esta manhã?",
    },
    description: {
      en: "Let's talk about what's ahead and set an intention together. A clear focus can make your whole day feel different.",
      es: "Hablemos de lo que viene y establezcamos una intención juntos. Un enfoque claro puede hacer que todo tu día se sienta diferente.",
      fr: "Parlons de ce qui vous attend et fixons une intention ensemble. Un objectif clair peut transformer toute votre journée.",
      de: "Lass uns über das sprechen, was vor dir liegt, und gemeinsam eine Absicht setzen. Ein klarer Fokus kann deinen ganzen Tag verändern.",
      pl: "Porozmawiajmy o tym, co przed tobą i ustalmy razem intencję. Jasny cel może odmienić cały twój dzień.",
      pt: "Vamos conversar sobre o que vem pela frente e definir uma intenção juntos. Um foco claro pode transformar todo o seu dia.",
    },
    message:
      "Help the user set a positive intention for their day. Ask what's on their mind as they begin and guide them to think about what they'd like to focus on.",
  },
];

const moodAfternoon: WellbeingPrompt[] = [
  {
    id: "mood-afternoon-1",
    icon: HeartIcon,
    label: {
      en: "How's your day going?",
      es: "¿Cómo va tu día?",
      fr: "Comment se passe votre journée ?",
      de: "Wie läuft dein Tag?",
      pl: "Jak mija twój dzień?",
      pt: "Como está indo seu dia?",
    },
    description: {
      en: "Let's catch up on how things are going so far. I'm here to help you process whatever's on your mind.",
      es: "Pongámonos al día sobre cómo van las cosas hasta ahora. Estoy aquí para ayudarte a procesar lo que tengas en mente.",
      fr: "Faisons le point sur comment se passe votre journée. Je suis là pour vous aider à démêler ce qui vous occupe l'esprit.",
      de: "Lass uns schauen, wie es dir bisher geht. Ich bin hier, um dir zu helfen, das zu verarbeiten, was dich beschäftigt.",
      pl: "Pogadajmy o tym, jak ci do tej pory idzie. Jestem tu, żeby pomóc ci przepracować to, co masz na myśli.",
      pt: "Vamos conversar sobre como estão as coisas até agora. Estou aqui para ajudar você a processar o que estiver na sua mente.",
    },
    message:
      "Proceed with an afternoon check-in. Ask the user how their day is going so far and explore what has been on their mind.",
  },
  {
    id: "mood-afternoon-2",
    icon: HeartIcon,
    label: {
      en: "Need a mindful pause?",
      es: "¿Necesitas una pausa consciente?",
      fr: "Besoin d'une pause consciente ?",
      de: "Brauchst du eine achtsame Pause?",
      pl: "Potrzebujesz uważnej przerwy?",
      pt: "Precisa de uma pausa consciente?",
    },
    description: {
      en: "You deserve a break from the noise. Let's slow down together and check in with how you're really doing.",
      es: "Mereces un descanso del ruido. Desaceleremos juntos y veamos cómo te sientes realmente.",
      fr: "Vous méritez une pause loin du bruit. Ralentissons ensemble et voyons comment vous allez vraiment.",
      de: "Du verdienst eine Pause vom Lärm. Lass uns gemeinsam entschleunigen und schauen, wie es dir wirklich geht.",
      pl: "Zasługujesz na przerwę od zgiełku. Zwolnijmy razem i sprawdźmy, jak naprawdę się czujesz.",
      pt: "Você merece uma pausa do barulho. Vamos desacelerar juntos e ver como você realmente está.",
    },
    message:
      "Guide the user through a brief reflective pause. Ask them to take a moment and share how they are really doing beneath the surface.",
  },
];

const moodEvening: WellbeingPrompt[] = [
  {
    id: "mood-evening-1",
    icon: HeartIcon,
    label: {
      en: "How was your day?",
      es: "¿Cómo fue tu día?",
      fr: "Comment s'est passée votre journée ?",
      de: "Wie war dein Tag?",
      pl: "Jak minął twój dzień?",
      pt: "Como foi seu dia?",
    },
    description: {
      en: "Let's jump into a conversation and look back at your day together. I'd love to hear about the highlights and the tough parts.",
      es: "Empecemos una conversación y repasemos juntos tu día. Me encantaría escuchar sobre los mejores y los peores momentos.",
      fr: "Lançons-nous dans une conversation et revenons ensemble sur votre journée. J'aimerais entendre les bons et les moins bons moments.",
      de: "Lass uns ins Gespräch kommen und gemeinsam auf deinen Tag zurückblicken. Ich würde gerne von den Höhen und Tiefen hören.",
      pl: "Wskoczmy w rozmowę i wspólnie podsumujmy twój dzień. Chętnie posłucham o tym, co było fajne i co było trudne.",
      pt: "Vamos bater um papo e olhar juntos para o seu dia. Adoraria ouvir sobre os melhores momentos e os mais difíceis.",
    },
    message:
      "Proceed with an evening check-in. Ask the user how their day went and help them reflect on the highlights and challenges.",
  },
  {
    id: "mood-evening-2",
    icon: HeartIcon,
    label: {
      en: "Ready to wind down?",
      es: "¿Listo para relajarte?",
      fr: "Prêt à vous détendre ?",
      de: "Bereit zum Entspannen?",
      pl: "Gotowy się wyciszyć?",
      pt: "Pronto para relaxar?",
    },
    description: {
      en: "The day is almost over — let's ease into the evening together. I'm here to help you relax and let go of anything that's lingering.",
      es: "El día casi termina — relajémonos juntos en la noche. Estoy aquí para ayudarte a soltar lo que aún te pesa.",
      fr: "La journée touche à sa fin — détendons-nous ensemble. Je suis là pour vous aider à lâcher ce qui vous pèse encore.",
      de: "Der Tag neigt sich dem Ende — lass uns gemeinsam in den Abend gleiten. Ich bin hier, um dir zu helfen, loszulassen, was noch nachklingt.",
      pl: "Dzień dobiega końca — wejdźmy razem łagodnie w wieczór. Jestem tu, żeby pomóc ci odpuścić to, co jeszcze cię trzyma.",
      pt: "O dia está quase acabando — vamos relaxar juntos na noite. Estou aqui para ajudar você a soltar o que ainda pesa.",
    },
    message:
      "Help the user wind down for the evening. Ask how they are feeling as the day ends and guide them toward a sense of calm.",
  },
];

// ── Topic prompts ──

const gratitude: WellbeingPrompt[] = [
  {
    id: "gratitude-1",
    icon: SunIcon,
    label: {
      en: "Want to practice gratitude?",
      es: "¿Quieres practicar la gratitud?",
      fr: "Envie de pratiquer la gratitude ?",
      de: "Lust auf eine Dankbarkeitsübung?",
      pl: "Chcesz poćwiczyć wdzięczność?",
      pt: "Quer praticar gratidão?",
    },
    description: {
      en: "Even on tough days, there's something good worth noticing. Let's find it together and let that feeling sink in.",
      es: "Incluso en los días difíciles, hay algo bueno que vale la pena notar. Encontrémoslo juntos y dejemos que ese sentimiento cale.",
      fr: "Même les jours difficiles, il y a du bon à remarquer. Trouvons-le ensemble et savourons ce sentiment.",
      de: "Auch an schwierigen Tagen gibt es etwas Gutes zu entdecken. Lass es uns zusammen finden und das Gefühl wirken lassen.",
      pl: "Nawet w trudne dni jest coś dobrego, co warto zauważyć. Znajdźmy to razem i pozwólmy temu uczuciu się utrwalić.",
      pt: "Mesmo nos dias difíceis, há algo bom que vale notar. Vamos encontrar juntos e deixar esse sentimento se fixar.",
    },
    message:
      "Guide the user through a gratitude reflection. Ask them to notice something small that made them smile or something they appreciate right now.",
  },
  {
    id: "gratitude-2",
    icon: SunIcon,
    label: {
      en: "What made you smile today?",
      es: "¿Qué te hizo sonreír hoy?",
      fr: "Qu'est-ce qui vous a fait sourire aujourd'hui ?",
      de: "Was hat dich heute zum Lächeln gebracht?",
      pl: "Co dziś wywołało twój uśmiech?",
      pt: "O que fez você sorrir hoje?",
    },
    description: {
      en: "I'd love to hear about the bright moments in your day. Sharing them can make the good feelings last even longer.",
      es: "Me encantaría escuchar sobre los momentos brillantes de tu día. Compartirlos puede hacer que las buenas sensaciones duren aún más.",
      fr: "J'aimerais entendre parler des beaux moments de votre journée. Les partager peut prolonger les bonnes sensations.",
      de: "Ich würde gerne von den schönen Momenten deines Tages hören. Sie zu teilen kann die guten Gefühle noch länger anhalten lassen.",
      pl: "Chętnie posłucham o jasnych momentach twojego dnia. Dzielenie się nimi sprawia, że dobre uczucia trwają jeszcze dłużej.",
      pt: "Adoraria ouvir sobre os momentos brilhantes do seu dia. Compartilhá-los pode fazer as boas sensações durarem ainda mais.",
    },
    message:
      "Help the user identify a bright spot in their day. Ask who or what made a positive difference and explore why it mattered to them.",
  },
  {
    id: "gratitude-3",
    icon: SunIcon,
    label: {
      en: "What are you thankful for?",
      es: "¿Por qué estás agradecido?",
      fr: "De quoi êtes-vous reconnaissant ?",
      de: "Wofür bist du dankbar?",
      pl: "Za co jesteś wdzięczny?",
      pt: "Pelo que você é grato?",
    },
    description: {
      en: "Naming what you appreciate can shift your whole perspective. Let's take a moment to sit with something meaningful.",
      es: "Nombrar lo que aprecias puede cambiar toda tu perspectiva. Tomemos un momento para reflexionar sobre algo significativo.",
      fr: "Nommer ce que vous appréciez peut changer toute votre perspective. Prenons un moment pour savourer quelque chose de significatif.",
      de: "Zu benennen, was du schätzt, kann deine ganze Perspektive verändern. Lass uns einen Moment bei etwas Bedeutsamem verweilen.",
      pl: "Nazwanie tego, co cenisz, może zmienić całą twoją perspektywę. Zatrzymajmy się na chwilę przy czymś ważnym.",
      pt: "Nomear o que você aprecia pode mudar toda a sua perspectiva. Vamos dedicar um momento a algo significativo.",
    },
    message:
      "Ask the user to name one thing they are grateful for right now. Explore what makes it meaningful and help them sit with that feeling.",
  },
];

const stress: WellbeingPrompt[] = [
  {
    id: "stress-1",
    icon: CloudIcon,
    label: {
      en: "Need to vent?",
      es: "¿Necesitas desahogarte?",
      fr: "Besoin de vous exprimer ?",
      de: "Musst du dir Luft machen?",
      pl: "Potrzebujesz się wygadać?",
      pt: "Precisa desabafar?",
    },
    description: {
      en: "Sometimes you just need to get it off your chest. I'm here to listen without judgment — say whatever you need to say.",
      es: "A veces solo necesitas sacarlo de tu pecho. Estoy aquí para escuchar sin juzgar — di lo que necesites decir.",
      fr: "Parfois on a juste besoin de vider son sac. Je suis là pour écouter sans juger — dites ce que vous avez besoin de dire.",
      de: "Manchmal muss man sich einfach alles von der Seele reden. Ich bin hier, um ohne Urteil zuzuhören — sag, was du sagen musst.",
      pl: "Czasem trzeba po prostu wyrzucić to z siebie. Jestem tu, żeby słuchać bez oceniania — powiedz to, co musisz powiedzieć.",
      pt: "Às vezes você só precisa tirar isso do peito. Estou aqui para ouvir sem julgamento — diga o que precisar dizer.",
    },
    message:
      "Create a safe, non-judgmental space for the user. Ask if anything is weighing on them right now and listen with empathy.",
  },
  {
    id: "stress-2",
    icon: CloudIcon,
    label: {
      en: "Feeling overwhelmed?",
      es: "¿Te sientes abrumado?",
      fr: "Vous sentez-vous submergé ?",
      de: "Fühlst du dich überfordert?",
      pl: "Czujesz się przytłoczony?",
      pt: "Sentindo-se sobrecarregado?",
    },
    description: {
      en: "It's okay to feel overwhelmed — let's talk through it together. We can figure out small steps that might help you feel lighter.",
      es: "Está bien sentirse abrumado — hablemos juntos. Podemos encontrar pequeños pasos que te ayuden a sentirte más ligero.",
      fr: "C'est normal de se sentir submergé — parlons-en ensemble. Nous pouvons trouver de petits pas pour vous sentir plus léger.",
      de: "Es ist okay, sich überfordert zu fühlen — lass uns gemeinsam darüber reden. Wir können kleine Schritte finden, die dir helfen, dich leichter zu fühlen.",
      pl: "W porządku jest czuć się przytłoczonym — porozmawiajmy o tym razem. Znajdziemy małe kroki, które pomogą ci poczuć się lżej.",
      pt: "Tudo bem se sentir sobrecarregado — vamos conversar sobre isso juntos. Podemos encontrar pequenos passos para ajudar você a se sentir mais leve.",
    },
    message:
      "Help the user identify what would help them feel a little lighter today. Gently explore sources of stress and brainstorm small steps toward relief.",
  },
];

const selfReflection: WellbeingPrompt[] = [
  {
    id: "self-reflection-1",
    icon: SparklesIcon,
    label: {
      en: "What are you proud of?",
      es: "¿De qué estás orgulloso?",
      fr: "De quoi êtes-vous fier ?",
      de: "Worauf bist du stolz?",
      pl: "Z czego jesteś dumny?",
      pt: "Do que você se orgulha?",
    },
    description: {
      en: "You've been doing more than you give yourself credit for. Let's celebrate your wins — big or small, they all count.",
      es: "Has estado haciendo más de lo que te reconoces. Celebremos tus logros — grandes o pequeños, todos cuentan.",
      fr: "Vous faites plus que vous ne le pensez. Célébrons vos victoires — grandes ou petites, elles comptent toutes.",
      de: "Du leistest mehr, als du dir zugestehst. Lass uns deine Erfolge feiern — ob groß oder klein, sie zählen alle.",
      pl: "Robisz więcej niż sobie przypisujesz. Świętujmy twoje sukcesy — duże czy małe, wszystkie się liczą.",
      pt: "Você tem feito mais do que se dá crédito. Vamos celebrar suas conquistas — grandes ou pequenas, todas contam.",
    },
    message:
      "Guide the user in self-reflection. Ask what they have been proud of recently and help them acknowledge their growth and achievements.",
  },
  {
    id: "self-reflection-2",
    icon: SparklesIcon,
    label: {
      en: "What does your ideal day look like?",
      es: "¿Cómo sería tu día ideal?",
      fr: "À quoi ressemble votre journée idéale ?",
      de: "Wie sieht dein idealer Tag aus?",
      pl: "Jak wygląda twój idealny dzień?",
      pt: "Como seria seu dia ideal?",
    },
    description: {
      en: "Let's dream a little and explore what really matters to you. Sometimes imagining the life you want is the first step toward it.",
      es: "Soñemos un poco y exploremos lo que realmente te importa. A veces imaginar la vida que quieres es el primer paso hacia ella.",
      fr: "Rêvons un peu et explorons ce qui compte vraiment pour vous. Parfois imaginer la vie qu'on veut est le premier pas pour y arriver.",
      de: "Lass uns ein wenig träumen und erkunden, was dir wirklich wichtig ist. Manchmal ist das Vorstellen des Lebens, das du willst, der erste Schritt dorthin.",
      pl: "Pomarzmy trochę i zbadajmy, co naprawdę jest dla ciebie ważne. Czasem wyobrażenie sobie życia, jakiego chcesz, to pierwszy krok w jego stronę.",
      pt: "Vamos sonhar um pouco e explorar o que realmente importa para você. Às vezes imaginar a vida que você quer é o primeiro passo para alcançá-la.",
    },
    message:
      "Invite the user to dream a little. Ask what their ideal day would look like and explore what elements matter most to them.",
  },
  {
    id: "self-reflection-3",
    icon: SparklesIcon,
    label: {
      en: "Want to know yourself better?",
      es: "¿Quieres conocerte mejor?",
      fr: "Envie de mieux vous connaître ?",
      de: "Willst du dich besser kennenlernen?",
      pl: "Chcesz lepiej poznać siebie?",
      pt: "Quer se conhecer melhor?",
    },
    description: {
      en: "There's always more to discover about yourself. Let's dig a little deeper together — you might be surprised by what comes up.",
      es: "Siempre hay más por descubrir sobre ti. Profundicemos juntos — puede que te sorprenda lo que aparezca.",
      fr: "Il y a toujours plus à découvrir sur soi. Creusons un peu ensemble — vous pourriez être surpris par ce qui émerge.",
      de: "Es gibt immer mehr über dich zu entdecken. Lass uns gemeinsam etwas tiefer graben — du könntest überrascht sein, was dabei herauskommt.",
      pl: "Zawsze jest coś więcej do odkrycia o sobie. Pokopmy razem trochę głębiej — możesz być zaskoczony tym, co się pojawi.",
      pt: "Sempre há mais para descobrir sobre você. Vamos cavar um pouco mais fundo juntos — você pode se surpreender com o que aparecer.",
    },
    message:
      "Help the user explore themselves more deeply. Ask if there is something they would like to understand about themselves and guide gentle self-inquiry.",
  },
];

const sleep: WellbeingPrompt[] = [
  {
    id: "sleep-1",
    icon: MoonIcon,
    label: {
      en: "How did you sleep last night?",
      es: "¿Cómo dormiste anoche?",
      fr: "Comment avez-vous dormi cette nuit ?",
      de: "Wie hast du letzte Nacht geschlafen?",
      pl: "Jak spałeś ostatniej nocy?",
      pt: "Como você dormiu ontem à noite?",
    },
    description: {
      en: "Good rest changes everything. Let's talk about how you've been sleeping and what we can do to make it better.",
      es: "Un buen descanso lo cambia todo. Hablemos de cómo has dormido y qué podemos hacer para mejorarlo.",
      fr: "Un bon repos change tout. Parlons de comment vous dormez et de ce qu'on peut faire pour l'améliorer.",
      de: "Guter Schlaf verändert alles. Lass uns darüber reden, wie du geschlafen hast und was wir verbessern können.",
      pl: "Dobry odpoczynek zmienia wszystko. Porozmawiajmy o tym, jak sypiasz i co możemy zrobić, żeby było lepiej.",
      pt: "Um bom descanso muda tudo. Vamos conversar sobre como você tem dormido e o que podemos fazer para melhorar.",
    },
    message:
      "Check in with the user about their sleep. Ask how they slept last night and explore what might be affecting their rest quality.",
  },
  {
    id: "sleep-2",
    icon: MoonIcon,
    label: {
      en: "Feeling low on energy?",
      es: "¿Te sientes sin energía?",
      fr: "Vous manquez d'énergie ?",
      de: "Fühlst du dich energielos?",
      pl: "Brakuje ci energii?",
      pt: "Sentindo falta de energia?",
    },
    description: {
      en: "Your body is trying to tell you something. Let's tune in together and figure out what you need to recharge.",
      es: "Tu cuerpo está intentando decirte algo. Sintonicemos juntos y descubramos qué necesitas para recargarte.",
      fr: "Votre corps essaie de vous dire quelque chose. Écoutons ensemble et trouvons ce dont vous avez besoin pour vous ressourcer.",
      de: "Dein Körper versucht dir etwas zu sagen. Lass uns gemeinsam hinhören und herausfinden, was du brauchst, um aufzutanken.",
      pl: "Twoje ciało próbuje ci coś powiedzieć. Wsłuchajmy się razem i dowiedzmy się, czego potrzebujesz, żeby się naładować.",
      pt: "Seu corpo está tentando dizer algo. Vamos ouvir juntos e descobrir o que você precisa para recarregar.",
    },
    message:
      "Explore the user's energy levels today. Ask what their energy is like and discuss what might be contributing to how they feel physically.",
  },
  {
    id: "sleep-3",
    icon: MoonIcon,
    label: {
      en: "What keeps you up at night?",
      es: "¿Qué te mantiene despierto por la noche?",
      fr: "Qu'est-ce qui vous empêche de dormir ?",
      de: "Was hält dich nachts wach?",
      pl: "Co nie daje ci spać w nocy?",
      pt: "O que te mantém acordado à noite?",
    },
    description: {
      en: "Evening overthinking can be exhausting. Let's unpack those racing thoughts together so you can finally rest easier.",
      es: "Pensar demasiado por la noche puede ser agotador. Desempaqueemos juntos esos pensamientos acelerados para que puedas descansar mejor.",
      fr: "Trop réfléchir le soir peut être épuisant. Démêlons ensemble ces pensées qui s'emballent pour que vous puissiez enfin vous reposer.",
      de: "Abendliches Grübeln kann erschöpfend sein. Lass uns gemeinsam diese rasenden Gedanken auspacken, damit du endlich besser ruhen kannst.",
      pl: "Wieczorne zamartwianie się może być wyczerpujące. Rozpakujmy razem te pędzące myśli, żebyś wreszcie mógł spokojnie odpocząć.",
      pt: "Pensar demais à noite pode ser exaustivo. Vamos desempacotar juntos esses pensamentos acelerados para que você finalmente descanse melhor.",
    },
    message:
      "Help the user address what might be keeping them up at night. Gently ask about worries or thoughts that linger and help them process those feelings.",
  },
];

const mindfulness: WellbeingPrompt[] = [
  {
    id: "mindfulness-1",
    icon: WindIcon,
    label: {
      en: "Need a breather?",
      es: "¿Necesitas respirar un momento?",
      fr: "Besoin de souffler un peu ?",
      de: "Brauchst du eine Atempause?",
      pl: "Potrzebujesz chwili oddechu?",
      pt: "Precisa de um respiro?",
    },
    description: {
      en: "Let's take a slow breath together and just be here for a moment. Sometimes a pause is all you need to feel like yourself again.",
      es: "Tomemos juntos una respiración lenta y simplemente estemos aquí un momento. A veces una pausa es todo lo que necesitas para sentirte tú mismo de nuevo.",
      fr: "Prenons une respiration lente ensemble et soyons simplement ici un instant. Parfois une pause suffit pour se retrouver.",
      de: "Lass uns zusammen einen langsamen Atemzug nehmen und einfach einen Moment hier sein. Manchmal ist eine Pause alles, was du brauchst, um dich wieder wie du selbst zu fühlen.",
      pl: "Weźmy razem powolny oddech i po prostu bądźmy tu przez chwilę. Czasem pauza to wszystko, czego potrzebujesz, żeby znów poczuć się sobą.",
      pt: "Vamos respirar devagar juntos e simplesmente estar aqui por um momento. Às vezes uma pausa é tudo que você precisa para se sentir você mesmo de novo.",
    },
    message:
      "Guide the user through a brief breathing exercise. Invite them to take a slow breath and then ask what they notice in their body and mind.",
  },
  {
    id: "mindfulness-2",
    icon: WindIcon,
    label: {
      en: "Feeling scattered?",
      es: "¿Te sientes disperso?",
      fr: "Vous sentez-vous dispersé ?",
      de: "Fühlst du dich zerstreut?",
      pl: "Czujesz się rozproszony?",
      pt: "Sentindo-se disperso?",
    },
    description: {
      en: "When your mind is all over the place, coming back to the present can help. I'm here to guide you back to center.",
      es: "Cuando tu mente está en todas partes, volver al presente puede ayudar. Estoy aquí para guiarte de vuelta al centro.",
      fr: "Quand votre esprit s'éparpille, revenir au présent peut aider. Je suis là pour vous guider vers votre centre.",
      de: "Wenn dein Kopf überall ist, kann die Rückkehr zum Moment helfen. Ich bin hier, um dich zurück zu deiner Mitte zu führen.",
      pl: "Kiedy twój umysł jest wszędzie, powrót do teraźniejszości może pomóc. Jestem tu, żeby poprowadzić cię z powrotem do centrum.",
      pt: "Quando sua mente está em todo lugar, voltar ao presente pode ajudar. Estou aqui para guiar você de volta ao centro.",
    },
    message:
      "Help the user practice presence. Ask them what they are aware of right now and gently guide them to notice their surroundings and inner state.",
  },
  {
    id: "mindfulness-3",
    icon: WindIcon,
    label: {
      en: "Need to feel grounded?",
      es: "¿Necesitas sentirte conectado?",
      fr: "Besoin de vous sentir ancré ?",
      de: "Brauchst du etwas Erdung?",
      pl: "Potrzebujesz się uziemić?",
      pt: "Precisa se sentir conectado?",
    },
    description: {
      en: "Let's use your senses to bring you back to the here and now. A simple grounding exercise can make a world of difference.",
      es: "Usemos tus sentidos para traerte de vuelta al aquí y ahora. Un simple ejercicio de conexión puede hacer una gran diferencia.",
      fr: "Utilisons vos sens pour vous ramener à l'ici et maintenant. Un simple exercice d'ancrage peut faire toute la différence.",
      de: "Lass uns deine Sinne nutzen, um dich ins Hier und Jetzt zurückzubringen. Eine einfache Erdungsübung kann einen großen Unterschied machen.",
      pl: "Użyjmy twoich zmysłów, żeby wrócić do tu i teraz. Proste ćwiczenie uziemienia może zrobić ogromną różnicę.",
      pt: "Vamos usar seus sentidos para trazê-lo de volta ao aqui e agora. Um simples exercício de aterramento pode fazer toda a diferença.",
    },
    message:
      "Guide the user through a grounding exercise. Ask them to describe what is around them in this moment and use sensory awareness to bring calm.",
  },
];

// ── All prompts flat list (for lookup by ID) ──

const allPrompts: WellbeingPrompt[] = [
  ...moodMorning,
  ...moodAfternoon,
  ...moodEvening,
  ...gratitude,
  ...stress,
  ...selfReflection,
  ...sleep,
  ...mindfulness,
];

export function getPromptById(
  id: string,
  lang: Language,
): ResolvedWellbeingPrompt | null {
  const prompt = allPrompts.find((p) => p.id === id);
  if (!prompt) return null;
  return resolvePrompt(prompt, lang);
}

// ── Selection logic ──

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

const topicPools = [gratitude, stress, selfReflection, sleep, mindfulness];

function pickFromRemainingPool(exclude: WellbeingPrompt[]): WellbeingPrompt {
  const available = topicPools.filter((pool) => pool !== exclude);
  const pool = available[Math.floor(Math.random() * available.length)];
  return pickRandom(pool);
}

function resolvePrompt(
  prompt: WellbeingPrompt,
  lang: Language,
): ResolvedWellbeingPrompt {
  const langSuffix = LANGUAGE_NAMES[lang];
  return {
    id: prompt.id,
    icon: prompt.icon,
    label: t(prompt.label, lang),
    description: t(prompt.description, lang),
    message: langSuffix
      ? `${prompt.message}\n\nRespond in ${langSuffix}.`
      : prompt.message,
  };
}

export function getWellbeingPrompts(lang: Language): ResolvedWellbeingPrompt[] {
  const hour = new Date().getHours();

  let picks: WellbeingPrompt[];

  if (hour >= 5 && hour < 12) {
    picks = [
      pickRandom(moodMorning),
      pickRandom(gratitude),
      pickFromRemainingPool(gratitude),
    ];
  } else if (hour >= 12 && hour < 18) {
    picks = [
      pickRandom(moodAfternoon),
      pickRandom(selfReflection),
      pickFromRemainingPool(selfReflection),
    ];
  } else if (hour >= 18 && hour < 23) {
    picks = [
      pickRandom(moodEvening),
      pickRandom(sleep),
      pickFromRemainingPool(sleep),
    ];
  } else {
    picks = [
      pickRandom(sleep),
      pickRandom(mindfulness),
      pickFromRemainingPool(mindfulness),
    ];
  }

  return picks.map((p) => resolvePrompt(p, lang));
}

// ── Greetings ──

const greetingsMorning: Greeting[] = [
  {
    title: {
      en: "Good morning",
      es: "Buenos días",
      fr: "Bonjour",
      de: "Guten Morgen",
      pl: "Dzień dobry",
      pt: "Bom dia",
    },
    subtitle: {
      en: "Let's start your day with a little check-in.",
      es: "Empecemos tu día con un pequeño chequeo.",
      fr: "Commençons la journée par un petit bilan.",
      de: "Starten wir den Tag mit einem kleinen Check-in.",
      pl: "Zacznijmy dzień od krótkiego check-inu.",
      pt: "Vamos começar o dia com um pequeno check-in.",
    },
  },
  {
    title: {
      en: "Rise and shine",
      es: "Arriba y adelante",
      fr: "Debout et en forme",
      de: "Aufstehen und strahlen",
      pl: "Wstawaj i świeć",
      pt: "Levante e brilhe",
    },
    subtitle: {
      en: "How are you feeling as your day begins?",
      es: "¿Cómo te sientes al comenzar tu día?",
      fr: "Comment vous sentez-vous en ce début de journée ?",
      de: "Wie fühlst du dich zum Start in den Tag?",
      pl: "Jak się czujesz na początku dnia?",
      pt: "Como você está se sentindo ao começar o dia?",
    },
  },
  {
    title: {
      en: "Ready for a new day?",
      es: "¿Listo para un nuevo día?",
      fr: "Prêt pour une nouvelle journée ?",
      de: "Bereit für einen neuen Tag?",
      pl: "Gotowy na nowy dzień?",
      pt: "Pronto para um novo dia?",
    },
    subtitle: {
      en: "Take a moment before you dive in.",
      es: "Tómate un momento antes de sumergirte.",
      fr: "Prenez un moment avant de vous lancer.",
      de: "Nimm dir einen Moment, bevor du loslegst.",
      pl: "Zatrzymaj się na chwilę zanim zaczniesz.",
      pt: "Tire um momento antes de mergulhar.",
    },
  },
];

const greetingsAfternoon: Greeting[] = [
  {
    title: {
      en: "Good afternoon",
      es: "Buenas tardes",
      fr: "Bon après-midi",
      de: "Guten Nachmittag",
      pl: "Dzień dobry",
      pt: "Boa tarde",
    },
    subtitle: {
      en: "A quick pause can make all the difference.",
      es: "Una pausa rápida puede marcar la diferencia.",
      fr: "Une courte pause peut tout changer.",
      de: "Eine kurze Pause kann den Unterschied machen.",
      pl: "Krótka przerwa może wiele zmienić.",
      pt: "Uma pausa rápida pode fazer toda a diferença.",
    },
  },
  {
    title: {
      en: "How's your day?",
      es: "¿Cómo va tu día?",
      fr: "Comment va votre journée ?",
      de: "Wie läuft dein Tag?",
      pl: "Jak mija dzień?",
      pt: "Como está seu dia?",
    },
    subtitle: {
      en: "I'm here if you'd like to talk things through.",
      es: "Estoy aquí si quieres hablar.",
      fr: "Je suis là si vous voulez en parler.",
      de: "Ich bin da, wenn du reden möchtest.",
      pl: "Jestem tu jeśli chcesz porozmawiać.",
      pt: "Estou aqui se quiser conversar.",
    },
  },
  {
    title: {
      en: "Taking a break?",
      es: "¿Tomando un descanso?",
      fr: "Vous faites une pause ?",
      de: "Machst du Pause?",
      pl: "Robisz przerwę?",
      pt: "Fazendo uma pausa?",
    },
    subtitle: {
      en: "Perfect time to check in with yourself.",
      es: "Momento perfecto para hacer un chequeo contigo.",
      fr: "Le moment idéal pour faire le point.",
      de: "Die perfekte Zeit, um bei dir einzuchecken.",
      pl: "Idealny moment by sprawdzić jak się czujesz.",
      pt: "Momento perfeito para fazer um check-in consigo.",
    },
  },
];

const greetingsEvening: Greeting[] = [
  {
    title: {
      en: "Good evening",
      es: "Buenas noches",
      fr: "Bonsoir",
      de: "Guten Abend",
      pl: "Dobry wieczór",
      pt: "Boa noite",
    },
    subtitle: {
      en: "Let's reflect on your day together.",
      es: "Reflexionemos juntos sobre tu día.",
      fr: "Réfléchissons ensemble à votre journée.",
      de: "Lass uns gemeinsam auf deinen Tag zurückblicken.",
      pl: "Zastanówmy się wspólnie nad twoim dniem.",
      pt: "Vamos refletir juntos sobre seu dia.",
    },
  },
  {
    title: {
      en: "Winding down?",
      es: "¿Relajándote?",
      fr: "Vous vous détendez ?",
      de: "Entspannst du dich?",
      pl: "Wyciszasz się?",
      pt: "Relaxando?",
    },
    subtitle: {
      en: "A moment of reflection before the day ends.",
      es: "Un momento de reflexión antes de que termine el día.",
      fr: "Un moment de réflexion avant la fin de la journée.",
      de: "Ein Moment der Reflexion, bevor der Tag endet.",
      pl: "Chwila refleksji zanim dzień się skończy.",
      pt: "Um momento de reflexão antes do dia terminar.",
    },
  },
  {
    title: {
      en: "How was your day?",
      es: "¿Cómo fue tu día?",
      fr: "Comment s'est passée votre journée ?",
      de: "Wie war dein Tag?",
      pl: "Jak minął twój dzień?",
      pt: "Como foi seu dia?",
    },
    subtitle: {
      en: "I'd love to hear how things went.",
      es: "Me encantaría saber cómo te fue.",
      fr: "J'aimerais savoir comment ça s'est passé.",
      de: "Ich würde gerne hören, wie es gelaufen ist.",
      pl: "Chętnie posłucham jak było.",
      pt: "Adoraria ouvir como foram as coisas.",
    },
  },
];

const greetingsNight: Greeting[] = [
  {
    title: {
      en: "Still up?",
      es: "¿Aún despierto?",
      fr: "Encore debout ?",
      de: "Noch wach?",
      pl: "Jeszcze nie śpisz?",
      pt: "Ainda acordado?",
    },
    subtitle: {
      en: "I'm here if you need someone to talk to.",
      es: "Estoy aquí si necesitas hablar con alguien.",
      fr: "Je suis là si vous avez besoin de parler.",
      de: "Ich bin da, wenn du jemanden zum Reden brauchst.",
      pl: "Jestem tu jeśli potrzebujesz z kimś porozmawiać.",
      pt: "Estou aqui se precisar conversar.",
    },
  },
  {
    title: {
      en: "Can't sleep?",
      es: "¿No puedes dormir?",
      fr: "Vous n'arrivez pas à dormir ?",
      de: "Kannst nicht schlafen?",
      pl: "Nie możesz zasnąć?",
      pt: "Não consegue dormir?",
    },
    subtitle: {
      en: "Sometimes it helps to get thoughts out of your head.",
      es: "A veces ayuda sacar los pensamientos de tu cabeza.",
      fr: "Parfois ça aide de vider ses pensées.",
      de: "Manchmal hilft es, Gedanken loszulassen.",
      pl: "Czasem pomaga wyrzucić myśli z głowy.",
      pt: "Às vezes ajuda tirar os pensamentos da cabeça.",
    },
  },
  {
    title: {
      en: "Night owl?",
      es: "¿Ave nocturna?",
      fr: "Oiseau de nuit ?",
      de: "Nachteule?",
      pl: "Nocny marek?",
      pt: "Coruja noturna?",
    },
    subtitle: {
      en: "Late nights can be good for reflection.",
      es: "Las noches tardías pueden ser buenas para reflexionar.",
      fr: "Les nuits tardives peuvent être propices à la réflexion.",
      de: "Späte Nächte können gut für Reflexion sein.",
      pl: "Późne noce mogą być dobre do refleksji.",
      pt: "Noites tardias podem ser boas para reflexão.",
    },
  },
];

export function getGreeting(lang: Language): ResolvedGreeting {
  const hour = new Date().getHours();
  let pool: Greeting[];

  if (hour >= 5 && hour < 12) pool = greetingsMorning;
  else if (hour >= 12 && hour < 18) pool = greetingsAfternoon;
  else if (hour >= 18 && hour < 23) pool = greetingsEvening;
  else pool = greetingsNight;

  const greeting = pickRandom(pool);
  return {
    title: t(greeting.title, lang),
    subtitle: t(greeting.subtitle, lang),
  };
}
