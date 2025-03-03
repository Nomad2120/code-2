import { FormattedMessage, useIntl } from 'react-intl';
import { messages } from '../messages';

export interface TranslatedTokenProps {
  id: string;
  fallbackMessage?: string | null;
}

export const TranslatedToken = ({ id, fallbackMessage = null }: TranslatedTokenProps): JSX.Element => {
  const intl = useIntl();
  if (!id) {
    return <span>{`${fallbackMessage || ''}`}</span>;
  }

  const defaultMessage = messages[intl.defaultLocale][id];

  return <FormattedMessage id={id} defaultMessage={fallbackMessage || defaultMessage} />;
};
