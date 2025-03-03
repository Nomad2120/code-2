import Modal from 'react-bootstrap/Modal';
import ReactPlayer from 'react-player/youtube';
import { useLocation, useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

export const TutorialModal = observer(() => {
  const { hash } = useLocation();
  const navigate = useNavigate();
  const isOpen = hash === '#tutorial' || hash === '#tutorial-reg';

  const handleClose = () => {
    navigate('#');
  };

  const getTutorialByHash = () => {
    if (hash === '#tutorial') return 'https://www.youtube.com/watch?v=90LVZsgzmjU';

    if (hash === '#tutorial-reg') return 'https://youtu.be/iJmoY4KRwG0';

    return '';
  };

  return (
    <Modal centered show={isOpen} onHide={handleClose} dialogClassName={'tutorial-modal'}>
      <Modal.Header className={'border-none'} closeButton />
      <Modal.Body>
        <div className={'tutorial-wrapper'}>
          <ReactPlayer
            id={'tutorial-player'}
            controls
            width={'100%'}
            height={'100%'}
            light
            playing
            url={getTutorialByHash()}
          />
        </div>
      </Modal.Body>
    </Modal>
  );
});
