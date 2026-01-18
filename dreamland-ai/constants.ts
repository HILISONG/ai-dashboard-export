
import { CardData, Rarity, Hero, StoryPhase } from './types';

export const TOTAL_PAGES = 10;
// Triggers at end of page: 1 (Setup), 3 (Adv), 5 (Adv), 7 (Climax), 9 (Resolution)
export const GACHA_TRIGGER_PAGES = [1, 3, 5, 7, 9];

// --- Phase Logic ---
export const PHASE_CONFIG = {
  [StoryPhase.SETUP]: {
    range: [1, 2],
    goal: "Simply introduce the hero and the setting. Show, don't tell.", 
    tone: "Welcoming, descriptive, peaceful."
  },
  [StoryPhase.ADVENTURE]: {
    range: [3, 4, 5, 6],
    goal: "Exploration, meeting NPCs, facing minor obstacles. Rising action.",
    tone: "Exciting, curious, interactive."
  },
  [StoryPhase.CLIMAX]: {
    range: [7, 8],
    goal: "High stakes, big challenges, or the central mystery revealed.",
    tone: "Dramatic, intense, epic, fast-paced."
  },
  [StoryPhase.RESOLUTION]: {
    range: [9, 10],
    goal: "Winding down. Reward received, lesson learned, journey concludes.",
    tone: "Warm, reflective, satisfying."
  }
};

// --- World Selection ---
export interface World {
  id: string;
  name: string;
  description: string;
  image: string; // URL or empty string
  icon: string;  // Emoji/Icon fallback
  locked: boolean;
  colorClass: string;
}

export const WORLDS: World[] = [
  {
    id: 'sky-island',
    name: 'Sky Island',
    description: 'A whimsical world of floating islands, cloud whales, and infinite blue skies.',
    image: 'https://i.postimg.cc/J4Wsjr3m/jimeng-2026-01-07-9262-3D-stylized-rendering-pixar-style-anima.png', 
    icon: '☁️🏝️',
    locked: false,
    colorClass: 'bg-sky-100'
  },
  {
    id: 'neon-city',
    name: 'Neon City',
    description: 'A cyberpunk city run by robot cats and friendly drones.',
    image: 'https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=400&auto=format&fit=crop',
    icon: '🤖🌆',
    locked: true,
    colorClass: 'bg-purple-100'
  },
  {
    id: 'dino-valley',
    name: 'Dino Valley',
    description: 'Travel back in time to where dinosaurs wear hats and host tea parties.',
    image: 'https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?q=80&w=400&auto=format&fit=crop',
    icon: '🦕🌋',
    locked: true,
    colorClass: 'bg-green-100'
  }
];

// --- HERO ROSTER ---

export const DEFAULT_HEROES: Hero[] = [
  {
    id: 'lumo',
    name: 'Lumo',
    power: 'Magic Glow',
    aiInstruction: 'A cute dinosaur dragon. Brave, breathes magical light instead of fire, very loyal.',
    emoji: '🐲',
    avatarUrl: 'https://i.postimg.cc/KjbGTptX/jimeng-2026-01-09-8795-3D-stylized-rendering-pixar-style-anima.png',
    appearance: 'A cute, chubby, anthropomorphic dinosaur with bright sunny-yellow skin featuring a subtle, pebbled scale texture. Round pear-shaped body with a cream underbelly. Row of soft triangular orange spikes down the back. Short thick arms and stout legs.'
  },
  {
    id: 'jules',
    name: 'Jules',
    power: 'The Unlikely Leader',
    aiInstruction: 'Protagonist trait: "Main Character Energy". Not the strongest, but lucky and charismatic. Things tend to work out for them.',
    emoji: '🧢',
    avatarUrl: 'https://i.postimg.cc/nLn17wQG/jimeng-2026-01-06-9485-3D-stylized-rendering-pixar-style-anim.png', 
    appearance: 'Young boy with messy tousled brown hair, large brown eyes, and freckles on his nose. He is wearing a distressed blue denim jacket with colorful stitched patches, a red patterned bandana tied around his neck, a grey undershirt, and a necklace with a round bronze pendant.'
  },
  {
    id: 'noa',
    name: 'Noa',
    power: 'Pattern Decoder',
    aiInstruction: 'Protagonist trait: Analytical. Sees connections others miss, solves puzzles easily, understands machines.',
    emoji: '🧩',
    avatarUrl: 'https://i.postimg.cc/L6BDXpnT/jimeng-2026-01-06-3609-3D-stylized-rendering-pixar-style-anim.png',
    appearance: 'A young girl with dark hair styled in two pigtails with orange and green ties. She has large round glasses and freckles. She is wearing a light green t-shirt under green corduroy overalls with several colorful pens in the chest pocket and brown shoes.'
  }
];

export const UNLOCKABLE_HEROES: Hero[] = [
  // --- GOLD TIER ---
  {
    id: 'bop',
    name: 'Bop',
    power: 'Super Strength',
    aiInstruction: 'A friendly giant monster. Gentle, strong, loves snacks, speaks in simple sentences.',
    emoji: '🟣',
    avatarUrl: 'https://i.postimg.cc/hhFG24k7/jimeng-2026-01-09-5331-3D-stylized-rendering-pixar-style-anima.png',
    appearance: 'Chubby anthropomorphic creature with a highly rounded, plump, soft silhouette and oversized round head blending seamlessly into the body. Entire body covered in thick, fluffy, shaggy dark purple fur except for a large, smooth, oval-shaped white fur patch covering the full belly, chest, and lower face/muzzle area. Small rounded ears on top of head. Very large, wide-set round eyes with glossy brown irises. Wears only a small bright yellow backpack with black diagonal strap.',
    isLocked: true
  },
  {
    id: 'arcade',
    name: 'Arcade',
    power: 'Computer Brain',
    aiInstruction: 'A helpful robot with a TV head. Literal-minded, scans environment, beeps and boops.',
    emoji: '📺',
    avatarUrl: 'https://i.postimg.cc/4yccf0ZF/jimeng-2026-01-09-1300-3D-stylized-rendering-pixar-style-anima.png',
    appearance: 'Head is a worn, blocky red metal CRT television casing with scuffs and scratches. The curved glass screen displays a bright green pixelated smiley face. Connected via weathered metal articulated legs to a heavy-duty metal tank tread base with red hubcaps.',
    isLocked: true
  },
  {
    id: 'sprout',
    name: 'Sprout',
    power: 'Plant Whispering',
    aiInstruction: 'A forest elf/sprite. Loves nature, shy but helpful, can grow plants instantly.',
    emoji: '🍄',
    avatarUrl: 'https://i.postimg.cc/mgLPJkzW/jimeng-2026-01-09-7871.png',
    appearance: 'A small, green-skinned elf-like creature with rosy cheeks, pointy ears, and wispy light green hair. Wears a large, red Amanita muscaria mushroom cap with prominent white spots as a hat. Dressed in a chunky, off-white knitted wool sweater covered in dirt. Green rubber wellington boots heavily caked in dark brown mud.',
    isLocked: true
  },
  {
    id: 'gloop',
    name: 'Gloop',
    power: 'Shape Shifting',
    aiInstruction: 'A friendly slime person. Cheerful, gooey, can squeeze through gaps.',
    emoji: '🟢',
    avatarUrl: 'https://i.postimg.cc/W114SyCL/jimeng-2026-01-09-7183-3D-stylized-rendering-pixar-style-anima.png',
    appearance: 'A humanoid character made entirely of translucent, bubbling, lime-green slime that drips and splashes. Wears a bright orange baseball cap backwards and black sunglasses over its smiling, round, green slime head. The body is viscous and glistening.',
    isLocked: true
  },
  // --- PLATINUM TIER ---
  {
    id: 'jet',
    name: 'Jet',
    power: 'Super Speed',
    aiInstruction: 'A high-energy racer kid. Impatient, fast-talking, loves speed and heights.',
    emoji: '🚀',
    avatarUrl: 'https://i.postimg.cc/DZTkpJ0G/jimeng-2026-01-09-9665-3D-stylized-rendering-pixar-style-anima.png',
    appearance: 'A sporty kid with wind-swept silver hair and aviator goggles on forehead. Wears a sleek aerodynamic blue and white racing suit with lightning bolt patterns.',
    isLocked: true
  },
  {
    id: 'vesper',
    name: 'Vesper',
    power: 'Invisibility',
    aiInstruction: 'A mysterious ninja cat. Quiet, protective, moves unseen, speaks in whispers.',
    emoji: '🐱',
    avatarUrl: 'https://i.postimg.cc/5yKrJ64g/jimeng-2026-01-09-6262-3D-stylized-rendering-pixar-style-anima.png',
    appearance: 'A small, fluffy black cat with large, glowing purple eyes that have a rainbow prism effect in the pupils. It wears a dark charcoal grey, slightly oversized hoodie with a front kangaroo pocket and drawstrings, hood up. On each foreleg, it has a glowing, ring-shaped purple wristband emitting purple light rays and particles.',
    isLocked: true
  },
  {
    id: 'coral',
    name: 'Coral',
    power: 'Water Breathing',
    aiInstruction: 'A cheerful mermaid kid. Loves water, collects shells, very friendly and bubbly.',
    emoji: '🧜‍♀️',
    avatarUrl: 'https://i.postimg.cc/3NNLtYXm/jimeng-2026-01-09-5295-3D-stylized-rendering-pixar-style-anima.png',
    appearance: 'A 8 year old mermaid with large brown eyes, freckles, and a wide smile has bright turquoise hair tied in a high ponytail with a purple band. She wears a short-sleeved, textured purple shirt with a scale pattern. Her long mermaid tail is covered in iridescent, multi-colored scales in a rainbow gradient.',
    isLocked: true
  }
];

