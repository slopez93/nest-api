import { MotherCreator } from './MotherCreator';

export class WordMother {
  static random(size?: number): string {
    return MotherCreator.random().lorem.word(size);
  }
}
