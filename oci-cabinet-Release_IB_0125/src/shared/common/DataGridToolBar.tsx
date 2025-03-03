import React from 'react';

import { GridToolbarContainer, GridToolbarColumnsButton, GridToolbarFilterButton } from '@mui/x-data-grid-pro';

const DataGridToolBar: React.FC = () => (
  <GridToolbarContainer>
    <GridToolbarColumnsButton />
    <GridToolbarFilterButton />
  </GridToolbarContainer>
);

export default DataGridToolBar;
