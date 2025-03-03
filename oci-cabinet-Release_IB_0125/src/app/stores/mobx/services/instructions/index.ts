import { injectable } from 'inversify';
import { autorun, makeAutoObservable } from 'mobx';
import { Location } from 'react-router-dom';
import { links as instructionKeys } from '@shared/instructions/config';
import { DictionaryModule } from '@mobx/services/dictionaries/model/DictionaryModule';

@injectable()
export class InstructionsModule {
  currentInstruction = '';

  isDrawerOpen = false;

  location: Location<any> | null = null;

  player: any = null;

  sx: any = {};

  constructor(private dictionary: DictionaryModule) {
    makeAutoObservable(this);

    autorun(async () => {
      if (!this.location) return;

      const { pathname } = this.location;

      const isRegister = pathname.split('/').includes('auth');

      if (isRegister) {
        this.openInstructionByKey(instructionKeys.auth);
        return;
      }

      this.isDrawerOpen = false;

      const key = pathname.split('/').pop() ?? '';

      this.openInstructionByKey(key);
    });
  }

  openInstructionByKey = (key: string) => {
    this.currentInstruction = this.dictionary.instructionLinks[key];

    // сразу включаем плеер
    this.player?.handleClickPreview();
  };

  seekTo = (seconds: number) => {
    // сразу включаем плеер
    this.player?.handleClickPreview();
    this.player?.seekTo(seconds);
  };
}
