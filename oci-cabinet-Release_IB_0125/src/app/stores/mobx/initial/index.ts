import { Registration, RegistrationFullData, User, UserRole } from '@mobx/interfaces';

export const initialRole: UserRole = {
  nameKz: '',
  nameRu: '',
  role: 'ABONENT'
};

export const initialUser: User = {
  appartments: [],
  currentRole: initialRole,
  id: 0,
  info: null as any,
  osis: [],
  registrations: { all: [], selected: null },
  roles: []
};

export const initialRegistrations: { all: Registration[] | null; selected: RegistrationFullData | null } = {
  all: null,
  selected: null
};
