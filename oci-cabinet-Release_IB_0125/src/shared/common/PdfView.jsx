/* eslint-disable no-unused-vars */
import PropTypes from 'prop-types';
import { useState } from 'react';
import { Document, Outline, Page, pdfjs } from 'react-pdf';
import { SizeMe } from 'react-sizeme';
import { Grid, IconButton } from '@mui/material';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const PdfView = ({ pdfBase64 }) => {
  const [blob, setBlob] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  const onLoadSuccess = async (successEvent) => {
    const data = await successEvent.getData();
    const b = new Blob([data], { type: 'application/pdf' });
    setBlob(b);
    setNumPages(successEvent.numPages);
    setPageNumber(1);
    // window.open(URL.createObjectURL(blob));
  };

  const changePage = (offset) => {
    setPageNumber((prevPageNumber) => prevPageNumber + offset);
  };

  const previousPage = () => {
    changePage(-1);
  };

  const nextPage = () => {
    changePage(1);
  };

  const onItemClick = ({ pageNumber: itemPageNumber }) => {
    setPageNumber(itemPageNumber);
  };

  return (
    <Grid container direction="row" justify="center" alignItems="center">
      <Grid item xs={12}>
        <SizeMe
          render={({ size }) => (
            <div>
              {pdfBase64 && (
                <Document file={`data:application/pdf;base64,${pdfBase64}`} onLoadSuccess={onLoadSuccess}>
                  <Outline onItemClick={onItemClick} />
                  <Page width={size.width ? size.width : 1} pageNumber={pageNumber || 1} />
                </Document>
              )}
            </div>
          )}
        />
        <Grid container direction="row" justify="center" alignItems="center">
          <Grid item xs={6}>
            <p>
              Страница {pageNumber || (numPages ? 1 : '--')} из {numPages || '--'}
            </p>
          </Grid>
          {numPages > 1 && (
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
};

PdfView.propTypes = {
  pdfBase64: PropTypes.any
};

export default PdfView;
