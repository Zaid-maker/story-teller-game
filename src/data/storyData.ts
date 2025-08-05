import { Story } from "@/types/story";

export const storyData: Story = {
  "start": {
    id: "start",
    text: "You stand at a crossroads in a dense, ancient forest. Sunlight filters through the thick canopy, dappling the mossy ground. To your left, a path winds into shadow, from which you hear a faint, enchanting melody. To your right, the path is bathed in a soft, shimmering light.",
    choices: [
      { text: "Follow the melody (Left Path)", nextSceneId: "melodyPath" },
      { text: "Investigate the light (Right Path)", nextSceneId: "lightPath" },
    ],
  },
  "melodyPath": {
    id: "melodyPath",
    text: "The melody grows stronger as you venture down the left path, its notes weaving through the trees like a silver thread. You arrive in a hidden glade where a graceful dryad plays a lute carved from pearwood. She looks up, her eyes the color of new spring leaves.",
    choices: [
      { text: "Approach the dryad openly", nextSceneId: "approachCreature" },
      { text: "Hide and observe from a distance", nextSceneId: "hideAndObserve" },
    ],
  },
  "lightPath": {
    id: "lightPath",
    text: "You follow the shimmering light, which leads you to a perfectly still, crystal-clear lake. In the center, a glowing orb of pure light floats just above the water, pulsing gently.",
    choices: [
      { text: "Wade into the lake to reach the orb", nextSceneId: "reachOrb" },
      { text: "Search for a path around the lake", nextSceneId: "aroundLake" },
    ],
  },
  "approachCreature": {
    id: "approachCreature",
    text: "The dryad smiles. 'Welcome, traveler. It's rare to have visitors. I am Lyra, guardian of this glade. But I sense a shadow creeping into the heart of my woods. Will you help me?'",
    choices: [
      { text: "Agree to help her", nextSceneId: "dryadQuest" },
      { text: "Politely decline", nextSceneId: "declineQuest" },
    ],
  },
  "hideAndObserve": {
    id: "hideAndObserve",
    text: "You watch from behind a large oak as the dryad finishes her song. She sighs, a sound like rustling leaves, and whispers to the trees, 'The blight spreads...' She then fades into the forest, leaving you alone in the now-silent glade.",
    choices: [
      { text: "Explore the glade", nextSceneId: "exploreGlade" },
      { text: "Return to the crossroads", nextSceneId: "start" },
    ],
  },
  "reachOrb": {
    id: "reachOrb",
    text: "As you step into the cool water, the orb descends into your hands. A warm, pure energy flows through you, and a vision fills your mind: a creeping darkness seeping from a deep gorge, withering the forest around it.",
    choices: [
      { text: "Seek out the gorge from your vision", nextSceneId: "seekGorge" },
      { text: "Keep the power and return to your path", nextSceneId: "keepPower" },
    ],
    gives: "orb",
  },
  "aroundLake": {
    id: "aroundLake",
    text: "You find a narrow path around the lake's edge, leading to a cave hidden behind a curtain of water from a small waterfall. The air here is cool and smells of damp earth and old magic.",
    choices: [
      { text: "Enter the cave", nextSceneId: "enterCave" },
      { text: "Return to the crossroads", nextSceneId: "start" },
    ],
  },
  "dryadQuest": {
    id: "dryadQuest",
    text: "'Thank you,' Lyra says, her voice filled with relief. 'I need you to gather three Moonpetal flowers from the Sunken Grove. Their light can push back the darkness. She hands you a small, woven charm. 'This will guide you. Be wary of the path.'",
    choices: [
      { text: "Follow the charm's guidance", nextSceneId: "sunkenGrove" },
    ],
    score: 25,
  },
  "declineQuest": {
    id: "declineQuest",
    text: "The dryad's smile fades. 'I understand. The forest must fend for itself, then.' She turns away, and the glade suddenly feels colder. You sense you've missed an opportunity.",
    choices: [
      { text: "Leave the glade", nextSceneId: "endGame" },
    ],
  },
  "exploreGlade": {
    id: "exploreGlade",
    text: "You find a small, forgotten shrine covered in moss. At its base lies a single, perfectly preserved flower that glows with a soft, silver light.",
    choices: [
      { text: "Take the flower", nextSceneId: "takeFlower" },
      { text: "Leave it be", nextSceneId: "leaveFlower" },
    ],
  },
  "seekGorge": {
    id: "seekGorge",
    text: "With the vision burned into your mind, you feel a pull towards the north. The power of the orb guides your steps, leading you through tangled woods towards the source of the corruption.",
    choices: [
      { text: "Press on to the gorge", nextSceneId: "shadowyGorge" },
    ],
    score: 50,
  },
  "keepPower": {
    id: "keepPower",
    text: "You decide the vision is not your concern. The orb's power feels incredible, a treasure you won't risk. You feel stronger, but a sense of unease lingers.",
    choices: [
      { text: "Your adventure ends for now", nextSceneId: "endGame" },
    ],
    score: 100,
  },
  "enterCave": {
    id: "enterCave",
    text: "Inside the cave, ancient carvings cover the walls. They depict a prophecy: 'When the shadow rises, a hero guided by light or nature will restore the balance.'",
    choices: [
      { text: "Heed the prophecy and seek the shadow", nextSceneId: "seekGorge" },
      { text: "Ignore the prophecy", nextSceneId: "endGame" },
    ],
    score: 75,
  },
  "sunkenGrove": {
    id: "sunkenGrove",
    text: "The charm leads you to a lush, misty grove where glowing Moonpetals grow. As you reach for them, a shadowy tendril whips out from the ground!",
    choices: [
      { text: "Dodge and grab the flowers", nextSceneId: "getFlowers" },
      { text: "Use the dryad's charm for protection", nextSceneId: "useCharm" },
    ],
  },
  "takeFlower": {
    id: "takeFlower",
    text: "As you pluck the glowing flower, it infuses you with a gentle, protective energy. You feel prepared for a hidden danger.",
    choices: [
      { text: "Continue your journey", nextSceneId: "seekGorge" },
    ],
    score: 50,
    gives: "glowing_flower",
  },
  "leaveFlower": {
    id: "leaveFlower",
    text: "You decide to leave the shrine untouched. It feels like the right thing to do. You leave the glade with a sense of peace.",
    choices: [
      { text: "Your adventure ends here", nextSceneId: "endGame" },
    ],
    score: 25,
  },
  "getFlowers": {
    id: "getFlowers",
    text: "You narrowly dodge the shadow and snatch the flowers. You have what you came for, but you are shaken. You return to the dryad, who thanks you profusely before directing you to the source of the corruption.",
    choices: [
      { text: "Go to the shadowy gorge", nextSceneId: "shadowyGorge" },
    ],
    score: 100,
    gives: "flowers",
  },
  "useCharm": {
    id: "useCharm",
    text: "You hold up the charm, which flares with light, repelling the shadow. You gather the flowers unharmed and return to the dryad. Impressed, she enchants the flowers for you and points you toward the gorge.",
    choices: [
      { text: "Go to the shadowy gorge", nextSceneId: "shadowyGorge" },
    ],
    score: 150,
    gives: "enchanted_flowers",
  },
  "shadowyGorge": {
    id: "shadowyGorge",
    text: "You arrive at a deep gorge where the light does not reach. The trees are twisted and black, and the air is heavy with despair. At the center of the corruption is a pulsating mass of shadow.",
    choices: [
      { text: "Confront the shadow", nextSceneId: "confrontShadow" },
      { text: "This is too dangerous. Flee!", nextSceneId: "fleeGorge" },
    ],
  },
  "confrontShadow": {
    id: "confrontShadow",
    text: "You step forward to face the darkness. How will you fight it?",
    choices: [
      { text: "Unleash the orb's light", nextSceneId: "victory", requires: "orb" },
      { text: "Use the dryad's enchanted flowers", nextSceneId: "victory", requires: "enchanted_flowers" },
      { text: "Use the Moonpetal flowers", nextSceneId: "victory", requires: "flowers" },
      { text: "Use the glowing shrine flower", nextSceneId: "victory", requires: "glowing_flower" },
      { text: "Face it with your own courage", nextSceneId: "courageEnding" },
    ],
  },
  "fleeGorge": {
    id: "fleeGorge",
    text: "You turn and run, the feeling of failure heavy on your shoulders. The forest may be doomed, but you are safe. For now.",
    choices: [
      { text: "Your adventure ends in retreat", nextSceneId: "endGame" },
    ],
    score: -50,
  },
  "victory": {
    id: "victory",
    text: "You unleash the sacred light! The shadow shrieks and dissolves, and sunlight pours back into the gorge. You have saved the forest! As you stand victorious, you feel a profound connection to this ancient place.",
    choices: [
      { text: "A hero's work is done. Play again?", nextSceneId: "start" },
    ],
    score: 250,
  },
  "courageEnding": {
    id: "courageEnding",
    text: "You charge forward with nothing but your will. The shadow engulfs you, and your courage is not enough. The forest falls to darkness. (Some paths require more than just bravery).",
    choices: [
      { text: "Try a different path? Play again?", nextSceneId: "start" },
    ],
    score: -100,
  },
  "endGame": {
    id: "endGame",
    text: "Your journey through this part of the forest concludes. You carry new experiences with you. What will your next adventure be?",
    choices: [
      { text: "Play again", nextSceneId: "start" },
    ],
  },
};