import { router } from '@app/routes';

const history = { navigateTo: (path: string) => router.navigate(path) };

export { history };
