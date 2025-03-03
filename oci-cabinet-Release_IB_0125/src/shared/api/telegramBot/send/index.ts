import { instance } from '@shared/api/config';
import { path } from '@shared/api/telegramBot/config';
import { CallMeBackNotificationRequest } from '@shared/types/telegramBot';

export const callMeBack = (payload: CallMeBackNotificationRequest) =>
  instance.post(`${path}/send/call-me-back`, payload);
