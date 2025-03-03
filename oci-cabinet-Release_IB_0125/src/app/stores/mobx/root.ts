import { Container } from 'inversify';
import widgetsContainer from '@mobx/containers/widgets';
import serviceContainer from '@mobx/containers/service';
import entitiesContainer from '@mobx/containers/entities';
import { AuthModule } from '@mobx/services/auth';
import { OsiModule } from '@mobx/services/osiModule';
import featuresContainer from '@mobx/containers/features';
import pagesContainer from './containers/pages';

const rootContainer = Container.merge(
  serviceContainer,
  pagesContainer,
  widgetsContainer,
  featuresContainer,
  entitiesContainer
);
// DI

export const authModule = rootContainer.resolve(AuthModule);
export const osiModule = rootContainer.resolve(OsiModule);

export { rootContainer };
