export interface Characters {
  data: Data;
  characters: Character[];
}

export interface Data {
  data: {
    characters_count: number;
    average_age: number;
    average_weight: number;
    genders: {
      female: number;
      male: number;
      other: number;
      noGender: number;
    }
  }
}

export type ElementType = 'character' | 'nemesis' | 'secret';

export interface Character {
  id: number;
  name: string;
  gender: string | null;
  ability: string;
  minimalDistance: string;
  weight: string;
  born: string;
  inSpaceSince: string;
  beerConsumption: number;
  knowsTheAnswer: boolean;
  nemeses: Nemesis[];
}

export interface Nemesis {
  isAlive: boolean;
  years: number;
  id: number;
  secrets: Secret[];
}

export interface Secret {
  id: number;
  secretCode: number;
}

export interface HierarchyTableProps {
    items: Character[];
    onDelete: (id: string) => void;
}

export interface HierarchyRowProps {
  item: Character;
  onDelete: (id: string) => void;
}