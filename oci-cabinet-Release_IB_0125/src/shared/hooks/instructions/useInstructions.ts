import { useInjection } from 'inversify-react';
import { InstructionsModule } from '@mobx/services/instructions';

interface Props {
  key: string;
}

interface Return {
  onInstructionClick: () => void;
  seekTo: (seconds: number) => void;
}

type UseInstructions = (props: Props) => Return;

export const useInstructions: UseInstructions = ({ key }) => {
  const instructionsModule = useInjection<InstructionsModule>(InstructionsModule);

  const onInstructionClick = async () => {
    if (instructionsModule.isDrawerOpen) {
      instructionsModule.isDrawerOpen = false;
      instructionsModule.sx = {
        justifyContent: 'center'
      };
      return;
    }
    instructionsModule.sx = {
      justifyContent: 'flex-start'
    };
    instructionsModule.isDrawerOpen = true;
    instructionsModule.openInstructionByKey(key);
  };

  return {
    onInstructionClick,
    seekTo: instructionsModule.seekTo
  };
};
