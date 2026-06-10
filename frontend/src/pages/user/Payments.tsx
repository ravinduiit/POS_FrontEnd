import { useEffect, useMemo, useState } from 'react'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { walletService } from '../../features/wallet/wallet.service'
import type { WalletOverview } from '../../features/wallet/wallet.types'
import { formatDateTime } from '../../utils/date'
import { formatMoney } from '../../utils/money'

const bankAccounts = [
  { bankName: 'SAMPATH BANK PLC', accountName: 'Kasun Yapa', accountNumber: '1179 5288 2963', branch: 'AKURESSA BRANCH' },
  { bankName: 'COMMERCIAL BANK', accountName: 'KASUN YAPA', accountNumber: '8120068934', branch: 'AKURESSA BRANCH' },
]

function tone(status: string) {
  if (status === 'APPROVED' || status === 'COMPLETED') return 'green'
  if (status === 'REJECTED') return 'red'
  return 'yellow'
}

export default function Payments() {
  const [overview, setOverview] = useState<WalletOverview | null>(null)
  const [topUpAmount, setTopUpAmount] = useState('')
  const [slip, setSlip] = useState<File | null>(null)
  const [withdraw, setWithdraw] = useState({ amount: '', accountName: '', accountNumber: '', bankName: '', branchName: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const load = async () => {
    const res = await walletService.mine()
    if (!res.ok) return setError(res.error)
    setOverview(res.data)
  }

  useEffect(() => { void load() }, [])

  const submitTopUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null); setMessage(null)
    const amount = Number(topUpAmount)
    if (!amount || amount <= 0) return setError('Enter valid top-up amount')
    if (!slip) return setError('Upload payment slip')
    setLoading(true)
    const res = await walletService.topUp(amount, slip)
    setLoading(false)
    if (!res.ok) return setError(res.error)
    setTopUpAmount(''); setSlip(null)
    setMessage('Top-up request submitted. Admin will review your slip and add points to your wallet.')
    await load()
  }

  const submitWithdrawal = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null); setMessage(null)
    const amount = Number(withdraw.amount)
    if (!amount || amount <= 0) return setError('Enter valid withdrawal amount')
    setLoading(true)
    const res = await walletService.withdraw({ ...withdraw, amount })
    setLoading(false)
    if (!res.ok) return setError(res.error)
    setWithdraw({ amount: '', accountName: '', accountNumber: '', bankName: '', branchName: '' })
    setMessage('Withdrawal request submitted. Admin will send money manually after checking your request.')
    await load()
  }

  const history = useMemo(() => overview?.transactions ?? [], [overview])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Wallet</h1>
        <p className="mt-1 text-sm text-white/55">1 point = Rs. 1. Top up your wallet, buy grid and raffle tickets, and request withdrawals.</p>
      </div>
      {error && <p className="text-sm text-rose-300">{error}</p>}
      {message && <p className="text-sm text-emerald-300">{message}</p>}

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="blx-panel p-6">
          <div className="text-sm text-white/55">Available Wallet Balance</div>
          <div className="mt-2 text-4xl font-semibold">{formatMoney(overview?.balance ?? 0)}</div>
          <div className="mt-2 text-sm text-white/55">You can use this balance to buy all grid tickets and raffle tickets instantly.</div>
        </div>

        <div className="blx-panel p-6">
          <h2 className="text-lg font-semibold">Bank Details for Top-up</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {bankAccounts.map((a) => (
              <div key={a.accountNumber} className="rounded-xl border border-white/10 bg-black/20 p-4 text-sm text-white/70">
                <div>Bank: {a.bankName}</div>
                <div>Account Name: {a.accountName}</div>
                <div>Account Number: {a.accountNumber}</div>
                <div>Branch: {a.branch}</div>
              </div>
            ))}
          </div>
          <img src="/payment-qr.jpg" alt="Payment QR" className="mt-4 max-w-xs rounded-2xl border border-white/10 bg-white p-2" />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <form className="blx-panel p-6 space-y-4" onSubmit={submitTopUp}>
          <h2 className="text-lg font-semibold">Top Up Wallet</h2>
          <Input type="number" min="1" placeholder="Amount / Points" value={topUpAmount} onChange={(e) => setTopUpAmount(e.target.value)} />
          <Input type="file" accept="image/*,.pdf" onChange={(e) => setSlip(e.target.files?.[0] || null)} />
          <p className="text-sm text-white/50">Upload the bank deposit/transfer slip. Admin approval will add points to your wallet.</p>
          <Button type="submit" disabled={loading}>{loading ? 'Submitting…' : 'Submit Top-up Request'}</Button>
        </form>

        <form className="blx-panel p-6 space-y-4" onSubmit={submitWithdrawal}>
          <h2 className="text-lg font-semibold">Request Withdrawal</h2>
          <Input type="number" min="1" placeholder="Amount / Points" value={withdraw.amount} onChange={(e) => setWithdraw((p) => ({ ...p, amount: e.target.value }))} />
          <Input placeholder="Account Name" value={withdraw.accountName} onChange={(e) => setWithdraw((p) => ({ ...p, accountName: e.target.value }))} />
          <Input placeholder="Account Number" value={withdraw.accountNumber} onChange={(e) => setWithdraw((p) => ({ ...p, accountNumber: e.target.value }))} />
          <Input placeholder="Bank Name" value={withdraw.bankName} onChange={(e) => setWithdraw((p) => ({ ...p, bankName: e.target.value }))} />
          <Input placeholder="Branch Name" value={withdraw.branchName} onChange={(e) => setWithdraw((p) => ({ ...p, branchName: e.target.value }))} />
          <p className="text-sm text-white/50">Requested points are held immediately so they cannot be spent twice. If admin rejects, points are returned.</p>
          <Button type="submit" disabled={loading}>{loading ? 'Submitting…' : 'Request Withdrawal'}</Button>
        </form>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="blx-panel p-6">
          <h2 className="text-lg font-semibold">Top-up Requests</h2>
          <div className="mt-4 space-y-3">
            {(overview?.topUps ?? []).map((item) => (
              <div key={item.id} className="rounded-xl border border-white/10 p-4 text-sm">
                <div className="flex justify-between gap-3"><span>{item.reference}</span><Badge tone={tone(item.status) as any}>{item.status}</Badge></div>
                <div className="mt-1 text-white/60">Amount: {formatMoney(item.amount)}</div>
                <div className="text-white/45">{formatDateTime(item.createdAt)}</div>
                {item.rejectionReason && <div className="mt-1 text-rose-300">Reason: {item.rejectionReason}</div>}
              </div>
            ))}
            {!(overview?.topUps ?? []).length && <p className="text-sm text-white/50">No top-up requests yet.</p>}
          </div>
        </div>

        <div className="blx-panel p-6">
          <h2 className="text-lg font-semibold">Withdrawal Requests</h2>
          <div className="mt-4 space-y-3">
            {(overview?.withdrawals ?? []).map((item) => (
              <div key={item.id} className="rounded-xl border border-white/10 p-4 text-sm">
                <div className="flex justify-between gap-3"><span>{item.reference}</span><Badge tone={tone(item.status) as any}>{item.status}</Badge></div>
                <div className="mt-1 text-white/60">Amount: {formatMoney(item.amount)}</div>
                <div className="text-white/60">{item.bankName} • {item.accountNumber}</div>
                <div className="text-white/45">{formatDateTime(item.createdAt)}</div>
                {item.rejectionReason && <div className="mt-1 text-rose-300">Reason: {item.rejectionReason}</div>}
              </div>
            ))}
            {!(overview?.withdrawals ?? []).length && <p className="text-sm text-white/50">No withdrawal requests yet.</p>}
          </div>
        </div>
      </div>

      <div className="blx-panel p-6">
        <h2 className="text-lg font-semibold">Wallet Transaction History</h2>
        <div className="mt-4 space-y-3">
          {history.map((tx) => (
            <div key={tx.id} className="rounded-xl border border-white/10 p-4 text-sm">
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="font-medium">{tx.description || tx.type}</div>
                  <div className="text-white/45">{tx.reference || '—'} • {formatDateTime(tx.createdAt)}</div>
                </div>
                <div className="text-right">
                  <div className={tx.amount >= 0 ? 'text-emerald-300' : 'text-rose-300'}>{tx.amount >= 0 ? '+' : ''}{formatMoney(tx.amount)}</div>
                  <div className="text-white/45">Balance: {formatMoney(tx.balanceAfter)}</div>
                </div>
              </div>
            </div>
          ))}
          {!history.length && <p className="text-sm text-white/50">No wallet transactions yet.</p>}
        </div>
      </div>
    </div>
  )
}
