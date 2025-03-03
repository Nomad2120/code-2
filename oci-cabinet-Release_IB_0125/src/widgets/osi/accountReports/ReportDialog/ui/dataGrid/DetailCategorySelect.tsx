import { FormControl, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useReportDialogContext } from '@widgets/osi/accountReports/ReportDialog/model/context';
import { AccountReportListItem, AccountReportListItemDetail } from '@shared/types/osi/accountReports';
import logger from 'js-logger';
import { useGridApiContext } from '@mui/x-data-grid-pro';
import { CategoryPopper } from '@widgets/osi/accountReports/ReportDialog/ui/dataGrid/CategoryPopper';

interface Props {
  detail: AccountReportListItemDetail;
  item: AccountReportListItem;

  [x: string]: any;
}

export const DetailCategorySelect: React.FC<Props> = observer(({ detail, item, ...otherProps }) => {
  const viewModel = useReportDialogContext();
  const apiRef = useGridApiContext();
  const selectEl = useRef<HTMLDivElement | null>(null);
  const [isShowPopper, setIsShowPopper] = useState(false);
  const [selectValue, setSelectValue] = useState(detail.categoryId);
  const [popperTimer, setPopperTimer] = useState<any>(null);

  const selectFieldRef = useRef<HTMLInputElement | null>(null);

  const accountType = viewModel?.reportDialog.selectedAccount?.accountType;

  const categories = viewModel?.getAllowedCategories(item.operationType, accountType ?? 'CURRENT');

  const categoryPreview = categories?.filter((category) => category.id === selectValue)[0]?.nameRu || '';

  const onPointerEnter = () => {
    const dispose = setTimeout(() => {
      setIsShowPopper(true);
    }, 600);

    setPopperTimer(dispose);
  };

  const onPointerLeave = () => {
    if (popperTimer) {
      clearTimeout(popperTimer);
    }
    setIsShowPopper(false);
  };

  const onSelect = (e: SelectChangeEvent) => {
    const categoryId = e.target.value;

    setSelectValue(e.target.value);
    apiRef.current.updateRows([{ id: detail.id, categoryId }]);
    if (apiRef.current.getRowMode(detail.id) === 'edit') apiRef.current.stopRowEditMode({ id: detail.id });
    viewModel?.updateDetailCategoryId(detail.id, categoryId);
  };

  useEffect(() => {
    setSelectValue(detail.categoryId);
  }, [detail.categoryId]);

  useEffect(() => {
    if (otherProps.hasFocus) {
      selectFieldRef.current?.focus();
    }
  }, [otherProps.hasFocus]);

  return (
    <FormControl
      ref={selectEl}
      variant="standard"
      size={'small'}
      sx={{ width: '100%' }}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      onBlur={onPointerLeave}
    >
      <Select
        labelId={'category-select-label'}
        id={'category-select'}
        value={selectValue as string | undefined}
        onChange={onSelect}
        inputRef={selectFieldRef}
        inputProps={{ tabIndex: otherProps.tabIndex }}
      >
        <MenuItem value={''}>{'Очистить'}</MenuItem>
        {categories?.map((category) => (
          <MenuItem key={category.id} value={category.id}>
            {`${category.number} ${category.nameRu}`}
          </MenuItem>
        ))}
      </Select>
      {isShowPopper && !!categoryPreview && (
        <CategoryPopper
          setIsShowPopper={setIsShowPopper}
          isShowPopper={isShowPopper}
          anchorEl={selectEl.current}
          content={categoryPreview}
        />
      )}
    </FormControl>
  );
});
