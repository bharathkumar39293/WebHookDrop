import React, { useState } from 'react';
import { eventsApi } from '../api/client';
import { Send, Terminal, CheckCircle2 } from 'lucide-react';

const SendEvent: React.FC = () => {
    const [payload, setPayload] = useState('{\n  "event": "user.signed_up",\n  "user": {\n    "id": "123",\n    "name": "Bharath",\n    "plan": "premium"\n  }\n}');
    const [submitting, setSubmitting] = useState(false);
    const [result, setResult] = useState<any>(null);

    const handleSend = async () => {
        try {
            const parsed = JSON.parse(payload);
            setSubmitting(true);
            const res = await eventsApi.send(parsed);
            setResult(res);
            setTimeout(() => setResult(null), 5000);
        } catch (err: any) {
            alert('Invalid JSON or server error: ' + err.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                        <Terminal className="w-5 h-5 text-indigo-600" />
                        Fire Webhook Event
                    </h2>
                    {result && (
                        <div className="flex items-center gap-2 text-emerald-600 text-sm font-medium animate-in fade-in slide-in-from-top-2">
                            <CheckCircle2 className="w-4 h-4" />
                            Event fired! Fan-out to {result.deliveryCount} endpoints.
                        </div>
                    )}
                </div>

                <p className="text-sm text-gray-500">
                    Enter a JSON payload below and click Send. This will fan-out delivery jobs to all registered endpoints.
                </p>

                <textarea
                    value={payload}
                    onChange={(e) => setPayload(e.target.value)}
                    rows={10}
                    className="w-full font-mono text-sm p-4 bg-slate-900 text-emerald-400 rounded-lg border-2 border-slate-800 focus:border-indigo-500 outline-none transition-all shadow-inner"
                    spellCheck={false}
                />

                <div className="flex justify-end">
                    <button
                        onClick={handleSend}
                        disabled={submitting}
                        className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-2"
                    >
                        <Send className="w-4 h-4" />
                        {submitting ? 'Firing...' : 'Send Event'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SendEvent;
