export type WalletTransaction = {
  id: string
  type: string
  amount: number
  balanceAfter: number
  description?: string | null
  reference?: string | null
  createdAt: string
}

export type WalletTopUp = {
  id: string
  reference: string
  amount: number
  status: 'PROCESSING' | 'APPROVED' | 'REJECTED'
  slipPath: string
  adminNote?: string | null
  rejectionReason?: string | null
  reviewedAt?: string | null
  createdAt: string
  user?: { id: string; name: string; mobileNumber: string }
}

export type WalletWithdrawal = {
  id: string
  reference: string
  amount: number
  status: 'PENDING' | 'COMPLETED' | 'REJECTED'
  accountName: string
  accountNumber: string
  bankName: string
  branchName: string
  adminNote?: string | null
  rejectionReason?: string | null
  reviewedAt?: string | null
  createdAt: string
  user?: { id: string; name: string; mobileNumber: string }
}

export type WalletOverview = {
  balance: number
  transactions: WalletTransaction[]
  topUps: WalletTopUp[]
  withdrawals: WalletWithdrawal[]
}

export type AdminWalletUser = {
  id: string
  name: string
  mobileNumber: string
  role: string
  status: string
  balance: number
}

export type AdminWalletOverview = {
  topUps: WalletTopUp[]
  withdrawals: WalletWithdrawal[]
  users: AdminWalletUser[]
}
