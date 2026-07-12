import React, { useState } from 'react';
import { HelpCircle, Mail, Phone, BookOpen, Clock, FileQuestion, Send } from 'lucide-react';
import { toast } from 'sonner';
import { useSelector } from 'react-redux';
import { RootState } from '../store/index.ts';
import api from '../lib/axios.ts';

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

    try {
      setIsSubmitting(true);
      
      // Mocking the backend call to submit a ticket
      // await api.post('/support/tickets', { subject, priority, message });
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Support ticket submitted successfully. Our team will contact you shortly.');
      setSubject('');
      setPriority('Medium');
      setMessage('');
    } catch (error) {
      toast.error('Failed to submit ticket');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto animate-fade-in font-sans text-gray-800 dark:text-zinc-200">
      <div>
        <h1 className="text-2xl font-black text-gray-900 dark:text-zinc-100 tracking-tight">
          Helpdesk &amp; Support
        </h1>
        <p className="text-xs font-semibold text-gray-500 dark:text-zinc-400 mt-1">
          Access regional helplines or submit a diagnostic ticket.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left column: Ticket Form */}
        <div className="lg:col-span-2 bg-white dark:bg-zinc-900 rounded border border-gray-200 dark:border-zinc-800 p-6 shadow-sm">
          <h2 className="text-sm font-bold text-gray-900 dark:text-zinc-100 mb-4 pb-2 border-b border-gray-100 dark:border-zinc-800">
            Submit a New Ticket
          </h2>
          
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider mb-1">
                  Requester
                </label>
                <input 
                  type="text" 
                  value={user?.name || ''} 
                  disabled 
                  className="w-full rounded border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800/50 px-3 py-2 text-xs text-gray-500 dark:text-zinc-400 cursor-not-allowed" 
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider mb-1">
                  Priority Level
                </label>
                <select 
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full rounded border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-xs text-gray-800 dark:text-zinc-200 focus:border-[#714B67] focus:ring-1 focus:ring-[#714B67] outline-none transition-all"
                >
                  <option value="Low">Low - General Inquiry</option>
                  <option value="Medium">Medium - System Glitch</option>
                  <option value="High">High - Blocker</option>
                  <option value="Critical">Critical - Safety/Outage</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider mb-1">
                Subject
              </label>
              <input 
                type="text" 
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Brief description of the issue"
                className="w-full rounded border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-xs text-gray-800 dark:text-zinc-200 focus:border-[#714B67] focus:ring-1 focus:ring-[#714B67] outline-none transition-all" 
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider mb-1">
                Message Details
              </label>
              <textarea 
                rows={5}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Provide steps to reproduce or details about your request..."
                className="w-full rounded border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-xs text-gray-800 dark:text-zinc-200 focus:border-[#714B67] focus:ring-1 focus:ring-[#714B67] outline-none transition-all resize-none" 
              ></textarea>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 rounded bg-[#714B67] px-4 py-2 text-xs font-bold text-white hover:bg-[#5e3b56] transition-colors shadow-sm disabled:opacity-50"
              >
                <Send className="h-3.5 w-3.5" />
                {isSubmitting ? 'Submitting...' : 'Submit Ticket'}
              </button>
            </div>
          </form>
        </div>

        {/* Right column: Quick contacts */}
        <div className="space-y-4">
          <div className="rounded bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 p-4 shadow-sm flex items-start gap-3">
            <div className="h-8 w-8 bg-purple-50 dark:bg-purple-950/30 text-[#714B67] dark:text-purple-400 rounded flex items-center justify-center shrink-0">
              <Phone className="h-4 w-4" />
            </div>
            <div>
              <span className="block text-xs font-bold text-gray-900 dark:text-zinc-100">Emergency Helpline</span>
              <p className="text-[10px] text-gray-500 dark:text-zinc-400 mt-0.5 mb-1.5">
                24/7 desk for active pilots facing road blockades or medical issues.
              </p>
              <span className="text-xs font-black text-[#714B67] dark:text-purple-300">+91 1800 555 9800</span>
            </div>
          </div>

          <div className="rounded bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 p-4 shadow-sm flex items-start gap-3">
            <div className="h-8 w-8 bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 rounded flex items-center justify-center shrink-0">
              <Mail className="h-4 w-4" />
            </div>
            <div>
              <span className="block text-xs font-bold text-gray-900 dark:text-zinc-100">Direct Email Desk</span>
              <p className="text-[10px] text-gray-500 dark:text-zinc-400 mt-0.5 mb-1.5">
                For non-urgent operational queries and billing support.
              </p>
              <span className="text-xs font-black text-blue-600 dark:text-blue-400">helpdesk@transitops.in</span>
            </div>
          </div>

          <div className="rounded bg-gray-50 dark:bg-zinc-900/50 border border-gray-200 dark:border-zinc-800 p-4 shadow-sm flex items-start gap-3">
            <div className="h-8 w-8 bg-gray-200 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400 rounded flex items-center justify-center shrink-0">
              <Clock className="h-4 w-4" />
            </div>
            <div>
              <span className="block text-xs font-bold text-gray-900 dark:text-zinc-100">SLA Guarantees</span>
              <p className="text-[10px] text-gray-500 dark:text-zinc-400 mt-1 leading-relaxed">
                • High: &lt; 2 hrs Response<br />
                • Medium: &lt; 24 hrs Response<br />
                • Low: &lt; 48 hrs Response
              </p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
