import api from '@app/api';

export const getServicesText = (count: number) => {
  const servCount = (count + 10) % 10;
  if (servCount === 1) {
    return 'Услуга';
  }

  if (servCount > 1 && servCount < 5) {
    return 'Услуги';
  }

  return 'Услуг';
};

export const getServicesByGroups = (services: any) => {
  if (!Array.isArray(services)) return [];
  const groups = new Map();
  services.forEach((x) => {
    const { serviceGroupNameRu, serviceGroupNameKz } = x;
    if (!groups.has(serviceGroupNameRu)) {
      groups.set(serviceGroupNameRu, {
        serviceGroupNameRu,
        serviceGroupNameKz,
        services: []
      });
    }
    groups.get(serviceGroupNameRu).services.push(x);
  });
  return Array.from(groups.values());
};

export const getAccountsDescription = (accounts: any) => {
  if (!accounts || !accounts?.length) return 'Пусто';

  const accCount = (accounts.length + 10) % 10;
  if (accCount === 1) return `${accCount} счет`;

  if (accCount > 1 && accCount < 5) return `${accCount} счета`;

  return `${accCount} счетов`;
};

export const getActivePlanAccruals = async (osiId: number, servicesByGroups?: any) => {
  const activePlan = await api.OsiPlanAccruals(osiId);
  if (!servicesByGroups) return activePlan;

  const planServicesByGroups = servicesByGroups.map((x: { groupNameKz: any; groupNameRu: any; services: any }) => ({
    serviceGroupNameKz: x.groupNameKz,
    serviceGroupNameRu: x.groupNameRu,
    osiServices: x.services
  }));
  (activePlan as any).servicesByGroups = planServicesByGroups.slice();

  return activePlan;
};
