import React, { ReactNode, useRef, useState } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { NavLink as RouterLink } from 'react-router-dom';
import { tokens, TranslatedToken } from '@shared/utils/i18n';
import { PATH_AUTH } from '@app/routes/paths';
import { delay } from '@shared/utils';

interface Props {
  text: string;
  smallText: string;
  Content: ReactNode;
}

export const HomeServiceCard = ({ text, smallText, Content }: Props): JSX.Element => {
  const bottomRef = useRef<HTMLSpanElement>(null);
  const topRef = useRef<HTMLSpanElement>(null);
  const [isShowModal, setIsShowModal] = useState<boolean>(false);

  const openModal = (): void => {
    const scrollAfterDelay = async () => {
      await delay(500);

      const scroll = async (): Promise<void> => {
        if (bottomRef.current && topRef.current) {
          bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          await delay(1000);
          topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      };

      if (bottomRef.current && topRef.current) {
        scroll();
      }
    };

    setIsShowModal(true);

    scrollAfterDelay();
  };

  const closeModal = (): void => {
    setIsShowModal(false);
  };

  return (
    <>
      <Box
        sx={(theme) => ({
          border: '3px solid',
          borderRadius: '8px',
          borderColor: 'primary.main',
          paddingRight: theme.spacing(0.5),
          flex: '1 1 auto',
          width: 290,
          height: 125,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          boxShadow: `inset 0 4px 8px 0 ${alpha(theme.palette.primary.main, 0.24)}`,
          bgcolor: alpha(theme.palette.primary.main, 0.12)
        })}
        onClick={openModal}
      >
        <Typography variant="h6" color="white" align="center">
          {text}
        </Typography>
        <Typography variant="body1" color="white" align="center">
          {smallText}
        </Typography>
        <Typography variant="body1" align="right" sx={{ ml: 'auto', cursor: 'pointer', color: 'primary.main' }}>
          <TranslatedToken id={tokens.common.clickMe} />
        </Typography>
      </Box>

      <Dialog scroll="paper" open={isShowModal} onClose={closeModal}>
        <DialogTitle>
          <Typography variant="h5" color="primary.main">
            {text}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <span ref={topRef} />
          {Content}
          <span ref={bottomRef} />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeModal}>
            <TranslatedToken id={tokens.common.close} />
          </Button>
          <Button variant="contained" component={RouterLink} to={PATH_AUTH.register} sx={{ ml: '10px' }}>
            <TranslatedToken id={tokens.common.register} />
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
