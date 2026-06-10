import { useEffect, useMemo, useState } from 'react'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { walletService } from '../../features/wallet/wallet.service'
import type { AdminWalletOverview } from '../../features/wallet/wallet.types'
import { formatDateTime } from '../../utils/date'
import { formatMoney } from '../../utils/money'

function tone(status: string) {
  if (status === 'APPROVED' || status === 'COMPLETED') return 'green'
  if (status === 'REJECTED') return 'red'
  return 'yellow'
}

export default function AdminWallet() {
  const [data, setData] = useState<AdminWalletOverview | null>(null)
  const [query, setQuery] = useState('')
  const [notes, setNotes] = useState<Record<string, string>>({})
  const [adjust, setAdjust] = useState<Record<string, { amount: string; note: string }>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const load = async () => {
    const res = await walletService.adminOverview()
    if (!res.ok) return setError(res.error)
    setData(res.data)
  }

  useEffect(() => { void load() }, [])

  const run = async (fn: () => Promise<any>, success: string) => {
    setLoading(true); setError(null); setMessage(null)
    const res = await fn()
    setLoading(false)
    if (!res.ok) return setError(res.error)
    setMessage(success)
    await load()
  }

  const users = useMemo(() => {
    const q = query.toLowerCase().trim()
    const list = data?.users ?? []
    if (!q) return list
    return list.filter((u) => `${u.name} ${u.mobileNumber} ${u.role} ${u.status}`.toLowerCase().includes(q))
  }, [data, query])

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-xl font-semibold">Wallet Management</h1>
          <p className="text-sm text-white/55">Approve top-ups, process withdrawals, and adjust user wallet points.</p>
        </div>
        <div className="w-full md:w-80"><Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search users…" /></div>
      </div>

      {error && <p className="text-sm text-rose-300">{error}</p>}
      {message && <p className="text-sm text-emerald-300">{message}</p>}

      <div className="blx-panel p-6">
        <h2 className="text-lg font-semibold">Top-up Requests</h2>
        <div className="mt-4 space-y-4">
          {(data?.topUps ?? []).map((item) => (
            <div key={item.id} className="rounded-2xl border border-white/10 p-4">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div className="text-sm text-white/70">
                  <div className="text-base font-semibold text-white">{item.reference}</div>
                  <div>User: {item.user?.name} ({item.user?.mobileNumber})</div>
                  <div>Amount: {formatMoney(item.amount)}</div>
                  <div>Created: {formatDateTime(item.createdAt)}</div>
                  <div>Slip: <a className="text-purple-300 underline" href={`${import.meta.env.VITE_API_URL}${item.slipPath}`} target="_blank" rel="noreferrer">Open slip</a></div>
                </div>
                <Badge tone={tone(item.status) as any}>{item.status}</Badge>
              </div>
              {item.status === 'PROCESSING' && (
                <div className="mt-4 grid gap-3 md:grid-cols-[1fr_auto_auto]">
                  <Input placeholder="Admin note / rejection reason" value={notes[item.id] || ''} onChange={(e) => setNotes((p) => ({ ...p, [item.id]: e.target.value }))} />
                  <Button disabled={loading} onClick={() => void run(() => walletService.approveTopUp(item.id, notes[item.id]), 'Top-up approved and points added')}>Approve</Button>
                  <Button variant="secondary" disabled={loading} onClick={() => void run(() => walletService.rejectTopUp(item.id, notes[item.id]), 'Top-up rejected')}>Reject</Button>
                </div>
              )}
            </div>
          ))}
          {!(data?.topUps ?? []).length && <p className="text-sm text-white/50">No top-up requests.</p>}
        </div>
      </div>

      <div className="blx-panel p-6">
        <h2 className="text-lg font-semibold">Withdrawal Requests</h2>
        <div className="mt-4 space-y-4">
          {(data?.withdrawals ?? []).map((item) => (
            <div key={item.id} className="rounded-2xl border border-white/10 p-4">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div className="text-sm text-white/70">
                  <div className="text-base font-semibold text-white">{item.reference}</div>
                  <div>User: {item.user?.name} ({item.user?.mobileNumber})</div>
                  <div>Amount: {formatMoney(item.amount)}</div>
                  <div>Bank: {item.bankName} / {item.branchName}</div>
                  <div>Account: {item.accountName} - {item.accountNumber}</div>
                  <div>Created: {formatDateTime(item.createdAt)}</div>
                </div>
                <Badge tone={tone(item.status) as any}>{item.status}</Badge>
              </div>
              {item.status === 'PENDING' && (
                <div className="mt-4 grid gap-3 md:grid-cols-[1fr_auto_auto]">
                  <Input placeholder="Admin note / rejection reason" value={notes[item.id] || ''} onChange={(e) => setNotes((p) => ({ ...p, [item.id]: e.target.value }))} />
                  <Button disabled={loading} onClick={() => void run(() => walletService.completeWithdrawal(item.id, notes[item.id]), 'Withdrawal marked as completed')}>Mark Paid</Button>
                  <Button variant="secondary" disabled={loading} onClick={() => void run(() => walletService.rejectWithdrawal(item.id, notes[item.id]), 'Withdrawal rejected and points refunded')}>Reject</Button>
                </div>
              )}
            </div>
          ))}
          {!(data?.withdrawals ?? []).length && <p className="text-sm text-white/50">No withdrawal requests.</p>}
        </div>
      </div>

      <div className="blx-panel p-6">
        <h2 className="text-lg font-semibold">User Wallets</h2>
        <div className="mt-4 space-y-4">
          {users.map((u) => {
            const form = adjust[u.id] || { amount: '', note: '' }
            return (
              <div key={u.id} className="rounded-2xl border border-white/10 p-4">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <div className="font-medium">{u.name}</div>
                    <div className="text-sm text-white/55">{u.mobileNumber} • {u.role}</div>
                  </div>
                  <div className="text-xl font-semibold">{formatMoney(u.balance)}</div>
                </div>
                <div className="mt-4 grid gap-3 md:grid-cols-[160px_1fr_auto_auto]">
                  <Input type="number" placeholder="Amount" value={form.amount} onChange={(e) => setAdjust((p) => ({ ...p, [u.id]: { ...form, amount: e.target.value } }))} />
                  <Input placeholder="Note, e.g. winning payout" value={form.note} onChange={(e) => setAdjust((p) => ({ ...p, [u.id]: { ...form, note: e.target.value } }))} />
                  <Button disabled={loading || !Number(form.amount)} onClick={() => void run(() => walletService.adjustUser(u.id, { amount: Number(form.amount), type: 'credit', note: form.note }), 'User wallet credited')}>Add Points</Button>
                  <Button variant="secondary" disabled={loading || !Number(form.amount)} onClick={() => void run(() => walletService.adjustUser(u.id, { amount: Number(form.amount), type: 'debit', note: form.note }), 'User wallet debited')}>Deduct</Button>
                </div>
              </div>
            )
          })}
          {!users.length && <p className="text-sm text-white/50">No users found.</p>}
        </div>
      </div>
    </div>
  )
}
