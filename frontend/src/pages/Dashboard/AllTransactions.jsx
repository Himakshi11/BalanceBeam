import React, { useEffect, useState, useMemo } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import { UseUserAuth } from '../../hooks/UseUserAuth'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/api.Paths'
import { addThousandsSeparator } from '../../utils/helper'
import toast from 'react-hot-toast'
import DeleteAlert from '../../components/DeleteAlert'
import Modal from '../../components/Modal'

const ITEMS_PER_PAGE = 10

function AllTransactions() {
  UseUserAuth()

  const [incomeData, setIncomeData]   = useState([])
  const [expenseData, setExpenseData] = useState([])
  const [loading, setLoading]         = useState(false)

  const [openDeleteAlert, setOpenDeleteAlert] = useState({ show: false, data: null })

  // Filters
  const [search, setSearch]               = useState('')
  const [typeFilter, setTypeFilter]       = useState('all')
  const [fromDate, setFromDate]           = useState('')
  const [toDate, setToDate]               = useState('')
  const [currentPage, setCurrentPage]     = useState(1)

  // ─── Fetch ────────────────────────────────────────────────────────────────

  const fetchAll = async () => {
    if (loading) return
    setLoading(true)
    try {
      const [incRes, expRes] = await Promise.all([
        axiosInstance.get(API_PATHS.INCOME.GET_ALL_INCOME),
        axiosInstance.get(API_PATHS.EXPENSE.GET_ALL_EXPENSE),
      ])
      setIncomeData(incRes.data  || [])
      setExpenseData(expRes.data || [])
    } catch (err) {
      console.error('Error fetching transactions:', err)
      toast.error('Failed to load transactions.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAll() }, [])

  // ─── Delete ───────────────────────────────────────────────────────────────

  const handleDelete = async () => {
    const { id, type } = openDeleteAlert.data
    try {
      if (type === 'income') {
        await axiosInstance.delete(API_PATHS.INCOME.DELETE_INCOME(id))
      } else {
        await axiosInstance.delete(API_PATHS.EXPENSE.DELETE_EXPENSE(id))
      }
      toast.success('Transaction deleted successfully')
      setOpenDeleteAlert({ show: false, data: null })
      fetchAll()
    } catch (err) {
      console.error('Error deleting:', err.response?.data?.message || err.message)
      toast.error('Failed to delete transaction.')
    }
  }

  // ─── Download ─────────────────────────────────────────────────────────────

  const handleDownload = async (type) => {
  try {
    const targets = type === 'all'
      ? [
          { path: API_PATHS.INCOME.DOWNLOAD_INCOME,   filename: 'income_details.xlsx'  },
          { path: API_PATHS.EXPENSE.DOWNLOAD_EXPENSE, filename: 'expense_details.xlsx' },
        ]
      : type === 'income'
        ? [{ path: API_PATHS.INCOME.DOWNLOAD_INCOME,   filename: 'income_details.xlsx'  }]
        : [{ path: API_PATHS.EXPENSE.DOWNLOAD_EXPENSE, filename: 'expense_details.xlsx' }]

    for (const target of targets) {
      const response = await axiosInstance.get(target.path, { responseType: 'blob' })
      const url  = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href  = url
      link.setAttribute('download', target.filename)
      document.body.appendChild(link)
      link.click()
      link.parentNode.removeChild(link)
      window.URL.revokeObjectURL(url)
    }

    toast.success('Downloaded successfully')
  } catch (err) {
    console.error('Error downloading:', err)
    toast.error('Failed to download. Please try again.')
  }
}

  // ─── Merge + Filter + Paginate ────────────────────────────────────────────

  const allTransactions = useMemo(() => {
    const incomes  = incomeData.map(t  => ({ ...t, type: 'income',  label: t.source   }))
    const expenses = expenseData.map(t => ({ ...t, type: 'expense', label: t.category }))
    return [...incomes, ...expenses].sort((a, b) => new Date(b.date) - new Date(a.date))
  }, [incomeData, expenseData])

  const filtered = useMemo(() => {
    return allTransactions.filter(t => {
      const matchSearch = !search   || t.label?.toLowerCase().includes(search.toLowerCase())
      const matchType   = typeFilter === 'all' || t.type === typeFilter
      const tDate       = new Date(t.date)
      const matchFrom   = !fromDate || tDate >= new Date(fromDate)
      const matchTo     = !toDate   || tDate <= new Date(toDate)
      return matchSearch && matchType && matchFrom && matchTo
    })
  }, [allTransactions, search, typeFilter, fromDate, toDate])

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginated  = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  // Summary from filtered list
  const totalIncome  = filtered.filter(t => t.type === 'income') .reduce((s, t) => s + Number(t.amount), 0)
  const totalExpense = filtered.filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0)
  const totalBalance = totalIncome - totalExpense

  const resetFilters = () => { setSearch(''); setTypeFilter('all'); setFromDate(''); setToDate(''); setCurrentPage(1) }
  const onFilterChange = (setter) => (e) => { setter(e.target.value); setCurrentPage(1) }

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })


  return (
    <DashboardLayout activeMenu="All Transactions">
      <div className="my-5 mx-auto">

        {/* Page header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-semibold text-gray-800">All Transactions</h2>
          <div className="flex gap-2">
           {/* Right: Download buttons */}
<div className="flex gap-2">
  <button
    onClick={() => handleDownload('income')}
    className="flex items-center gap-2 text-sm border border-gray-300 rounded-lg px-4 py-1.5 hover:bg-gray-50 text-gray-700 transition-colors"
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="7 10 12 15 17 10"/>
      <line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
    Download Income
  </button>

  <button
    onClick={() => handleDownload('expense')}
    className="flex items-center gap-2 text-sm border border-gray-300 rounded-lg px-4 py-1.5 hover:bg-gray-50 text-gray-700 transition-colors"
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="7 10 12 15 17 10"/>
      <line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
    Download Expense
  </button>
  <button
  onClick={() => handleDownload('all')}
  className="flex items-center gap-2 text-sm border border-gray-300 rounded-lg px-4 py-1.5 hover:bg-gray-50 text-gray-700 transition-colors"
>
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/>
    <line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
  Download All
</button>
</div>
          </div>
        </div>

        {/* Summary cards — reflect current filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
          <SummaryCard label="Balance"       value={totalBalance} color="text-orange-500" bg="bg-orange-50" />
          <SummaryCard label="Total Income"  value={totalIncome}  color="text-green-600"  bg="bg-green-50"  />
          <SummaryCard label="Total Expense" value={totalExpense} color="text-red-500"    bg="bg-red-50"    />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-4">
          <input
            type="text"
            placeholder="Search by source / category…"
            value={search}
            onChange={onFilterChange(setSearch)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-56 outline-none focus:ring-2 focus:ring-violet-200"
          />
          <select
            value={typeFilter}
            onChange={onFilterChange(setTypeFilter)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none"
          >
            <option value="all">All Types</option>
            <option value="income">Income Only</option>
            <option value="expense">Expense Only</option>
          </select>
          <div className="flex items-center gap-1">
            <label className="text-xs text-gray-500">From</label>
            <input type="date" value={fromDate} onChange={onFilterChange(setFromDate)}
              className="border border-gray-200 rounded-lg px-2 py-2 text-sm outline-none" />
          </div>
          <div className="flex items-center gap-1">
            <label className="text-xs text-gray-500">To</label>
            <input type="date" value={toDate} onChange={onFilterChange(setToDate)}
              className="border border-gray-200 rounded-lg px-2 py-2 text-sm outline-none" />
          </div>
          {(search || typeFilter !== 'all' || fromDate || toDate) && (
            <button onClick={resetFilters}
              className="text-xs text-gray-400 hover:text-red-500 underline self-center">
              Clear filters
            </button>
          )}
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <p className="text-center py-12 text-gray-400 text-sm">Loading transactions…</p>
          ) : paginated.length === 0 ? (
            <p className="text-center py-12 text-gray-400 text-sm">No transactions match your filters.</p>
          ) : (
            <table className="w-full text-sm">
  <thead className="bg-gray-50 text-gray-500 text-xs uppercase border-b border-gray-100">
    <tr>
      <th className="px-5 py-4 text-left w-10">#</th>
      <th className="px-5 py-4 text-left">Source / Category</th>
      <th className="px-5 py-4 text-left">Type</th>        {/* ✅ make sure this exists */}
      <th className="px-5 py-4 text-left">Date</th>
      <th className="px-5 py-4 text-right">Amount</th>
      <th className="px-5 py-4 text-center">Action</th>
    </tr>
  </thead>
  <tbody>
    {paginated.map((t, i) => (
      <tr key={t._id || i} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">

        {/* # */}
        <td className="px-5 py-5 text-gray-400 text-sm">
          {(currentPage - 1) * ITEMS_PER_PAGE + i + 1}
        </td>

        {/* Source / Category */}
        <td className="px-5 py-5">
          <div className="flex items-center gap-3">
            {t.icon && (
              <span className="w-9 h-9 flex items-center justify-center bg-gray-100 rounded-full overflow-hidden shrink-0">
                {t.icon.startsWith('http') ? (
                  <img src={t.icon} alt="icon" className="w-6 h-6 object-contain" />
                ) : (
                  <span className="text-lg">{t.icon}</span>
                )}
              </span>
            )}
            <span className="font-medium text-gray-800">{t.label}</span>
          </div>
        </td>

        {/* Type — was missing or hidden */}
        <td className="px-5 py-5">
          <span className={`text-xs px-3 py-1.5 rounded-full font-medium ${
            t.type === 'income'
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-600'
          }`}>
            {t.type === 'income' ? 'Income' : 'Expense'}
          </span>
        </td>

        {/* Date */}
        <td className="px-5 py-5 text-gray-500">{formatDate(t.date)}</td>

        {/* Amount */}
        <td className={`px-5 py-5 text-right font-semibold text-base ${
          t.type === 'income' ? 'text-green-600' : 'text-red-500'
        }`}>
          {t.type === 'income' ? '+' : '-'} ₹{addThousandsSeparator(t.amount)}
        </td>

        {/* Action */}
        <td className="px-5 py-5 text-center">
          <button
            onClick={() => setOpenDeleteAlert({ show: true, data: { id: t._id, type: t.type } })}
            className="card-btn"
          >
            Delete
          </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 text-xs text-gray-500">
              <span>
                Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–
                {Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} of {filtered.length}
              </span>
              <div className="flex gap-1">
                <PageBtn onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>‹</PageBtn>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <PageBtn key={p} onClick={() => setCurrentPage(p)} active={p === currentPage}>{p}</PageBtn>
                ))}
                <PageBtn onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>›</PageBtn>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Modal */}
      <Modal
        isOpen={openDeleteAlert.show}
        onClose={() => setOpenDeleteAlert({ show: false, data: null })}
        title="Delete Transaction"
      >
        <DeleteAlert
          content="Are you sure you want to delete this transaction?"
          onDelete={handleDelete}
        />
      </Modal>
    </DashboardLayout>
  )
}

// ─── Small helpers ────────────────────────────────────────────────────────────

function SummaryCard({ label, value, color, bg }) {
  return (
    <div className={`${bg} rounded-2xl p-4`}>
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className={`text-2xl font-semibold ${color}`}>
        ₹{addThousandsSeparator(value)}
      </p>
    </div>
  )
}

function PageBtn({ children, onClick, disabled, active }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-7 h-7 rounded-lg border text-xs transition-colors
        ${active    ? 'bg-violet-100 text-violet-700 border-violet-300' : 'border-gray-200 hover:bg-gray-50'}
        ${disabled  ? 'opacity-30 cursor-not-allowed' : ''}
      `}
    >
      {children}
    </button>
  )
}

export default AllTransactions