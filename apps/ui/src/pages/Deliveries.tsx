import React, { useState, useEffect } from 'react';
import { deliveriesApi } from '../api/client';
import StatusBadge from '../components/StatusBadge';
import { RefreshCcw, Search, ChevronLeft, ChevronRight, Activity, AlertCircle } from 'lucide-react';

const Deliveries: React.FC = () => {
    const [deliveries, setDeliveries] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [status, setStatus] = useState('');
    const [retryingId, setRetryingId] = useState<string | null>(null);

    useEffect(() => {
        loadDeliveries();
    }, [page, status]);

    const loadDeliveries = async () => {
        setLoading(true);
        try {
            const data = await deliveriesApi.list({ page, limit: 10, status });
            setDeliveries(data);
        } catch (err) {
            console.error('Failed to load deliveries', err);
        } finally {
            setLoading(false);
        }
    };

    const handleRetry = async (id: string) => {
        setRetryingId(id);
        try {
            await deliveriesApi.retry(id);
            loadDeliveries();
        } catch (err: any) {
            const errorMsg = err.response?.data?.error || err.message;
            alert('Failed to retry delivery: ' + errorMsg);
        } finally {
            setRetryingId(null);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Activity className="w-5 h-5 text-indigo-600" />
                    Delivery Logs
                </h2>

                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-48">
                        <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                        <select
                            value={status}
                            onChange={(e) => { setStatus(e.target.value); setPage(1); }}
                            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg appearance-none text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="">All Statuses</option>
                            <option value="delivered">Delivered</option>
                            <option value="retrying">Retrying</option>
                            <option value="dead">Dead</option>
                        </select>
                    </div>
                    <button
                        onClick={() => loadDeliveries()}
                        className="p-2.5 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors"
                    >
                        <RefreshCcw className={loading ? 'w-4 h-4 animate-spin' : 'w-4 h-4 text-gray-600'} />
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Event ID</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase text-center">Attempts</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Last Response</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Timestamp</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 italic-last-response">
                            {loading && deliveries.length === 0 ? (
                                <tr><td colSpan={6} className="p-12 text-center text-gray-400">Loading...</td></tr>
                            ) : deliveries.length === 0 ? (
                                <tr><td colSpan={6} className="p-12 text-center text-gray-400">No deliveries found.</td></tr>
                            ) : (
                                deliveries.map((d) => (
                                    <tr key={d.id} className="hover:bg-gray-50/80 transition-colors">
                                        <td className="px-6 py-4"><StatusBadge status={d.status} /></td>
                                        <td className="px-6 py-4 text-xs font-mono text-gray-500">{d.event_id.substring(0, 8)}...</td>
                                        <td className="px-6 py-4 text-center text-sm font-medium">
                                            {d.attempts} / {d.max_attempts}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            {d.last_response ? (
                                                <span className={d.last_response === '200' ? 'text-emerald-600' : 'text-rose-600'}>
                                                    {d.last_response}
                                                </span>
                                            ) : '—'}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                                            {new Date(d.created_at).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {d.status === 'dead' && (
                                                <button
                                                    onClick={() => handleRetry(d.id)}
                                                    disabled={retryingId === d.id}
                                                    className="text-xs font-semibold py-1 px-3 bg-indigo-50 text-indigo-700 rounded-md hover:bg-indigo-100 transition-colors disabled:opacity-50 inline-flex items-center gap-1"
                                                >
                                                    <RefreshCcw className={retryingId === d.id ? "w-3 h-3 animate-spin" : "w-3 h-3"} />
                                                    Manual Retry
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center text-sm">
                    <span className="text-gray-500 font-medium">Page {page}</span>
                    <div className="flex gap-2">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage(p => p - 1)}
                            className="p-1.5 rounded-md border border-gray-300 disabled:opacity-30 hover:bg-white transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            disabled={deliveries.length < 10}
                            onClick={() => setPage(p => p + 1)}
                            className="p-1.5 rounded-md border border-gray-300 disabled:opacity-30 hover:bg-white transition-colors"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {deliveries.some(d => d.status === 'dead') && (
                <div className="flex items-center gap-2 p-4 bg-amber-50 rounded-lg border border-amber-200 text-amber-800 text-sm">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <p>You have "Dead" deliveries. This usually means the target server failed 5 times in a row. You can manually retry them once the target server is back up.</p>
                </div>
            )}
        </div>
    );
};

export default Deliveries;
