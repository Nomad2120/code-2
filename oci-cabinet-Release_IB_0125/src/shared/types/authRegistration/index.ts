export interface UserContactResponse {
  isContacted: boolean;
  isRegistered: boolean;
  hasPassword: boolean;
  botUrl?: string | null;
}
