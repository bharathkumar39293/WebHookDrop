import React, { useState, useEffect } from 'react';
import { endpointsApi } from '../api/client';
import { Plus, Globe, Shield, Tag, Loader2 } from 'lucide-react';

const Endpoints: React.FC = () => {
    const [endpoints, setEndpoints] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [url, setUrl] = useState('');
    const [secret, setSecret] = useState('');
    const [label, setLabel] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        loadEndpoints();
    }, []);

    const loadEndpoints = async () => {
        try {
            const data = await endpointsApi.list();
            setEndpoints(data);
        } catch (err) {
            console.error('Failed to load endpoints', err);
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await endpointsApi.create({ url, secret, label });
            setUrl('');
            setSecret('');
            setLabel('');
            await loadEndpoints();
        } catch (err: any) {
            const errorMsg = err.response?.data?.error || err.message;
            alert('Failed to register endpoint: ' + errorMsg);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <Plus className="w-5 h-5 text-indigo-600" />
                    Register New Endpoint
                </h2>
                <form onSubmit={handleRegister} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Endpoint URL</label>
                        <div className="relative">
                            <Globe className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                            <input
                                type="url"
                                required
                                placeholder="https://yourapp.com/webhooks"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                            />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Signing Secret</label>
                        <div className="relative">
                            <Shield className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                            <input
                                type="text"
                                required
                                placeholder="secret-key"
                                value={secret}
                                onChange={(e) => setSecret(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                            />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Label (Optional)</label>
                        <div className="relative">
                            <Tag className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Production API"
                                value={label}
                                onChange={(e) => setLabel(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                            />
                        </div>
                    </div>
                    <div className="md:col-span-3 flex justify-end pt-2">
                        <button
                            disabled={submitting}
                            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-2"
                        >
                            {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                            Register Endpoint
                        </button>
                    </div>
                </form>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/50">
                    <h3 className="font-semibold text-gray-900">Registered Endpoints</h3>
                </div>
                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="p-12 flex justify-center text-gray-500">
                            <Loader2 className="w-8 h-8 animate-spin" />
                        </div>
                    ) : endpoints.length === 0 ? (
                        <div className="p-12 text-center text-gray-500">
                            No endpoints registered yet.
                        </div>
                    ) : (
                        <table className="w-full text-left">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Label</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">URL</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Secret</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase text-right">Registered</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {endpoints.map((ep) => (
                                    <tr key={ep.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900">{ep.label || '—'}</td>
                                        <td className="px-6 py-4 text-gray-600 truncate max-w-xs">{ep.url}</td>
                                        <td className="px-6 py-4 text-xs font-mono text-gray-400">
                                            {ep.secret.substring(0, 4)}••••••••
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500 text-right">
                                            {new Date(ep.created_at).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Endpoints;
