import { observer } from 'mobx-react-lite';
import { Box, Dialog, DialogContent } from '@mui/material';
import ReactPlayer from 'react-player';
import { useEffect, useState } from 'react';
import { getValueByKey } from '@shared/api/keyValues';
import { links } from '@shared/instructions/config';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const InstructionDialog: React.FC<Props> = observer(({ isOpen, onClose }) => {
  const [link, setLink] = useState('');

  useEffect(() => {
    const loadLink = async () => {
      const link = await getValueByKey(links.cabinet);

      setLink(link);
    };

    if (!link && isOpen) {
      loadLink();
    }
  }, [isOpen, link]);

  return (
    <Dialog fullWidth maxWidth={'md'} open={isOpen} onClose={onClose}>
      <DialogContent>
        <Box sx={{ height: 500 }}>
          <ReactPlayer
            width={'100%'}
            height={'100%'}
            style={{ borderRadius: '20px' }}
            light
            url={link}
            playing
            controls
          />
        </Box>
      </DialogContent>
    </Dialog>
  );
});
