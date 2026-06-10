import { http, apiGet, apiPost } from '../../services/http/client'
import { endpoints } from '../../services/http/endpoints'
import type { ApiResult } from '../../types/shared'
import type { AdminWalletOverview, WalletOverview, WalletTopUp, WalletWithdrawal } from './wallet.types'

export const walletService = {
  mine(): Promise<ApiResult<WalletOverview>> {
    return apiGet(endpoints.wallet.mine)
  },
  async topUp(amount: number, slip: File): Promise<ApiResult<WalletTopUp>> {
    try {
      const form = new FormData()
      form.append('amount', String(amount))
      form.append('slip', slip)
      const res = await http.post(endpoints.wallet.topUp, form, { headers: { 'Content-Type': 'multipart/form-data' } })
      return { ok: true, data: res.data, status: res.status }
    } catch (error: any) {
      return { ok: false, error: error?.response?.data?.message || error?.message || 'Top-up failed' }
    }
  },
  withdraw(payload: { amount: number; accountName: string; accountNumber: string; bankName: string; branchName: string }): Promise<ApiResult<WalletWithdrawal>> {
    return apiPost(endpoints.wallet.withdraw, payload)
  },
  adminOverview(): Promise<ApiResult<AdminWalletOverview>> {
    return apiGet(endpoints.wallet.adminOverview)
  },
  approveTopUp(id: string, note?: string) { return apiPost(endpoints.wallet.adminApproveTopUp(id), note ? { note } : {}) },
  rejectTopUp(id: string, reason?: string) { return apiPost(endpoints.wallet.adminRejectTopUp(id), reason ? { reason } : {}) },
  completeWithdrawal(id: string, note?: string) { return apiPost(endpoints.wallet.adminCompleteWithdrawal(id), note ? { note } : {}) },
  rejectWithdrawal(id: string, reason?: string) { return apiPost(endpoints.wallet.adminRejectWithdrawal(id), reason ? { reason } : {}) },
  adjustUser(id: string, payload: { amount: number; type: 'credit' | 'debit'; note?: string }) { return apiPost(endpoints.wallet.adminAdjustUser(id), payload) },
}
