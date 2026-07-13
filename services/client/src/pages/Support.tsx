import React, { useState } from 'react';
import { HelpCircle, Mail, Phone, Clock, Send, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useSelector } from 'react-redux';
import { RootState } from '../store/index';

export const Support: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [subject, setSubject] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !message) {
      toast.error('Please fill out all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Support ticket submitted successfully. Our team will contact you shortly.');
      setSubject('');
      setPriority('Medium');
      setMessage('');
    } catch {
      toast.error('Failed to submit ticket');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto">
      <div>
        <h1 className="text-2xl font-black text-gray-900 dark:text-zinc-100 tracking-tight">Help & Support</h1>
        <p className="text-xs font-semibold text-gray-500 dark:text-zinc-400 mt-1">Submit a support ticket or contact our helpdesk.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="lg:col-span-2 bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-6 shadow-sm">
          <h2 className="text-sm font-bold text-gray-900 dark:text-zinc-100 mb-4 pb-2 border-b border-gray-100 dark:border-zinc-800">
            Submit a Ticket
          </h2>
          
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase mb-1">Name</label>
                <input type="text" value={user?.name || ''} disabled className="w-full rounded-lg border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 px-3 py-2 text-xs text-gray-500 cursor-not-allowed" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase mb-1">Priority</label>
                <select value={priority} onChange={(e) => setPriority(e.target.value)} className="w-full rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-xs font-bold focus:border-[#714B67] focus:outline-none">
                  <option value="Low">Low - General Inquiry</option>
                  <option value="Medium">Medium - System Issue</option>
                  <option value="High">High - Blocker</option>
                  <option value="Critical">Critical - Emergency</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase mb-1">Subject *</label>
              <input type="text" required value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Brief description of the issue" className="w-full rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-xs focus:border-[#714B67] focus:outline-none" />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase mb-1">Message *</label>
              <textarea rows={5} required value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Describe your issue in detail..." className="w-full rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-xs focus:border-[#714B67] focus:outline-none resize-none" />
            </div>

            <div className="flex justify-end pt-2">
              <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 rounded-xl bg-[#714B67] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#5e3b56] transition-colors shadow-sm disabled:opacity-50">
                {isSubmitting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                {isSubmitting ? 'Submitting...' : 'Submit Ticket'}
              </button>
            </div>
          </form>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 p-4 shadow-sm flex items-start gap-3">
            <div className="h-8 w-8 bg-purple-50 dark:bg-purple-950/30 text-[#714B67] rounded-lg flex items-center justify-center shrink-0">
              <Phone className="h-4 w-4" />
            </div>
            <div>
              <span className="block text-xs font-bold text-gray-900 dark:text-zinc-100">Emergency Helpline</span>
              <p className="text-[10px] text-gray-500 dark:text-zinc-400 mt-0.5 mb-1.5">24/7 support for critical issues</p>
              <span className="text-xs font-black text-[#714B67] dark:text-purple-300">+91 1800 555 9800</span>
            </div>
          </div>

          <div className="rounded-xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 p-4 shadow-sm flex items-start gap-3">
            <div className="h-8 w-8 bg-blue-50 dark:bg-blue-950/30 text-blue-600 rounded-lg flex items-center justify-center shrink-0">
              <Mail className="h-4 w-4" />
            </div>
            <div>
              <span className="block text-xs font-bold text-gray-900 dark:text-zinc-100">Email Support</span>
              <p className="text-[10px] text-gray-500 dark:text-zinc-400 mt-0.5 mb-1.5">For non-urgent queries</p>
              <span className="text-xs font-black text-blue-600 dark:text-blue-400">helpdesk@transitops.in</span>
            </div>
          </div>

          <div className="rounded-xl bg-gray-50 dark:bg-zinc-900/50 border border-gray-200 dark:border-zinc-800 p-4 shadow-sm flex items-start gap-3">
            <div className="h-8 w-8 bg-gray-200 dark:bg-zinc-800 text-gray-600 rounded-lg flex items-center justify-center shrink-0">
              <Clock className="h-4 w-4" />
            </div>
            <div>
              <span className="block text-xs font-bold text-gray-900 dark:text-zinc-100">SLA Response Times</span>
              <p className="text-[10px] text-gray-500 dark:text-zinc-400 mt-1 leading-relaxed">
                • Critical: &lt; 1 hour<br />
                • High: &lt; 4 hours<br />
                • Medium: &lt; 24 hours<br />
                • Low: &lt; 48 hours
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};