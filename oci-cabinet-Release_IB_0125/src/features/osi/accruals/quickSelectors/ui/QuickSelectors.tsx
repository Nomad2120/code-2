import { GridToolbarContainer, GridToolbarFilterButton } from '@mui/x-data-grid-pro';
import React from 'react';
import { observer } from 'mobx-react-lite';
import { IOsiServiceAbonentsButtonFeatureViewModel } from '@shared/types/mobx/features/osiAccruals';
import { AreaTypeCodes } from '@shared/types/dictionaries';
import { useTranslation } from '@shared/utils/i18n';
import { QuickSelector } from './QuickSelector';

interface Props {
  viewModel: IOsiServiceAbonentsButtonFeatureViewModel;
}

export const QuickSelectors: React.FC<Props> = observer(({ viewModel }) => {
  const { t } = useTranslation();

  return (
    <GridToolbarContainer>
      <GridToolbarFilterButton onResize={() => {}} onResizeCapture={() => {}} />
      <QuickSelector label={t('common:residentials')} type={AreaTypeCodes.RESIDENTIAL} viewModel={viewModel} />
      <QuickSelector label={t('common:nonResidentials')} type={AreaTypeCodes.NON_RESIDENTIAL} viewModel={viewModel} />
      <QuickSelector label={t('common:basement')} type={AreaTypeCodes.BASEMENT} viewModel={viewModel} />
    </GridToolbarContainer>
  );
});