export const SUPERPOWERS = [
  "Invisibility",
  "Flying",
  "Telepathy",
  "Super Strength",
  "Time Travel",
  "Talking to Animals",
  "Weather Control",
  "Teleportation",
  "Force Fields",
  "Laser Eyes",
  "Water Breathing",
  "Computer Brain",
  "Shape Shifting",
  "Plant Whispering",
  "Magic Glow",
  "Super Speed"
];

// --- EXTENSIVE CARD LIBRARY ---
export const ALL_CARDS: CardData[] = [
    // ============================================================
    // WORLD: SKY ISLAND (id: 'sky-island')
    // ============================================================

    // === SETUP (PHASE 1) - SKY ISLAND ===

    // Setup - Silver (Common: Atmosphere & Basic Gear)
    { id: 'si_s_s1', name: 'The Drift-Seed Landing', description: 'Float down gently holding the stem of a giant, fluff-filled dandelion seed.', rarity: Rarity.SILVER, phase: StoryPhase.SETUP, icon: '🌬️', worldId: 'sky-island' },
    { id: 'si_s_s2', name: 'The Reverse River', description: 'A waterfall flows upward, carrying blue pebbles into the sky.', rarity: Rarity.SILVER, phase: StoryPhase.SETUP, icon: '🌊', worldId: 'sky-island' },
    { id: 'si_s_s3', name: 'The Rusty Compass', description: 'An old compass where the needle points "Down" instead of North.', rarity: Rarity.SILVER, phase: StoryPhase.SETUP, icon: '🧭', worldId: 'sky-island' },
    { id: 'si_s_s4', name: 'The Whispering Mist', description: 'Thick, humming fog that sounds like a tune when listened to closely.', rarity: Rarity.SILVER, phase: StoryPhase.SETUP, icon: '🌫️', worldId: 'sky-island' },
    { id: 'si_s_s5', name: 'The Hollow Bone Bridge', description: 'A path formed from the bleached ribcage of an ancient sky-beast.', rarity: Rarity.SILVER, phase: StoryPhase.SETUP, icon: '🦴', worldId: 'sky-island' },
    { id: 'si_s_s6', name: 'The Gravity-Light Boots', description: 'Boots that make you weigh as little as a feather when worn.', rarity: Rarity.SILVER, phase: StoryPhase.SETUP, icon: '🥾', worldId: 'sky-island' },
    { id: 'si_s_s7', name: 'The Static-Hair Zone', description: 'Energy-charged air makes your hair stand straight up and sparkle.', rarity: Rarity.SILVER, phase: StoryPhase.SETUP, icon: '⚡', worldId: 'sky-island' },
    { id: 'si_s_s8', name: 'The Glass-Winged Butterfly', description: 'A transparent-winged butterfly lands on your nose, smelling of vanilla.', rarity: Rarity.SILVER, phase: StoryPhase.SETUP, icon: '🦋', worldId: 'sky-island' },
    { id: 'si_s_s9', name: 'The Floating Puddles', description: 'Raindrops hover in mid-air like liquid marbles you must push aside.', rarity: Rarity.SILVER, phase: StoryPhase.SETUP, icon: '💧', worldId: 'sky-island' },
    { id: 'si_s_s10', name: 'The Echo-Flower', description: 'A flower repeating the last thing said near it: "Watch out for the wind."', rarity: Rarity.SILVER, phase: StoryPhase.SETUP, icon: '📢', worldId: 'sky-island' },
    { id: 'si_s_s11', name: 'The Stone Loaf', description: 'Backpack containing "Cloud Bread"—rock-hard until dipped in water.', rarity: Rarity.SILVER, phase: StoryPhase.SETUP, icon: '🍞', worldId: 'sky-island' },
    { id: 'si_s_s12', name: 'The Vine Ladder', description: 'Unfurl a long green vine to descend from your landing rock.', rarity: Rarity.SILVER, phase: StoryPhase.SETUP, icon: '🪜', worldId: 'sky-island' },
    { id: 'si_s_s13', name: 'The Silent Gale', description: 'A strong, utterly silent wind thrashes the trees.', rarity: Rarity.SILVER, phase: StoryPhase.SETUP, icon: '🍃', worldId: 'sky-island' },
    { id: 'si_s_s14', name: 'The Sun-Dial Watch', description: 'A wristwatch using a tiny captured shadow to tell time.', rarity: Rarity.SILVER, phase: StoryPhase.SETUP, icon: '⌚', worldId: 'sky-island' },
    { id: 'si_s_s15', name: 'The Bouncing Moss', description: 'Springy ground allows you to jump twice as high as normal.', rarity: Rarity.SILVER, phase: StoryPhase.SETUP, icon: '🌿', worldId: 'sky-island' },

    // Setup - Gold (Rare: Intriguing Discoveries & Minor Advantages)
    { id: 'si_s_g1', name: 'The Cartographer’s Satchel', description: 'Leather bag containing a map marking the Core with a red "X".', rarity: Rarity.GOLD, phase: StoryPhase.SETUP, icon: '🎒', worldId: 'sky-island' },
    { id: 'si_s_g2', name: 'The Wind-Goggles', description: 'Brass goggles revealing wind currents as glowing blue lines.', rarity: Rarity.GOLD, phase: StoryPhase.SETUP, icon: '🥽', worldId: 'sky-island' },
    { id: 'si_s_g3', name: 'The Clockwork Beetle', description: 'A mechanical bug scuttles ahead, trying to lead you somewhere.', rarity: Rarity.GOLD, phase: StoryPhase.SETUP, icon: '🐞', worldId: 'sky-island' },
    { id: 'si_s_g4', name: 'The Tether-Hook', description: 'Grappling hook with a rope of solidified light that never tangles.', rarity: Rarity.GOLD, phase: StoryPhase.SETUP, icon: '🪝', worldId: 'sky-island' },
    { id: 'si_s_g5', name: 'The Sky-Ray Runt', description: 'A dinner-plate-sized baby manta ray follows you like a puppy.', rarity: Rarity.GOLD, phase: StoryPhase.SETUP, icon: '🐟', worldId: 'sky-island' },
    { id: 'si_s_g6', name: 'The Singing Stone', description: 'A humming rock that calms aggressive plants when held.', rarity: Rarity.GOLD, phase: StoryPhase.SETUP, icon: '🪨', worldId: 'sky-island' },
    { id: 'si_s_g7', name: 'The Message in a Bottle', description: 'Floating note from a past explorer: "Don\'t trust the monkeys."', rarity: Rarity.GOLD, phase: StoryPhase.SETUP, icon: '🍾', worldId: 'sky-island' },
    { id: 'si_s_g8', name: 'The Phase-Shift Fruit', description: 'Blue fruit; one bite turns your hand invisible for 5 minutes.', rarity: Rarity.GOLD, phase: StoryPhase.SETUP, icon: '🍇', worldId: 'sky-island' },
    { id: 'si_s_g9', name: 'The Broken Automaton', description: 'Buried robot wakes briefly to warn: "Core... unstable..."', rarity: Rarity.GOLD, phase: StoryPhase.SETUP, icon: '🤖', worldId: 'sky-island' },
    { id: 'si_s_g10', name: 'The Magnetic Glove', description: 'Heavy glove that pulls small metal objects from a distance.', rarity: Rarity.GOLD, phase: StoryPhase.SETUP, icon: '🧤', worldId: 'sky-island' },
    { id: 'si_s_g11', name: 'The Cloud-Canoe', description: 'Small boat capable of paddling through clouds as if they were water.', rarity: Rarity.GOLD, phase: StoryPhase.SETUP, icon: '🛶', worldId: 'sky-island' },
    { id: 'si_s_g12', name: 'The Lookout’s Telescope', description: 'Fixed spyglass revealing the island boss\'s weak point.', rarity: Rarity.GOLD, phase: StoryPhase.SETUP, icon: '🔭', worldId: 'sky-island' },
    { id: 'si_s_g13', name: 'The Solar Lantern', description: 'Captures sunlight to release as a blinding flash against enemies.', rarity: Rarity.GOLD, phase: StoryPhase.SETUP, icon: '🏮', worldId: 'sky-island' },
    { id: 'si_s_g14', name: 'The Talking Door-Knocker', description: 'Sentient knocker demanding a riddle to open a shortcut.', rarity: Rarity.GOLD, phase: StoryPhase.SETUP, icon: '🚪', worldId: 'sky-island' },
    { id: 'si_s_g15', name: 'The Glider-Cape', description: 'Fabric scrap that stiffens into a hang-glider for short flights.', rarity: Rarity.GOLD, phase: StoryPhase.SETUP, icon: '🪁', worldId: 'sky-island' },

    // Setup - Platinum (Legendary: Powerful Artifacts & Companions)
    { id: 'si_s_p1', name: 'The Phoenix Hatchling', description: 'A tiny fire-bird imprints on you, providing light and warmth.', rarity: Rarity.PLATINUM, phase: StoryPhase.SETUP, icon: '🐣', worldId: 'sky-island' },
    { id: 'si_s_p2', name: 'The Anti-Gravity Belt', description: 'Ancient artifact allowing you to walk on walls or ceilings.', rarity: Rarity.PLATINUM, phase: StoryPhase.SETUP, icon: '🥋', worldId: 'sky-island' },
    { id: 'si_s_p3', name: 'The Spirit of the Wind', description: 'Elemental companion that promises to save you from one fall.', rarity: Rarity.PLATINUM, phase: StoryPhase.SETUP, icon: '🌬️', worldId: 'sky-island' },
    { id: 'si_s_p4', name: 'The Omni-Key', description: 'Starlight key that unlocks any single door or chest.', rarity: Rarity.PLATINUM, phase: StoryPhase.SETUP, icon: '🔑', worldId: 'sky-island' },
    { id: 'si_s_p5', name: 'The Living Map', description: 'Parchment that inks itself in real-time to show hidden paths.', rarity: Rarity.PLATINUM, phase: StoryPhase.SETUP, icon: '🗺️', worldId: 'sky-island' },
    { id: 'si_s_p6', name: 'The Golem\'s Heart', description: 'Insert this pulsing crystal into rocks to create a temporary bodyguard.', rarity: Rarity.PLATINUM, phase: StoryPhase.SETUP, icon: '💙', worldId: 'sky-island' },
    { id: 'si_s_p7', name: 'The Time-Glass', description: 'Flip to rewind time by 10 seconds (redo a bad choice).', rarity: Rarity.PLATINUM, phase: StoryPhase.SETUP, icon: '⏳', worldId: 'sky-island' },
    { id: 'si_s_p8', name: 'The Language of Birds', description: 'Eat a berry to instantly understand the island\'s animals.', rarity: Rarity.PLATINUM, phase: StoryPhase.SETUP, icon: '🐦', worldId: 'sky-island' },
    { id: 'si_s_p9', name: 'The Hover-Board', description: 'Sleek stone hovering a foot off the ground for fast travel.', rarity: Rarity.PLATINUM, phase: StoryPhase.SETUP, icon: '🛹', worldId: 'sky-island' },
    { id: 'si_s_p10', name: 'The Guardian’s Whistle', description: 'Blow to summon the Island’s Guardian to clear a path once.', rarity: Rarity.PLATINUM, phase: StoryPhase.SETUP, icon: '📢', worldId: 'sky-island' },
    { id: 'si_s_p11', name: 'The Shadow-Step Cloak', description: 'Woven from night sky; makes you completely invisible to enemies.', rarity: Rarity.PLATINUM, phase: StoryPhase.SETUP, icon: '🧥', worldId: 'sky-island' },
    { id: 'si_s_p12', name: 'The Teleportation Rune', description: 'Hand rune warping you past the adventure straight to the Climax.', rarity: Rarity.PLATINUM, phase: StoryPhase.SETUP, icon: '🌀', worldId: 'sky-island' },
    { id: 'si_s_p13', name: 'The Infinite Canteen', description: 'Never-empty bottle containing healing nectar from the core.', rarity: Rarity.PLATINUM, phase: StoryPhase.SETUP, icon: '🍶', worldId: 'sky-island' },
    { id: 'si_s_p14', name: 'The Storm-Caller’s Staff', description: 'Crackling staff capable of summoning lightning to destroy obstacles.', rarity: Rarity.PLATINUM, phase: StoryPhase.SETUP, icon: '🌩️', worldId: 'sky-island' },
    { id: 'si_s_p15', name: 'The Ancient Pilot', description: 'Hotwire a dormant machine to gain flight capabilities immediately.', rarity: Rarity.PLATINUM, phase: StoryPhase.SETUP, icon: '👨‍✈️', worldId: 'sky-island' },

    // === ADVENTURE (PHASE 2) - SKY ISLAND ===

    // Adventure - Silver (Common: Obstacles & Exploration)
    { id: 'si_a_s1', name: 'The Balloon-Fruit Grove', description: 'Hop across giant floating fruits that slowly sink under your weight.', rarity: Rarity.SILVER, phase: StoryPhase.ADVENTURE, icon: '🎈', worldId: 'sky-island' },
    { id: 'si_a_s2', name: 'The Cloud-Shark Fin', description: 'A scary fin in the clouds reveals itself as a friendly cloud-dolphin.', rarity: Rarity.SILVER, phase: StoryPhase.ADVENTURE, icon: '🦈', worldId: 'sky-island' },
    { id: 'si_a_s3', name: 'The Sticky-Sap Swamp', description: 'Tasty golden syrup drips from trees but glues your shoes to the ground.', rarity: Rarity.SILVER, phase: StoryPhase.ADVENTURE, icon: '🍯', worldId: 'sky-island' },
    { id: 'si_a_s4', name: 'The Sleepy Stone-Head', description: 'Tickle the blocking stone head\'s nose to make it sneeze and roll away.', rarity: Rarity.SILVER, phase: StoryPhase.ADVENTURE, icon: '🗿', worldId: 'sky-island' },
    { id: 'si_a_s5', name: 'The Wind-Tunnel', description: 'Crawl low to fight against a constant, powerful gust of wind.', rarity: Rarity.SILVER, phase: StoryPhase.ADVENTURE, icon: '💨', worldId: 'sky-island' },
    { id: 'si_a_s6', name: 'The Crystal Deer', description: 'Stay quiet so the transparent deer reveals a dry path through the mud.', rarity: Rarity.SILVER, phase: StoryPhase.ADVENTURE, icon: '🦌', worldId: 'sky-island' },
    { id: 'si_a_s7', name: 'The Whispering Vines', description: 'Thick vines gently wrap around you, mistaking you for a tree branch.', rarity: Rarity.SILVER, phase: StoryPhase.ADVENTURE, icon: '🌿', worldId: 'sky-island' },
    { id: 'si_a_s8', name: 'The Fog Maze', description: 'Zero visibility; follow the sound of distant bells to find the exit.', rarity: Rarity.SILVER, phase: StoryPhase.ADVENTURE, icon: '🌫️', worldId: 'sky-island' },
    { id: 'si_a_s9', name: 'The Rain of Feathers', description: 'Dodge heavy, wood-like feathers dropped by giant birds overhead.', rarity: Rarity.SILVER, phase: StoryPhase.ADVENTURE, icon: '🪶', worldId: 'sky-island' },
    { id: 'si_a_s10', name: 'The Hiccuping Bridge', description: 'Time your run across a rope bridge that twitches violently.', rarity: Rarity.SILVER, phase: StoryPhase.ADVENTURE, icon: '🌉', worldId: 'sky-island' },
    { id: 'si_a_s11', name: 'The Mimic Bush', description: 'Chase the giggling, scuttling bush to pick its berries.', rarity: Rarity.SILVER, phase: StoryPhase.ADVENTURE, icon: '🌳', worldId: 'sky-island' },
    { id: 'si_a_s12', name: 'The Pollen Explosion', description: 'Stepping on a puff-shroom causes a sneeze powerful enough to slide you backward.', rarity: Rarity.SILVER, phase: StoryPhase.ADVENTURE, icon: '🤧', worldId: 'sky-island' },
    { id: 'si_a_s13', name: 'The Upside-Down Rain', description: 'Rain falls upward from clouds below, soaking you feet-first.', rarity: Rarity.SILVER, phase: StoryPhase.ADVENTURE, icon: '☔', worldId: 'sky-island' },
    { id: 'si_a_s14', name: 'The Chatter-Squirrels', description: 'Squirrels pelt you with acorns until bribed with food or shiny buttons.', rarity: Rarity.SILVER, phase: StoryPhase.ADVENTURE, icon: '🐿️', worldId: 'sky-island' },
    { id: 'si_a_s15', name: 'The Moving Hill', description: 'The hill stands up—it\'s a giant sky-tortoise you must wait out.', rarity: Rarity.SILVER, phase: StoryPhase.ADVENTURE, icon: '🐢', worldId: 'sky-island' },

    // Adventure - Gold (Rare: Social Encounters & Puzzles) + UNLOCKABLE HEROES (Preserved)
    { id: 'si_a_g1', name: 'The Sky-Pirate Merchant', description: 'A raccoon in a balloon lowers a basket to trade a map for a story.', rarity: Rarity.GOLD, phase: StoryPhase.ADVENTURE, icon: '🦝', worldId: 'sky-island' },
    { id: 'si_a_g2', name: 'The Mirror-Twin', description: 'Your reflection in a crystal wall points out a hidden switch.', rarity: Rarity.GOLD, phase: StoryPhase.ADVENTURE, icon: '🪞', worldId: 'sky-island' },
    { id: 'si_a_g3', name: 'The Sad Golem', description: 'Reattach a crying golem\'s arm, and he will smash a wall for you.', rarity: Rarity.GOLD, phase: StoryPhase.ADVENTURE, icon: '🤖', worldId: 'sky-island' },
    { id: 'si_a_g4', name: 'The Gravity-Flip Zone', description: '"Down" becomes "Up" here; navigate the ceiling to cross the pit.', rarity: Rarity.GOLD, phase: StoryPhase.ADVENTURE, icon: '🙃', worldId: 'sky-island' },
    { id: 'si_a_g5', name: 'The Lost Mail-Bird', description: 'Carry an exhausted pigeon\'s bag for a mile to earn a shortcut code.', rarity: Rarity.GOLD, phase: StoryPhase.ADVENTURE, icon: '🕊️', worldId: 'sky-island' },
    { id: 'si_a_g6', name: 'The Musical Stones', description: 'Tap glowing rocks to play a specific tune and open a secret passage.', rarity: Rarity.GOLD, phase: StoryPhase.ADVENTURE, icon: '🎵', worldId: 'sky-island' },
    { id: 'si_a_g7', name: 'The Painter Squid', description: 'A floating squid sprays ink to reveal invisible platforms you can cross.', rarity: Rarity.GOLD, phase: StoryPhase.ADVENTURE, icon: '🦑', worldId: 'sky-island' },
    { id: 'si_a_g8', name: 'The Argumentative Signposts', description: 'Use logic to determine which of the two yelling signposts is lying.', rarity: Rarity.GOLD, phase: StoryPhase.ADVENTURE, icon: '🪧', worldId: 'sky-island' },
    { id: 'si_a_g9', name: 'The Solar-Powered Door', description: 'Reflect sunlight onto a sensor to open a heavy, sealed door.', rarity: Rarity.GOLD, phase: StoryPhase.ADVENTURE, icon: '☀️', worldId: 'sky-island' },
    { id: 'si_a_g10', name: 'The Trapped Wind-Spirit', description: 'Release a jarred tornado to ride a powerful updraft up a cliff.', rarity: Rarity.GOLD, phase: StoryPhase.ADVENTURE, icon: '🌪️', worldId: 'sky-island' },
    { id: 'si_a_g11', name: 'The Clockwork Spider', description: 'Oil the rusty joints of a mechanical spider so it weaves a bridge.', rarity: Rarity.GOLD, phase: StoryPhase.ADVENTURE, icon: '🕷️', worldId: 'sky-island' },
    { id: 'si_a_g12', name: 'The Library of Leaves', description: 'Read the leaf-pages of a tree to learn the Core Guardian\'s weakness.', rarity: Rarity.GOLD, phase: StoryPhase.ADVENTURE, icon: '🍂', worldId: 'sky-island' },
    { id: 'si_a_g13', name: 'The Shadow-Tag Game', description: 'Win a game of tag against a shadow creature to gain a shield.', rarity: Rarity.GOLD, phase: StoryPhase.ADVENTURE, icon: '🏃', worldId: 'sky-island' },
    { id: 'si_a_g14', name: 'The Chef Bear', description: 'A cooking bear offers soup that grants permanent Fire Resistance.', rarity: Rarity.GOLD, phase: StoryPhase.ADVENTURE, icon: '🐻', worldId: 'sky-island' },
    
    // -- Preserved Hero Unlocks (Adventure Gold) --
    { id: 'unlock_bop', name: 'Meet Bop', description: 'A huge treat attracts a giant, purple furry friend.', rarity: Rarity.GOLD, phase: StoryPhase.ADVENTURE, icon: 'https://i.postimg.cc/hhFG24k7/jimeng-2026-01-09-5331-3D-stylized-rendering-pixar-style-anima.png', unlocksHeroId: 'bop', worldId: 'sky-island' },
    { id: 'unlock_arcade', name: 'Found Arcade', description: 'You find a retro robot with a TV head that beeps hello.', rarity: Rarity.GOLD, phase: StoryPhase.ADVENTURE, icon: 'https://i.postimg.cc/4yccf0ZF/jimeng-2026-01-09-1300-3D-stylized-rendering-pixar-style-anima.png', unlocksHeroId: 'arcade', worldId: 'sky-island' },
    { id: 'unlock_sprout', name: 'Sprout\'s Seed', description: 'A green elf with a mushroom hat waves at you.', rarity: Rarity.GOLD, phase: StoryPhase.ADVENTURE, icon: 'https://i.postimg.cc/mgLPJkzW/jimeng-2026-01-09-7871.png', unlocksHeroId: 'sprout', worldId: 'sky-island' },
    { id: 'unlock_gloop', name: 'Gloop\'s Puddle', description: 'A friendly green slime person bubbles up from the ground.', rarity: Rarity.GOLD, phase: StoryPhase.ADVENTURE, icon: 'https://i.postimg.cc/W114SyCL/jimeng-2026-01-09-7183-3D-stylized-rendering-pixar-style-anima.png', unlocksHeroId: 'gloop', worldId: 'sky-island' },

    // Adventure - Platinum (Legendary: Magical Breakthroughs & Secrets)
    { id: 'si_a_p1', name: 'The Star-Whale Ride', description: 'Grab the fin of a cosmic whale to skip the jungle danger entirely.', rarity: Rarity.PLATINUM, phase: StoryPhase.ADVENTURE, icon: '🐋', worldId: 'sky-island' },
    { id: 'si_a_p2', name: 'The Ancient Rail-System', description: 'A pristine minecart track zooms you straight toward the Core.', rarity: Rarity.PLATINUM, phase: StoryPhase.ADVENTURE, icon: '🎢', worldId: 'sky-island' },
    { id: 'si_a_p3', name: 'The Guardian’s Bow', description: 'A statue bows and hands you a key to skip the next boss puzzle.', rarity: Rarity.PLATINUM, phase: StoryPhase.ADVENTURE, icon: '🏹', worldId: 'sky-island' },
    { id: 'si_a_p4', name: 'The Time-Slip', description: 'Step into a time bubble to safely cross a bridge currently broken.', rarity: Rarity.PLATINUM, phase: StoryPhase.ADVENTURE, icon: '🕰️', worldId: 'sky-island' },
    { id: 'si_a_p5', name: 'The Beast-Tamer Moment', description: 'Remove a thorn from a Sky-Lion\'s paw to gain a powerful mount.', rarity: Rarity.PLATINUM, phase: StoryPhase.ADVENTURE, icon: '🦁', worldId: 'sky-island' },
    { id: 'si_a_p6', name: 'The Secret Lab', description: 'Find an ancient lab with a device that makes the ending easier.', rarity: Rarity.PLATINUM, phase: StoryPhase.ADVENTURE, icon: '🧪', worldId: 'sky-island' },
    { id: 'si_a_p7', name: 'The Cloud-Walker Potion', description: 'Drink a blue vial to walk on air and bypass all terrain obstacles.', rarity: Rarity.PLATINUM, phase: StoryPhase.ADVENTURE, icon: '🧉', worldId: 'sky-island' },
    { id: 'si_a_p8', name: 'The King of Birds', description: 'The King Eagle commands all birds to help you, the "Chosen One."', rarity: Rarity.PLATINUM, phase: StoryPhase.ADVENTURE, icon: '🦅', worldId: 'sky-island' },
    { id: 'si_a_p9', name: 'The Reality Glitch', description: 'Edit the universe\'s code to delete a wall and walk through.', rarity: Rarity.PLATINUM, phase: StoryPhase.ADVENTURE, icon: '👾', worldId: 'sky-island' },
    { id: 'si_a_p10', name: 'The Elemental Form', description: 'Briefly turn into electricity to zip through hazards unharmed.', rarity: Rarity.PLATINUM, phase: StoryPhase.ADVENTURE, icon: '⚡', worldId: 'sky-island' },
    { id: 'si_a_p11', name: 'The Lost City of Gold', description: 'A hidden cloud city heals you and gifts legendary armor.', rarity: Rarity.PLATINUM, phase: StoryPhase.ADVENTURE, icon: '🏙️', worldId: 'sky-island' },
    { id: 'si_a_p12', name: 'The Teleporter Accident', description: 'Touch a rune to warp past danger straight to the Climax.', rarity: Rarity.PLATINUM, phase: StoryPhase.ADVENTURE, icon: '💥', worldId: 'sky-island' },
    { id: 'si_a_p13', name: 'The Meteor Shower', description: 'A meteor crash kills blocking monsters and leaves loot behind.', rarity: Rarity.PLATINUM, phase: StoryPhase.ADVENTURE, icon: '☄️', worldId: 'sky-island' },
    { id: 'si_a_p14', name: 'The Wish-Granter Frog', description: 'The fancy frog snaps his fingers, instantly clearing the stormy weather.', rarity: Rarity.PLATINUM, phase: StoryPhase.ADVENTURE, icon: '🐸', worldId: 'sky-island' },
    { id: 'si_a_p15', name: 'The Dragon\'s Truce', description: 'A dragon shares wisdom instead of eating you, maxing your intelligence.', rarity: Rarity.PLATINUM, phase: StoryPhase.ADVENTURE, icon: '🤝', worldId: 'sky-island' },

    // === CLIMAX (PHASE 3) - SKY ISLAND ===

    // Climax - Silver (Common: The Big Showdown)
    { id: 'si_c_s1', name: 'The Storm Vortex', description: 'Crawl through swirling hurricane winds to reach the shut-off switch.', rarity: Rarity.SILVER, phase: StoryPhase.CLIMAX, icon: '🌪️', worldId: 'sky-island' },
    { id: 'si_c_s2', name: 'The Stone Guardian', description: 'Defeat the massive blocking statue in a game of "Rock, Paper, Scissors."', rarity: Rarity.SILVER, phase: StoryPhase.CLIMAX, icon: '🗿', worldId: 'sky-island' },
    { id: 'si_c_s3', name: 'The Crumbling Bridge', description: 'Sprint across floating debris before it falls into the sky below.', rarity: Rarity.SILVER, phase: StoryPhase.CLIMAX, icon: '🌉', worldId: 'sky-island' },
    { id: 'si_c_s4', name: 'The Overheating Crystal', description: 'Cool down the glowing red-hot crystal with buckets of water.', rarity: Rarity.SILVER, phase: StoryPhase.CLIMAX, icon: '🔴', worldId: 'sky-island' },
    { id: 'si_c_s5', name: 'The Shadow Swarm', description: 'Repel tiny shadow-bats with your flashlight to move forward.', rarity: Rarity.SILVER, phase: StoryPhase.CLIMAX, icon: '🦇', worldId: 'sky-island' },
    { id: 'si_c_s6', name: 'The Floor is Lava', description: 'Parkour across furniture to avoid the leaking orange goo.', rarity: Rarity.SILVER, phase: StoryPhase.CLIMAX, icon: '🌋', worldId: 'sky-island' },
    { id: 'si_c_s7', name: 'The Tangled Roots', description: 'Cut the thorny vines strangling the heart without getting pricked.', rarity: Rarity.SILVER, phase: StoryPhase.CLIMAX, icon: '🥀', worldId: 'sky-island' },
    { id: 'si_c_s8', name: 'The Dizzy Spin', description: 'Walk on walls to reach the objective as gravity spins wildly.', rarity: Rarity.SILVER, phase: StoryPhase.CLIMAX, icon: '😵', worldId: 'sky-island' },
    { id: 'si_c_s9', name: 'The Laser Grid', description: 'Dodge and weave like a spy through ancient security beams.', rarity: Rarity.SILVER, phase: StoryPhase.CLIMAX, icon: '🥅', worldId: 'sky-island' },
    { id: 'si_c_s10', name: 'The Sleeping Dragon', description: 'Sneak past the mother dragon sleeping atop the Core.', rarity: Rarity.SILVER, phase: StoryPhase.CLIMAX, icon: '💤', worldId: 'sky-island' },
    { id: 'si_c_s11', name: 'The Loud Alarm', description: 'Solve a color-matching puzzle to silence the deafening siren.', rarity: Rarity.SILVER, phase: StoryPhase.CLIMAX, icon: '🚨', worldId: 'sky-island' },
    { id: 'si_c_s12', name: 'The Slippery Slope', description: 'Climb a vertical slide while dodging rolling boulders.', rarity: Rarity.SILVER, phase: StoryPhase.CLIMAX, icon: '⛰️', worldId: 'sky-island' },
    { id: 'si_c_s13', name: 'The Mirror Maze', description: 'Smash the correct glass in the mirror hall to escape.', rarity: Rarity.SILVER, phase: StoryPhase.CLIMAX, icon: '🪞', worldId: 'sky-island' },
    { id: 'si_c_s14', name: 'The Rising Tide', description: 'Climb the central pillar before liquid cloud fills the room.', rarity: Rarity.SILVER, phase: StoryPhase.CLIMAX, icon: '🌊', worldId: 'sky-island' },
    { id: 'si_c_s15', name: 'The Rusty Lever', description: 'Use all your strength to pull the stuck machine lever.', rarity: Rarity.SILVER, phase: StoryPhase.CLIMAX, icon: '🕹️', worldId: 'sky-island' },

    // Climax - Gold (Rare: The Clever Twist)
    { id: 'si_c_g1', name: 'The Crying Core', description: 'Comfort the lonely, crying energy ball instead of fighting it.', rarity: Rarity.GOLD, phase: StoryPhase.CLIMAX, icon: '😢', worldId: 'sky-island' },
    { id: 'si_c_g2', name: 'The Rhythm Battle', description: 'Win a dance-off by matching the pulsing island heart\'s beat.', rarity: Rarity.GOLD, phase: StoryPhase.CLIMAX, icon: '💃', worldId: 'sky-island' },
    { id: 'si_c_g3', name: 'The Doppelganger', description: 'Tell a secret only you know to expose the imposter.', rarity: Rarity.GOLD, phase: StoryPhase.CLIMAX, icon: '👯', worldId: 'sky-island' },
    { id: 'si_c_g4', name: 'The Riddle Sphinx', description: 'Answer three riddles from a giant cloud-cat to pass.', rarity: Rarity.GOLD, phase: StoryPhase.CLIMAX, icon: '🦁', worldId: 'sky-island' },
    { id: 'si_c_g5', name: 'The Gravity Switch', description: 'Flip the room upside down to drop the boss into a trap.', rarity: Rarity.GOLD, phase: StoryPhase.CLIMAX, icon: '🙃', worldId: 'sky-island' },
    { id: 'si_c_g6', name: 'The Traitor’s Redemption', description: 'The monkey thief regrets stealing the key and tosses it back.', rarity: Rarity.GOLD, phase: StoryPhase.CLIMAX, icon: '🐒', worldId: 'sky-island' },
    { id: 'si_c_g7', name: 'The Simon Says Lock', description: 'Repeat the flashing light pattern perfectly to open the door.', rarity: Rarity.GOLD, phase: StoryPhase.CLIMAX, icon: '🚦', worldId: 'sky-island' },
    { id: 'si_c_g8', name: 'The Shrinking Room', description: 'Poke the structural weak point to stop the closing walls.', rarity: Rarity.GOLD, phase: StoryPhase.CLIMAX, icon: '📦', worldId: 'sky-island' },
    { id: 'si_c_g9', name: 'The Giant\'s Toothache', description: 'Pull the thorn from the roaring Giant\'s foot to end the fight.', rarity: Rarity.GOLD, phase: StoryPhase.CLIMAX, icon: '🦷', worldId: 'sky-island' },
    { id: 'si_c_g10', name: 'The Two Buttons', description: 'Decode mirror language to choose between the "STOP" and "GO" buttons.', rarity: Rarity.GOLD, phase: StoryPhase.CLIMAX, icon: '🔘', worldId: 'sky-island' },
    { id: 'si_c_g11', name: 'The Friendly Fire', description: 'Sneak past two guardians while they distract each other with an argument.', rarity: Rarity.GOLD, phase: StoryPhase.CLIMAX, icon: '⚔️', worldId: 'sky-island' },
    { id: 'si_c_g12', name: 'The Echo Chamber', description: 'Shout your "Hero Name" to shatter the Core\'s glass casing.', rarity: Rarity.GOLD, phase: StoryPhase.CLIMAX, icon: '🗣️', worldId: 'sky-island' },
    { id: 'si_c_g13', name: 'The Magnetic Boots', description: 'Fight the boss upside-down using magnetic tracks on the ceiling.', rarity: Rarity.GOLD, phase: StoryPhase.CLIMAX, icon: '🧲', worldId: 'sky-island' },
    { id: 'si_c_g14', name: 'The Time Limit', description: 'Find the hidden "Pause" button before the 60-second timer ends.', rarity: Rarity.GOLD, phase: StoryPhase.CLIMAX, icon: '⏱️', worldId: 'sky-island' },
    { id: 'si_c_g15', name: 'The Chef Showdown', description: 'Cook a meal using gathered ingredients to feed the hungry Guardian.', rarity: Rarity.GOLD, phase: StoryPhase.CLIMAX, icon: '🍳', worldId: 'sky-island' },

    // Climax - Platinum (Legendary: The Epic Moment) + UNLOCKABLE HEROES (Preserved)
    { id: 'si_c_p1', name: 'The Awakening', description: 'The Island wakes up, gently lifting you to the Core to fix it.', rarity: Rarity.PLATINUM, phase: StoryPhase.CLIMAX, icon: '🌅', worldId: 'sky-island' },
    { id: 'si_c_p2', name: 'The Sky-Whale Return', description: 'Ride the returning Sky-Whale through the ceiling into the storm.', rarity: Rarity.PLATINUM, phase: StoryPhase.CLIMAX, icon: '🐋', worldId: 'sky-island' },
    { id: 'si_c_p3', name: 'The Harmony Song', description: 'Play a melody to make the dangerous Core glow in harmony.', rarity: Rarity.PLATINUM, phase: StoryPhase.CLIMAX, icon: '🎶', worldId: 'sky-island' },
    { id: 'si_c_p4', name: 'The Ancient Mech', description: 'Pilot a giant robot suit to scare the boss away.', rarity: Rarity.PLATINUM, phase: StoryPhase.CLIMAX, icon: '🤖', worldId: 'sky-island' },
    { id: 'si_c_p5', name: 'The Supernova Mode', description: 'Turn into a being of pure light and fly freely.', rarity: Rarity.PLATINUM, phase: StoryPhase.CLIMAX, icon: '🌟', worldId: 'sky-island' },
    { id: 'si_c_p6', name: 'The Master Code', description: 'Type "DELETE BOSS" on a keyboard to erase the enemy.', rarity: Rarity.PLATINUM, phase: StoryPhase.CLIMAX, icon: '💻', worldId: 'sky-island' },
    { id: 'si_c_p7', name: 'The Dragon Rider', description: 'Mount the bowing dragon and weld the Core\'s cracks with fire.', rarity: Rarity.PLATINUM, phase: StoryPhase.CLIMAX, icon: '🐉', worldId: 'sky-island' },
    { id: 'si_c_p8', name: 'The Time Rewind', description: 'Rewind time after the explosion to catch the falling piece.', rarity: Rarity.PLATINUM, phase: StoryPhase.CLIMAX, icon: '⏪', worldId: 'sky-island' },
    { id: 'si_c_p9', name: 'The Army of Friends', description: 'Every NPC you helped arrives to fight the bad guy.', rarity: Rarity.PLATINUM, phase: StoryPhase.CLIMAX, icon: '🤝', worldId: 'sky-island' },
    { id: 'si_c_p10', name: 'The Zero-Gravity Bubble', description: 'Float effortlessly to the switch while enemies stumble in zero-G.', rarity: Rarity.PLATINUM, phase: StoryPhase.CLIMAX, icon: '🫧', worldId: 'sky-island' },
    { id: 'si_c_p11', name: 'The Telepathic Link', description: 'Share memories with the Guardian to make them cry and yield.', rarity: Rarity.PLATINUM, phase: StoryPhase.CLIMAX, icon: '🧠', worldId: 'sky-island' },
    { id: 'si_c_p12', name: 'The Phoenix Rebirth', description: 'Your Phoenix feather burns, healing you and scaring away darkness.', rarity: Rarity.PLATINUM, phase: StoryPhase.CLIMAX, icon: '🦅', worldId: 'sky-island' },
    { id: 'si_c_p13', name: 'The Universal Key', description: 'Unlock all 100 doors simultaneously with the Platinum Key.', rarity: Rarity.PLATINUM, phase: StoryPhase.CLIMAX, icon: '🗝️', worldId: 'sky-island' },
    { id: 'si_c_p14', name: 'The Reality Paint', description: 'Paint a "Happy Face" on the angry Core to make it happy.', rarity: Rarity.PLATINUM, phase: StoryPhase.CLIMAX, icon: '🎨', worldId: 'sky-island' },
    { id: 'si_c_p15', name: 'The Starfall', description: 'Summon a shooting star to crash precisely on the villain\'s head.', rarity: Rarity.PLATINUM, phase: StoryPhase.CLIMAX, icon: '🌠', worldId: 'sky-island' },

    // -- Preserved Hero Unlocks (Climax Platinum) --
    { id: 'unlock_jet', name: 'Jet\'s Boots', description: 'A fast racer with silver hair zooms past you.', rarity: Rarity.PLATINUM, phase: StoryPhase.CLIMAX, icon: 'https://i.postimg.cc/DZTkpJ0G/jimeng-2026-01-09-9665-3D-stylized-rendering-pixar-style-anima.png', unlocksHeroId: 'jet', worldId: 'sky-island' },
    { id: 'unlock_vesper', name: 'Vesper\'s Signal', description: 'A mysterious ninja cat with glowing purple eyes appears.', rarity: Rarity.PLATINUM, phase: StoryPhase.CLIMAX, icon: 'https://i.postimg.cc/5yKrJ64g/jimeng-2026-01-09-6262-3D-stylized-rendering-pixar-style-anima.png', unlocksHeroId: 'vesper', worldId: 'sky-island' },
    { id: 'unlock_coral', name: 'Coral\'s Shell', description: 'A cheerful mermaid with bright turquoise hair hands you a gift.', rarity: Rarity.PLATINUM, phase: StoryPhase.CLIMAX, icon: 'https://i.postimg.cc/3NNLtYXm/jimeng-2026-01-09-5295-3D-stylized-rendering-pixar-style-anima.png', unlocksHeroId: 'coral', worldId: 'sky-island' },

    // === RESOLUTION (PHASE 4) - SKY ISLAND ===

    // Resolution - Silver (Common: Sweet Souvenirs & Safe Returns)
    { id: 'si_r_s1', name: 'The Cloud in a Jar', description: 'Catch a tiny, happy cloud in a jar to use as a nightlight.', rarity: Rarity.SILVER, phase: StoryPhase.RESOLUTION, icon: '☁️', worldId: 'sky-island' },
    { id: 'si_r_s2', name: 'The Balloon Ride', description: 'Float gently back to your bedroom window in a giant hot-air balloon.', rarity: Rarity.SILVER, phase: StoryPhase.RESOLUTION, icon: '🎈', worldId: 'sky-island' },
    { id: 'si_r_s3', name: 'The Sky-Berry Basket', description: 'Receive a basket of cotton-candy-flavored blue berries to share.', rarity: Rarity.SILVER, phase: StoryPhase.RESOLUTION, icon: '🫐', worldId: 'sky-island' },
    { id: 'si_r_s4', name: 'The Honorary Badge', description: 'The Mayor pins a wooden "Junior Sky Explorer" badge to your shirt.', rarity: Rarity.SILVER, phase: StoryPhase.RESOLUTION, icon: '📛', worldId: 'sky-island' },
    { id: 'si_r_s5', name: 'The Sunset View', description: 'Watch a beautiful purple and gold sunset before waking up in bed.', rarity: Rarity.SILVER, phase: StoryPhase.RESOLUTION, icon: '🌅', worldId: 'sky-island' },
    { id: 'si_r_s6', name: 'The Feather Pen', description: 'A giant bird gifts you a glowing feather that writes in rainbow ink.', rarity: Rarity.SILVER, phase: StoryPhase.RESOLUTION, icon: '✒️', worldId: 'sky-island' },
    { id: 'si_r_s7', name: 'The Group Photo', description: 'Receive a sketch of you and all your new friends posing together.', rarity: Rarity.SILVER, phase: StoryPhase.RESOLUTION, icon: '📸', worldId: 'sky-island' },
    { id: 'si_r_s8', name: 'The Crystal Shard', description: 'Keep a warm, humming shard of the Core crystal.', rarity: Rarity.SILVER, phase: StoryPhase.RESOLUTION, icon: '💎', worldId: 'sky-island' },
    { id: 'si_r_s9', name: 'The Flower Crown', description: 'Vines weave a crown of un-wiltable flowers for you to wear home.', rarity: Rarity.SILVER, phase: StoryPhase.RESOLUTION, icon: '💐', worldId: 'sky-island' },
    { id: 'si_r_s10', name: 'The Echo Shell', description: 'A seashell that plays the island\'s wind when held to your ear.', rarity: Rarity.SILVER, phase: StoryPhase.RESOLUTION, icon: '🐚', worldId: 'sky-island' },
    { id: 'si_r_s11', name: 'The Map of Stars', description: 'Receive a map of constellations visible only from the Floating Island.', rarity: Rarity.SILVER, phase: StoryPhase.RESOLUTION, icon: '🌌', worldId: 'sky-island' },
    { id: 'si_r_s12', name: 'The Nap on a Cloud', description: 'Sleep on a soft cloud and wake up fully rested in your own bed.', rarity: Rarity.SILVER, phase: StoryPhase.RESOLUTION, icon: '😴', worldId: 'sky-island' },
    { id: 'si_r_s13', name: 'The Friendly Wave', description: 'Every animal on the island stands on the cliff to wave goodbye.', rarity: Rarity.SILVER, phase: StoryPhase.RESOLUTION, icon: '👋', worldId: 'sky-island' },
    { id: 'si_r_s14', name: 'The Stone Marble', description: 'A glowing stone marble that changes color based on your mood.', rarity: Rarity.SILVER, phase: StoryPhase.RESOLUTION, icon: '🔮', worldId: 'sky-island' },
    { id: 'si_r_s15', name: 'The Seed', description: 'Plant this seed to grow a tiny floating flower by morning.', rarity: Rarity.SILVER, phase: StoryPhase.RESOLUTION, icon: '🌱', worldId: 'sky-island' },

    // Resolution - Gold (Rare: Special Honors & Magic Gifts)
    { id: 'si_r_g1', name: 'The Statue of You', description: 'Locals build a white marble statue of you in the town square.', rarity: Rarity.GOLD, phase: StoryPhase.RESOLUTION, icon: '🗽', worldId: 'sky-island' },
    { id: 'si_r_g2', name: 'The Pet Cloud', description: 'A dog-shaped cloud follows you home to live on your ceiling.', rarity: Rarity.GOLD, phase: StoryPhase.RESOLUTION, icon: '☁️', worldId: 'sky-island' },
    { id: 'si_r_g3', name: 'The Golden Goggles', description: 'Keep the Pilot’s goggles to see wind currents in real life.', rarity: Rarity.GOLD, phase: StoryPhase.RESOLUTION, icon: '🥽', worldId: 'sky-island' },
    { id: 'si_r_g4', name: 'The Endless Candy', description: 'A magical pouch producing one piece of sky-chocolate every morning.', rarity: Rarity.GOLD, phase: StoryPhase.RESOLUTION, icon: '🍬', worldId: 'sky-island' },
    { id: 'si_r_g5', name: 'The Fireworks Show', description: 'A massive fireworks display spells out your name in the sky.', rarity: Rarity.GOLD, phase: StoryPhase.RESOLUTION, icon: '🎆', worldId: 'sky-island' },
    { id: 'si_r_g6', name: 'The Wind-Cloak', description: 'A cape that always billows dramatically, even without wind.', rarity: Rarity.GOLD, phase: StoryPhase.RESOLUTION, icon: '🦸', worldId: 'sky-island' },
    { id: 'si_r_g7', name: 'The Key to the City', description: 'A heavy gold key that opens any lock on the island.', rarity: Rarity.GOLD, phase: StoryPhase.RESOLUTION, icon: '🔑', worldId: 'sky-island' },
    { id: 'si_r_g8', name: 'The Secret Shortcut', description: 'A permanent rope ladder hangs from the sky into your backyard.', rarity: Rarity.GOLD, phase: StoryPhase.RESOLUTION, icon: '🪜', worldId: 'sky-island' },
    { id: 'si_r_g9', name: 'The Bard\'s Song', description: 'Hear the wind hum a song written about your bravery.', rarity: Rarity.GOLD, phase: StoryPhase.RESOLUTION, icon: '🎵', worldId: 'sky-island' },
    { id: 'si_r_g10', name: 'The Telescope Upgrade', description: 'Modified telescope reveals islanders waving when you look at the moon.', rarity: Rarity.GOLD, phase: StoryPhase.RESOLUTION, icon: '🔭', worldId: 'sky-island' },
    { id: 'si_r_g11', name: 'The Gravity Boots', description: 'Keep the anti-gravity boots to jump super high in your backyard.', rarity: Rarity.GOLD, phase: StoryPhase.RESOLUTION, icon: '👢', worldId: 'sky-island' },
    { id: 'si_r_g12', name: 'The Message in the Sky', description: 'Clouds rearrange to form a giant "THANK YOU" over your house.', rarity: Rarity.GOLD, phase: StoryPhase.RESOLUTION, icon: '☁️', worldId: 'sky-island' },
    { id: 'si_r_g13', name: 'The Talking Plant', description: 'A potted plant that tells bad puns when you water it.', rarity: Rarity.GOLD, phase: StoryPhase.RESOLUTION, icon: '🪴', worldId: 'sky-island' },
    { id: 'si_r_g14', name: 'The Treasure Chest', description: 'A small chest filled with gold-wrapped chocolate coins.', rarity: Rarity.GOLD, phase: StoryPhase.RESOLUTION, icon: '💰', worldId: 'sky-island' },
    { id: 'si_r_g15', name: 'The Constellation', description: 'The Sky-Whale rearranges the stars to look exactly like your face.', rarity: Rarity.GOLD, phase: StoryPhase.RESOLUTION, icon: '✨', worldId: 'sky-island' },

    // Resolution - Platinum (Legendary: Life-Changing Magic)
    { id: 'si_r_p1', name: 'The Island Owner', description: 'The Mayor retires and hands you the deed to the Floating Island.', rarity: Rarity.PLATINUM, phase: StoryPhase.RESOLUTION, icon: '📜', worldId: 'sky-island' },
    { id: 'si_r_p2', name: 'The Dragon Egg', description: 'A dragon egg hatches on your bed, giving you a baby dragon.', rarity: Rarity.PLATINUM, phase: StoryPhase.RESOLUTION, icon: '🥚', worldId: 'sky-island' },
    { id: 'si_r_p3', name: 'The Portal Door', description: 'A magic closet door that opens directly onto the island.', rarity: Rarity.PLATINUM, phase: StoryPhase.RESOLUTION, icon: '🚪', worldId: 'sky-island' },
    { id: 'si_r_p4', name: 'The Wings', description: 'Drink a potion to gain shimmering wings and fly for real.', rarity: Rarity.PLATINUM, phase: StoryPhase.RESOLUTION, icon: '🧚', worldId: 'sky-island' },
    { id: 'si_r_p5', name: 'The Star-Wand', description: 'A wand tipped with a real star that lights rooms and levitates objects.', rarity: Rarity.PLATINUM, phase: StoryPhase.RESOLUTION, icon: '🪄', worldId: 'sky-island' },
    { id: 'si_r_p6', name: 'The Guardian Spirit', description: 'A tiny invisible spirit bonds with you to prevent nightmares.', rarity: Rarity.PLATINUM, phase: StoryPhase.RESOLUTION, icon: '👻', worldId: 'sky-island' },
    { id: 'si_r_p7', name: 'The Wish', description: 'Wish for "Adventure" to instantly reveal a new world on the map.', rarity: Rarity.PLATINUM, phase: StoryPhase.RESOLUTION, icon: '🧞', worldId: 'sky-island' },
    { id: 'si_r_p8', name: 'The Time-Freeze', description: 'Step into this magic photo anytime to relive the celebration.', rarity: Rarity.PLATINUM, phase: StoryPhase.RESOLUTION, icon: '🖼️', worldId: 'sky-island' },
    { id: 'si_r_p9', name: 'The Sky-Ship', description: 'Fly home in your own airship, now parked on your roof.', rarity: Rarity.PLATINUM, phase: StoryPhase.RESOLUTION, icon: '⛵', worldId: 'sky-island' },
    { id: 'si_r_p10', name: 'The Language of All', description: 'Permanently understand what your pets are saying at home.', rarity: Rarity.PLATINUM, phase: StoryPhase.RESOLUTION, icon: '🗣️', worldId: 'sky-island' },
    { id: 'si_r_p11', name: 'The Moon-Rock', description: 'A piece of the moon that makes your room\'s contents float.', rarity: Rarity.PLATINUM, phase: StoryPhase.RESOLUTION, icon: '🌑', worldId: 'sky-island' },
    { id: 'si_r_p12', name: 'The Phoenix Feather', description: 'A feather that instantly heals any scratch or injury.', rarity: Rarity.PLATINUM, phase: StoryPhase.RESOLUTION, icon: '🪶', worldId: 'sky-island' },
    { id: 'si_r_p13', name: 'The Cloud Castle', description: 'Islanders build a solid cloud castle directly above your house.', rarity: Rarity.PLATINUM, phase: StoryPhase.RESOLUTION, icon: '🏰', worldId: 'sky-island' },
    { id: 'si_r_p14', name: 'The Invisibility Ring', description: 'Keep the ring from the Core to turn invisible whenever you want.', rarity: Rarity.PLATINUM, phase: StoryPhase.RESOLUTION, icon: '💍', worldId: 'sky-island' },
    { id: 'si_r_p15', name: 'The Legend', description: 'Stars rearrange to tell your story for the next 100 years.', rarity: Rarity.PLATINUM, phase: StoryPhase.RESOLUTION, icon: '📖', worldId: 'sky-island' },
];

export const getCardsForPhase = (phase: StoryPhase, rarity: Rarity | null, count: number, worldId: string = 'sky-island'): CardData[] => {
    // 1. Get all cards that match the phase STRICTLY and the worldId
    let pool = ALL_CARDS.filter(c => c.phase === phase && (c.worldId === worldId || !c.worldId));
    
    // 2. Filter by rarity if specified
    if (rarity) {
        pool = pool.filter(c => c.rarity === rarity);
    }
    
    // 3. Shuffle and return
    return pool.sort(() => 0.5 - Math.random()).slice(0, count);
};
