import { Story } from "@/types/story";

export const storyData: Story = {
  "start": {
    id: "start",
    text: "You find yourself at a crossroads in a dense forest. The path ahead is overgrown, but you hear a faint melody from the left and see a shimmering light to the right.",
    choices: [
      { text: "Follow the melody (Left Path)", nextSceneId: "melodyPath" },
      { text: "Investigate the light (Right Path)", nextSceneId: "lightPath" },
    ],
  },
  "melodyPath": {
    id: "melodyPath",
    text: "You follow the enchanting melody deeper into the forest. Soon, you come across a hidden glade where a mystical creature is playing a lute. It looks up, startled.",
    choices: [
      { text: "Approach cautiously", nextSceneId: "approachCreature" },
      { text: "Hide and observe", nextSceneId: "hideAndObserve" },
    ],
  },
  "lightPath": {
    id: "lightPath",
    text: "You walk towards the shimmering light, which leads you to a crystal-clear lake. In the center, a glowing orb floats just above the water.",
    choices: [
      { text: "Try to reach the orb", nextSceneId: "reachOrb" },
      { text: "Look for a way around the lake", nextSceneId: "aroundLake" },
    ],
  },
  "approachCreature": {
    id: "approachCreature",
    text: "The creature, a graceful dryad, smiles warmly. 'Welcome, traveler. What brings you to my glade?'",
    choices: [
      { text: "Ask about the forest", nextSceneId: "askForest" },
      { text: "Ask for a song", nextSceneId: "askSong" },
    ],
  },
  "hideAndObserve": {
    id: "hideAndObserve",
    text: "You hide behind a large oak tree and watch the dryad. After a while, it finishes its song and disappears into the trees. You are left alone.",
    choices: [
      { text: "Return to the crossroads", nextSceneId: "start" },
      { text: "Explore deeper into the glade", nextSceneId: "gladeEnd" },
    ],
  },
  "reachOrb": {
    id: "reachOrb",
    text: "As you step into the lake, the water glows brighter, and the orb descends into your hands. A surge of energy flows through you. You feel empowered!",
    choices: [
      { text: "Feel the power", nextSceneId: "powerEnd" },
      { text: "Return to the crossroads", nextSceneId: "start" },
    ],
  },
  "aroundLake": {
    id: "aroundLake",
    text: "You walk around the lake, finding a small cave hidden behind a waterfall. Inside, you see ancient carvings on the walls.",
    choices: [
      { text: "Enter the cave", nextSceneId: "caveEnd" },
      { text: "Return to the crossroads", nextSceneId: "start" },
    ],
  },
  "askForest": {
    id: "askForest",
    text: "The dryad tells you tales of the ancient forest, its secrets, and its guardians. You learn much about the magical world around you.",
    choices: [
      { text: "Thank the dryad and continue your journey", nextSceneId: "endGame" },
    ],
    score: 100,
  },
  "askSong": {
    id: "askSong",
    text: "The dryad plays a beautiful, haunting melody that fills you with peace and wonder. You feel refreshed and ready for anything.",
    choices: [
      { text: "Thank the dryad and continue your journey", nextSceneId: "endGame" },
    ],
    score: 100,
  },
  "gladeEnd": {
    id: "gladeEnd",
    text: "You explore the glade, finding rare flowers and ancient trees. It's a peaceful, beautiful place, but there's nothing else to discover here.",
    choices: [
      { text: "Return to the crossroads", nextSceneId: "start" },
    ],
    score: 50,
  },
  "powerEnd": {
    id: "powerEnd",
    text: "The power of the orb fills you completely. You feel ready to face any challenge the world throws at you. Your adventure truly begins now!",
    choices: [
      { text: "Start a new adventure", nextSceneId: "start" },
    ],
    score: 150,
  },
  "caveEnd": {
    id: "caveEnd",
    text: "The carvings depict a prophecy of a hero who will unite the realms. You wonder if it could be you...",
    choices: [
      { text: "Return to the crossroads", nextSceneId: "start" },
    ],
    score: 75,
  },
  "endGame": {
    id: "endGame",
    text: "Your journey through this part of the forest concludes. You carry new knowledge and experiences with you. What will your next adventure be?",
    choices: [
      { text: "Play again", nextSceneId: "start" },
    ],
  },
};