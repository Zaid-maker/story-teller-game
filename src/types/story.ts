export interface Choice {
  text: string;
  nextSceneId: string;
  requires?: string;
}

export interface Scene {
  id:string;
  text: string;
  choices: Choice[];
  score?: number;
  gives?: string;
}

export type Story = Record<string, Scene>;