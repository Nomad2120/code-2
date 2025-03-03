import { createContext, useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { RegistrationDocsViewModel } from './RegistrationDocsViewModel';

const Context = createContext<RegistrationDocsViewModel | null>(null);

interface Props {
  children: React.ReactNode;
  viewModel: RegistrationDocsViewModel;
}

export const RegistrationDocsProvider: React.FC<Props> = observer(({ viewModel, children }) => (
  <Context.Provider value={viewModel}>{children}</Context.Provider>
));

export const useRegistrationDocsContext = () => {
  const viewModel = useContext(Context);
  if (!viewModel) throw new Error('RegistrationDocsProvider not found');
  return viewModel!;
};
