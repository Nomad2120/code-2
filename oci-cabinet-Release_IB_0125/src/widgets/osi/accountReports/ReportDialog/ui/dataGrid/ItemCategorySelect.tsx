import { FormControl, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useReportDialogContext } from '@widgets/osi/accountReports/ReportDialog/model/context';
import { AccountReportListItem } from '@shared/types/osi/accountReports';
import logger from 'js-logger';
import { useGridApiContext } from '@mui/x-data-grid-pro';
import { autorun } from 'mobx';
import { CategoryPopper } from '@widgets/osi/accountReports/ReportDialog/ui/dataGrid/CategoryPopper';
import { useTranslation } from 'react-i18next';

interface Props {
  row: AccountReportListItem;
}

export const ItemCategorySelect: React.FC<Props> = observer(({ row }) => {
  const { t } = useTranslation();
  const viewModel = useReportDialogContext();
  const apiRef = useGridApiContext();
  const selectEl = useRef<HTMLDivElement | null>(null);
  const [isShowPopper, setIsShowPopper] = useState(false);
  const [selectValue, setSelectValue] = useState(row.categoryId);
  const [popperTimer, setPopperTimer] = useState<any>(null);

  const accountType = viewModel?.reportDialog.selectedAccount?.accountType;

  const categories = viewModel?.getAllowedCategories(row.operationType, accountType ?? 'CURRENT');

  const categoryPreview = categories?.filter((category) => category.id === selectValue)[0]?.nameRu || '';

  const item = viewModel?.reportDialog?.selectedAccount?.items?.find((item) => item.id === row.id);

  const onMouseEnter = () => {
    const dispose = setTimeout(() => {
      setIsShowPopper(true);
    }, 600);

    setPopperTimer(dispose);
  };

  const onMouseLeave = () => {
    if (popperTimer) {
      clearTimeout(popperTimer);
    }
    setIsShowPopper(false);
  };

  const onSelect = (e: SelectChangeEvent) => {
    const categoryId = e.target.value as number | string | null | undefined;

    setSelectValue(e.target.value);
    apiRef.current.updateRows([{ id: row.id, categoryId }]);
    viewModel?.updateItemCategory(row.id, categoryId);
  };

  useEffect(() => {
    setSelectValue(row.categoryId);
  }, [row.categoryId]);

  useEffect(() => {
    autorun(() => {
      const item = viewModel?.reportDialog?.selectedAccount?.items?.find((item) => item.id === row.id);

      if (!item) return;

      if (!item?.details?.length) return;

      setSelectValue('');
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <FormControl
      ref={selectEl}
      variant="standard"
      size={'small'}
      sx={{ width: '100%', '& .MuiInput-input': { color: row.operationType === 'DEBET' ? '#71151a' : '#104e1f' } }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <Select
        disabled={Boolean(item?.details?.length)}
        labelId={'category-select-label'}
        id={'category-select'}
        value={selectValue as string | undefined}
        onChange={onSelect}
        onOpen={onMouseLeave}
      >
        <MenuItem value={''}>{t('common:clear')}</MenuItem>
        {categories?.map((category) => (
          <MenuItem key={category.id} value={category.id}>
            {`${category.number} ${category.nameRu}`}
          </MenuItem>
        ))}
      </Select>
      {isShowPopper && !!categoryPreview && (
        <CategoryPopper
          isShowPopper={isShowPopper}
          setIsShowPopper={setIsShowPopper}
          anchorEl={selectEl.current}
          content={categoryPreview}
        />
      )}
    </FormControl>
  );
});
