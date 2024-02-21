export interface ICharacters {
  id: number;
  name: string;
  image: string;
}

interface ILocationShort {
  name: string;
  url: string;
}

export interface ICharacter extends ICharacters {
  status: string;
  origin: ILocationShort;
  species: string;
}

export interface ICharacterResult {
  info: {
    count: number;
    pages: number;
    next: string | null;
    prev: string | null;
  }
  results: Array<ICharacter>
}

export class DefaultCharacter implements ICharacter {
  id: number;
  name: string;
  species: string;
  status: string;
  origin: ILocationShort;
  image: string;
  constructor() {
    this.id = 0;
    this.name = '';
    this.species = '';
    this.status = '';
    this.origin = {
      name: '',
      url: ''
    };
    this.image = '';
  }
}
