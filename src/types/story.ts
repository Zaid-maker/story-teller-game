export interface Choice {
  text: string;
  nextSceneId: string;
  requires?: string;
  score_required?: number;
}

export interface Scene {
  id:string;
  text: string;
  choices: Choice[];
  score?: number;
  gives?: string;
  grants_achievement?: string;
}

export type Story = Record<string, Scene>;