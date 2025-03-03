import { GridLocaleText } from '@mui/x-data-grid/models/api/gridLocaleTextApi';

export const kzKZ: Partial<GridLocaleText> = {
  // Root
  noRowsLabel: 'Жолдаржоқ',
  noResultsOverlayLabel: 'деректер табылмады.',

  // Density selector toolbar button text
  toolbarDensity: 'жол биіктігі',
  toolbarDensityLabel: 'жол биіктігі',
  toolbarDensityCompact: 'Компам',
  toolbarDensityStandard: 'стандартты',
  toolbarDensityComfortable: 'ыңғайлы',

  // Columns selector toolbar button text
  toolbarColumns: 'бағандар',
  toolbarColumnsLabel: 'бағандарды бөлектеңіз',

  // Filters toolbar button text
  toolbarFilters: 'сүзгілер',
  toolbarFiltersLabel: 'сүзгілерді көрсету',
  toolbarFiltersTooltipHide: 'сүзгілерді жасыру',
  toolbarFiltersTooltipShow: 'сүзгілерді көрсету',
  toolbarFiltersTooltipActive: (count) => {
    let pluralForm = 'белсенді сүзгілер';
    const lastDigit = count % 10;
    if (lastDigit > 1 && lastDigit < 5) {
      pluralForm = 'белсенді сүзгі';
    } else if (lastDigit === 1) {
      pluralForm = 'белсенді сүзгі';
    }
    return `${count} ${pluralForm}`;
  },

  // Quick filter toolbar field
  toolbarQuickFilterPlaceholder: 'іздеу...',
  toolbarQuickFilterLabel: 'іздеу',
  toolbarQuickFilterDeleteIconLabel: 'тазалау',

  // Export selector toolbar button text
  toolbarExport: 'экспорттау',
  toolbarExportLabel: 'экспорттау',
  toolbarExportCSV: 'CSV форматында жүктеу',
  toolbarExportPrint: 'Басып шығару',
  toolbarExportExcel: 'Excel форматында жүктеу',

  // Columns panel text
  columnsPanelTextFieldLabel: 'бағанды табу',
  columnsPanelTextFieldPlaceholder: 'баған тақырыбы',
  columnsPanelDragIconLabel: 'баған ретін өзгерту',
  columnsPanelShowAllButton: 'барлығын көрсету',
  columnsPanelHideAllButton: 'барлығын жасыру',

  // Filter panel text
  filterPanelAddFilter: 'сүзгіні қосу',
  // filterPanelRemoveAll: 'Remove all',
  filterPanelDeleteIconLabel: 'жою',
  // Filterpanellogicoperator:'логикалық операторлар',
  // filterPanelOperator:'операторлар',
  filterPanelOperatorAnd: 'және',
  filterPanelOperatorOr: 'немесе',
  filterPanelColumns: 'бағандар',
  filterPanelInputLabel: 'мәні',
  filterPanelInputPlaceholder: 'сүзгі мәні',

  // Filter operators text
  filterOperatorContains: 'құрамында',
  filterOperatorEquals: 'тең',
  filterOperatorStartsWith: 'басталады',
  filterOperatorEndsWith: ' аяқталады',
  filterOperatorIs: 'тең',
  filterOperatorNot: 'тең емес',
  filterOperatorAfter: 'артық',
  filterOperatorOnOrAfter: 'үлкен немесе тең',
  filterOperatorBefore: 'аз',
  filterOperatorOnOrBefore: 'аз немесе тең',
  filterOperatorIsEmpty: 'бос',
  filterOperatorIsNotEmpty: 'бос емес',
  filterOperatorIsAnyOf: 'кез келген',

  // Filter values text
  filterValueAny: 'кез келген',
  filterValueTrue: 'шындық',
  filterValueFalse: 'өтірік',

  // Column menu text
  columnMenuLabel: 'мәзір',
  columnMenuShowColumns: 'бағандарды көрсету',
  // columnMenuManageColumns: 'Manage columns',
  columnMenuFilter: 'сүзгі',
  columnMenuHideColumn: 'жасыру',
  columnMenuUnsort: 'сұрыптаудан бас тарту',
  columnMenuSortAsc: 'өсу бойынша сұрыптау',
  columnMenuSortDesc: 'кему бойынша сұрыптау',

  // Column header text
  columnHeaderFiltersTooltipActive: (count) => {
    let pluralForm = 'белсенді сүзгілер';
    const lastDigit = count % 10;
    if (lastDigit > 1 && lastDigit < 5) {
      pluralForm = 'белсенді сүзгі';
    } else if (lastDigit === 1) {
      pluralForm = 'белсенді сүзгі';
    }
    return `${count} ${pluralForm}`;
  },
  columnHeaderFiltersLabel: 'сүзгілерді көрсету',
  columnHeaderSortIconLabel: 'сұрыптау',

  // Rows selected footer text
  footerRowSelected: (count) => {
    let pluralForm = 'таңдалған жолдар';
    const lastDigit = count % 10;
    if (lastDigit > 1 && lastDigit < 5) {
      pluralForm = 'таңдалған жолдар';
    } else if (lastDigit === 1) {
      pluralForm = 'жол таңдалды';
    }
    return `${count} ${pluralForm}`;
  },

  // Total row amount footer text
  footerTotalRows: 'Барлық жолдар:',

  // Total visible row amount footer text
  footerTotalVisibleRows: (visibleCount, totalCount) =>
    `${visibleCount.toLocaleString()} ${totalCount.toLocaleString()}`,

  // Checkbox selection text
  checkboxSelectionHeaderName: 'құсбелгіні таңдау',
  checkboxSelectionSelectAllRows: 'барлық жолдарды таңдаңыз',
  checkboxSelectionUnselectAllRows: 'барлық жолдарды алып тастаңыз',
  checkboxSelectionSelectRow: 'жолды таңдау',
  checkboxSelectionUnselectRow: 'жолды таңдаудан бас тарту',

  // Boolean cell text
  booleanCellTrueLabel: 'шындық',
  booleanCellFalseLabel: 'өтірік',

  // Actions cell more text
  actionsCellMore: 'қосымша',

  // Column pinning text
  pinToLeft: 'солға бекіту',
  pinToRight: 'оңға бекіту',
  unpin: 'босату',

  // Tree Data
  treeDataGroupingHeaderName: 'топ',
  treeDataExpand: 'балалар элементтерін көрсету',
  treeDataCollapse: 'балалар элементтерін жасыру',

  // Grouping columns
  groupingColumnHeaderName: 'топ',
  groupColumn: (name) => `${name} бойынша топтау`,
  unGroupColumn: (name) => `${name} бойынша топтан шығару`,

  // Master/detail
  detailPanelToggle: 'мәліметтер',
  expandDetailPanel: 'кеңейту',
  collapseDetailPanel: 'айналдыру',

  // Row reordering text
  rowReorderingHeaderName: 'жолдардың ретін өзгерту',

  // Aggregation
  aggregationMenuItemHeader: 'деректерді біріктіру',
  aggregationFunctionLabelSum: 'sum',
  aggregationFunctionLabelAvg: 'орташа',
  aggregationFunctionLabelMin: 'мин',
  aggregationFunctionLabelMax: 'макс',
  aggregationFunctionLabelSize: 'шот'
};
