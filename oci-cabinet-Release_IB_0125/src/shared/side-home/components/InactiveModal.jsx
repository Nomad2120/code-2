import { useInactivity } from '@shared/hooks/useInactivity';
import { observer } from 'mobx-react-lite';
import PopUpModal from '@shared/side-home/components/Modal';
import { useState } from 'react';
import { useInjection } from 'inversify-react';
import { ContactService } from '@shared/side-home/model/ContactService';

export const InactiveModal = observer(() => {
  const [isOpen, setIsOpen] = useState(false);
  const contactService = useInjection(ContactService);
  const onIdle = () => {
    if (contactService.isShowAbonentTypeModal) {
      return;
    }

    if (contactService.abonentType !== 'abonent') {
      setIsOpen(true);
    }
  };

  useInactivity({ onIdle, duration: 20 * 1000 });

  return <PopUpModal show={isOpen} onHide={() => setIsOpen(false)} inactive />;
});
