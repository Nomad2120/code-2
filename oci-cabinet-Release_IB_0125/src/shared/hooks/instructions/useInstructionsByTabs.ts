import { useInstructions } from '@shared/hooks/instructions/useInstructions';
import { useEffect } from 'react';
import { timeJumps } from '@shared/instructions/config';
import { Tabs as TabsKeys } from '@shared/tabs';

interface Props {
  instructionKey: string;
  currentTab: TabsKeys;
}

interface Return {
  onInstructionClick: () => void;
}

type UseInstructionsByTabs = (props: Props) => Return;

export const useInstructionsByTabs: UseInstructionsByTabs = ({ instructionKey, currentTab }) => {
  const { onInstructionClick, seekTo } = useInstructions({ key: instructionKey });

  useEffect(() => {
    const seconds = timeJumps[currentTab as TabsKeys];
    seekTo(seconds);
  }, [currentTab, seekTo]);

  return {
    onInstructionClick
  };
};
