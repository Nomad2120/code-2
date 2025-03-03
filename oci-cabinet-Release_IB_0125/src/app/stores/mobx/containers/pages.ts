import { Container } from 'inversify';
import { OsiActsPageViewModel } from '@pages/osi/acts';
import { OsiRootViewModel } from '@pages/osi/root/model/viewModel';

const pagesContainer = new Container();

BindOsiRoot();
BindOsiActs();

function BindOsiRoot() {
  pagesContainer.bind<OsiRootViewModel>(OsiRootViewModel).toSelf().inTransientScope();
}

function BindOsiActs() {
  pagesContainer.bind<OsiActsPageViewModel>(OsiActsPageViewModel).toSelf().inTransientScope();
}

export default pagesContainer;
