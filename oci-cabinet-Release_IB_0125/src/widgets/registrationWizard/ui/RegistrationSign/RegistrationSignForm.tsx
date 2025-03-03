import React, { useEffect } from 'react';
import { useInjection } from 'inversify-react';
import { observer } from 'mobx-react-lite';
import { toJS } from 'mobx';
import Signer from '@shared/common/Signer';
import LoadingScreen from '@shared/components/LoadingScreen';
import {
  IRegistrationSignViewModel,
  token as IRegistrationSignViewModelToken
} from '@shared/types/mobx/RegistrationSignViewModel';
import { useRegistrationWizardContext } from '@widgets/registrationWizard/store/RegistrationWizardProvider';
import { WizardButtons } from '@widgets/registrationWizard/ui/RegistrationSign/WizardButtons';
import { Box } from '@mui/material';

export const RegistrationSignForm: React.FC = observer(() => {
  const wizard = useRegistrationWizardContext();
  const viewModel = useInjection<IRegistrationSignViewModel>(IRegistrationSignViewModelToken);

  useEffect(() => {
    viewModel.wizard = wizard;
  }, [viewModel, wizard]);

  const renderHTML = (tag: any, rawHTML: any) =>
    React.createElement(tag, {
      style: {
        backgroundColor: '#fff',
        padding: '10px',
        color: '#161717',
        marginBottom: '20px',
        minWidth: '1000px'
      },
      dangerouslySetInnerHTML: { __html: rawHTML }
    });

  const handleSaveContract = async (data: any) => {
    try {
      await viewModel.saveContract(data);
      await wizard.finish();
    } catch (e) {
      console.error(e);
    }
  };

  if (viewModel.isLoading) return <LoadingScreen />;

  return (
    <div>
      <Box sx={{ maxHeight: 500, overflow: 'scroll', marginBlockEnd: '20px', backgroundColor: 'white' }}>
        {viewModel.elements.docHtml && renderHTML('div', viewModel.elements.docHtml)}
      </Box>
      {viewModel.elements.docPdf && (
        <Signer
          data={toJS(viewModel.elements.docPdf)}
          onPostSign={handleSaveContract}
          content="Подписывая документ с помощью ЭЦП, Вы подтверждаете корректность введеных данных и предоставленных документов"
        />
      )}
      <WizardButtons />
    </div>
  );
});
