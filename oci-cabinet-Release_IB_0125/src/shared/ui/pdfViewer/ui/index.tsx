import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { Box, Grid, IconButton } from '@mui/material';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { Document, Outline, Page, pdfjs } from 'react-pdf';
import useMeasure from 'react-use-measure';
import 'react-pdf/dist/Page/TextLayer.css';

interface Props {
  base64: string;
}

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

export const PdfViewer: React.FC<Props> = observer(({ base64 }) => {
  const [ref, { width, height }] = useMeasure();
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  const onLoadSuccess = async (successEvent: any) => {
    setNumPages(successEvent.numPages);
    setPageNumber(1);
  };

  const changePage = (offset: number) => {
    setPageNumber((prevPageNumber) => prevPageNumber + offset);
  };

  const previousPage = () => {
    changePage(-1);
  };

  const nextPage = () => {
    changePage(1);
  };

  const onItemClick = ({ pageNumber: itemPageNumber }: { pageNumber: number }) => {
    setPageNumber(itemPageNumber);
  };

  return (
    <Grid ref={ref} sx={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }} container>
      <Grid item xs={12}>
        <Box>
          {base64 && (
            <Document file={`data:application/pdf;base64,${base64}`} onLoadSuccess={onLoadSuccess}>
              <Outline onItemClick={onItemClick} />
              <Page width={width} pageNumber={pageNumber || 1} />
            </Document>
          )}
        </Box>
        <Grid sx={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }} container>
          <Grid item xs={6}>
            <p>
              Страница {pageNumber || (numPages ? 1 : '--')} из {numPages || '--'}
            </p>
          </Grid>
          {numPages && numPages > 1 && (
            <Grid item xs={6}>
              <IconButton aria-label="previous" size="small" disabled={pageNumber <= 1} onClick={previousPage}>
                <KeyboardArrowLeftIcon />
              </IconButton>
              <IconButton aria-label="next" size="small" disabled={pageNumber >= numPages} onClick={nextPage}>
                <KeyboardArrowRightIcon />
              </IconButton>
            </Grid>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
});
