import React, { useEffect } from 'react';
import { useInjection } from 'inversify-react';
import { observer } from 'mobx-react-lite';
import { toJS } from 'mobx';
import Signer from '@shared/common/Signer';
import LoadingScreen from '@shared/components/LoadingScreen';
import { RegistrationSignViewModel } from '@entities/registration/RegistrationSignForm/model/RegistrationSignViewModel';

interface Props {
  onPostSign?: () => Promise<void>;
}

const RegistrationSignForm: React.FC<Props> = observer(({ onPostSign }) => {
  const viewModel = useInjection(RegistrationSignViewModel);

  useEffect(() => {
    void viewModel.createContract();
  }, []);

  const renderHTML = (tag: any, rawHTML: any) =>
    React.createElement(tag, {
      style: {
        backgroundColor: '#fff',
        padding: '10px',
        border: '1px solid gray',
        color: '#161717',
        marginBottom: '20px'
      },
      dangerouslySetInnerHTML: { __html: rawHTML }
    });

  const handleSaveContract = async (data: any) => {
    try {
      await viewModel.saveContract(data);
      await onPostSign?.();
    } catch (e) {
      console.error(e);
    }
  };

  if (viewModel.isLoading) return <LoadingScreen />;

  return (
    <div>
      {viewModel.elements.docHtml && renderHTML('div', viewModel.elements.docHtml)}
      {viewModel.elements.docPdf && (
        <Signer
          data={toJS(viewModel.elements.docPdf)}
          onPostSign={handleSaveContract}
          content="Подписывая документ с помощью ЭЦП, Вы подтверждаете корректность введеных данных и предоставленных документов"
        />
      )}
    </div>
  );
});

export default RegistrationSignForm;
