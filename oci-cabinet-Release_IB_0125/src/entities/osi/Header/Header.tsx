import { Box, Grid, Typography } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { ReactNode } from 'react';
import { styled } from '@mui/material/styles';

interface Props {
  title: string;
  Slots?: {
    Breadcrumbs?: ReactNode;
    InstructionButton?: ReactNode;
  };
}

const Wrapper = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gridTemplateRows: '1fr 1fr'
}));

const HeadingWrapper = styled(Box)(({ theme }) => ({
  gridColumn: 1,
  gridRow: 1
}));

const BreadcrumbsWrapper = styled(Box)(({ theme }) => ({
  gridColumn: 1,
  gridRow: 2
}));

const InstructionsWrapper = styled(Box)(({ theme }) => ({
  gridColumn: 2,
  gridRow: '1 / span 2',
  display: 'flex',
  justifyContent: 'flex-end'
}));

export const Header: React.FC<Props> = observer(({ title, Slots }) => {
  const test = '';
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={8}>
        <Wrapper>
          <HeadingWrapper>
            <Typography variant="h4" gutterBottom>
              {title}
            </Typography>
          </HeadingWrapper>
          <BreadcrumbsWrapper>{Slots?.Breadcrumbs}</BreadcrumbsWrapper>
          <InstructionsWrapper>{Slots?.InstructionButton}</InstructionsWrapper>
        </Wrapper>
      </Grid>
    </Grid>
  );
});
