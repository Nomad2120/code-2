export interface ServiceGroupSaldo {
  /** @format int32 */
  abonentId?: number;
  /** @format int32 */
  groupId?: number;
  /** @format int32 */
  osiId?: number;
  /** @format double */
  saldo?: number;
  /** @format int32 */
  id?: number;
  /** @format int32 */
  transactionId?: number;
  abonentName?: string | null;
  abonentFlat?: string | null;
  groupNameRu?: string | null;
  groupNameKz?: string | null;
}

export interface ServiceGroupSaldoRequest {
  /** @format int32 */
  abonentId?: number;
  /** @format int32 */
  groupId?: number;
  /** @format int32 */
  osiId?: number;
  /** @format double */
  saldo?: number;
}
