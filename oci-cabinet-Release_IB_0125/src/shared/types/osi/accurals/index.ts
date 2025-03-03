export interface PlanAccural {
  /** @format int32 */
  id?: number;
  /** @format int32 */
  osiId?: number;
  /** @format date-time */
  beginDate?: string;
  accuralCompleted?: boolean;
  ussikingIncluded?: boolean;
  /** @format int32 */
  apartCount?: number;
  /** @format double */
  tariff?: number;
  /** @format date-time */
  accuralDate?: string | null;
  accuralJobAtDay: number;
}
