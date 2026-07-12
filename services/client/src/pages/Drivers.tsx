import React, { useState, useEffect } from 'react';
import { useDrivers } from '../hooks/useDrivers.ts';
import { Driver } from '../store/slices/driverSlice.ts';
import { 
  Users, CheckCircle2, AlertTriangle, Search, SlidersHorizontal, Plus, 
  Trash2, Edit3, X, Mail, Phone, Award, ShieldCheck, HeartPulse 
} from 'lucide-react';

export const Drivers: React.FC = () => {
  const { drivers, isLoading, loadDrivers, createNewDriver, editDriver, removeDriver, metrics } = useDrivers();

  useEffect(() => {
    loadDrivers();
  }, []);

  // Search/Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);

  // Form Fields
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [licenseNo, setLicenseNo] = useState('');
  const [licenseType, setLicenseType] = useState('Commercial HGV');
  const [licenseExpiry, setLicenseExpiry] = useState('2028-12-31');
  const [medicalStatus, setMedicalStatus] = useState<'Passed' | 'Pending Review' | 'Required Soon'>('Passed');
  const [medicalExpiry, setMedicalExpiry] = useState('2027-06-30');
  const [status, setStatus] = useState<Driver['status']>('Available');
  const [rating, setRating] = useState(4.8);
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [attendance, setAttendance] = useState<'Present' | 'Absent' | 'Off-duty'>('Present');

  const handleOpenAdd = () => {
    setEditingDriver(null);
    setId('DRV0' + (drivers.length + 1));
    setName('New Pilot');
    setLicenseNo('DL-IND' + Math.floor(100000 + Math.random() * 900000));
    setLicenseType('Commercial HGV');
    setLicenseExpiry('2029-06-15');
    setMedicalStatus('Passed');
    setMedicalExpiry('2027-06-15');
    setStatus('Available');
    setRating(5.0);
    setPhone('+91 99000 ' + Math.floor(10000 + Math.random() * 90000));
    setEmail('pilot@transitops.in');
    setAttendance('Present');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (d: Driver) => {
    setEditingDriver(d);
    setId(d.id);
    setName(d.name);
    setLicenseNo(d.licenseNo);
    setLicenseType(d.licenseType);
    setLicenseExpiry(d.licenseExpiry);
    setMedicalStatus(d.medicalStatus);
    setMedicalExpiry(d.medicalExpiry);
    setStatus(d.status);
    setRating(d.rating);
    setPhone(d.phone);
    setEmail(d.email);
    setAttendance(d.attendanceStatus);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newDriver: Driver = {
      id,
      name,
      licenseNo,
      licenseType,
      licenseExpiry,
      medicalStatus,
      medicalExpiry,
      status,
      rating,
      phone,
      email,
      attendanceStatus: attendance,
      tripsCompleted: editingDriver?.tripsCompleted || 0,
      avatar: editingDriver?.avatar || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDYBkw3LHcTwmizgJ3i8YKR18fYqElE3Mg9j2KIiAk20JcN3_h5fi77C0J2BvviOW_QR2oyHcQ1XeYxnzmkweobMewYAuRyAzEJWCwz1f8yi2isPQCNymxtX7N0ODA2q72p8krMwTYMqNCrLU0kY2W6SZhU8o4L_fBJxZlYDMT_ZRzWlderTFed7dQY7vdEiknxiWpdbu7Khs7Et6zBYfdMI_lfWSWZaqHVYJvvx84zfuptWyJN5g9-'
    };

    if (editingDriver) {
      editDriver(newDriver);
    } else {
      createNewDriver(newDriver);
    }
    setIsModalOpen(false);
  };

  const filteredDrivers = drivers.filter(d => {
    const matchesSearch = 
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.licenseNo.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter ? d.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto animate-fade-in">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#1b1c1c] dark:text-zinc-100 tracking-tight">
            Drivers Registry
          </h1>
          <p className="text-xs font-semibold text-gray-500 dark:text-zinc-400">
            Active commercial licensing credentials, biometric logs, and trip compliance indices.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 rounded-xl bg-[#714B67] text-xs font-extrabold text-white hover:bg-[#5e3b56] shadow-md flex items-center gap-1.5 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          Add Driver Profile
        </button>
      </div>

      {/* KPI Stats Panel */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Drivers */}
        <div className="rounded-xl bg-white dark:bg-zinc-900 p-4.5 border border-gray-200 dark:border-zinc-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="block text-[10px] font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">
              Total Active Drivers
            </span>
            <span className="text-2xl font-black text-[#1b1c1c] dark:text-zinc-100 block mt-1">
              {metrics.totalDrivers} Drivers
            </span>
            <span className="text-[10px] text-gray-500 dark:text-zinc-400 font-semibold mt-1 block">
              100% Biometric scanned
            </span>
          </div>
          <div className="h-11 w-11 rounded-xl bg-purple-50 flex items-center justify-center text-[#714B67] shrink-0">
            <Users className="h-5.5 w-5.5" />
          </div>
        </div>

        {/* On Duty Available */}
        <div className="rounded-xl bg-white dark:bg-zinc-900 p-4.5 border border-gray-200 dark:border-zinc-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="block text-[10px] font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">
              Available for Dispatch
            </span>
            <span className="text-2xl font-black text-[#829c62] block mt-1">
              {metrics.availableDriversCount} Drivers
            </span>
            <span className="text-[10px] text-[#829c62] font-semibold mt-1 block">
              Ready for immediate route
            </span>
          </div>
          <div className="h-11 w-11 rounded-xl bg-[#e6fcf5] flex items-center justify-center text-[#006a68] shrink-0">
            <CheckCircle2 className="h-5.5 w-5.5" />
          </div>
        </div>

        {/* Compliant license */}
        <div className="rounded-xl bg-white dark:bg-zinc-900 p-4.5 border border-gray-200 dark:border-zinc-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="block text-[10px] font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">
              License Compliance
            </span>
            <span className="text-2xl font-black text-[#006a68] block mt-1">
              100% Compliant
            </span>
            <span className="text-[10px] text-[#006a68] font-semibold mt-1 block">
              Zero expired licenses
            </span>
          </div>
          <div className="h-11 w-11 rounded-xl bg-[#fdfafc] dark:bg-[#714B67]/20 flex items-center justify-center text-[#714B67] shrink-0">
            <ShieldCheck className="h-5.5 w-5.5" />
          </div>
        </div>
      </div>

      {/* Query Filter Section */}
      <div className="rounded-xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 p-4.5 shadow-sm flex flex-col md:flex-row items-center gap-3">
        <div className="relative w-full">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500 dark:text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search pilots by ID, name, license no..."
            className="w-full rounded-lg border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950 py-2 pl-9 pr-4 text-xs text-[#1b1c1c] dark:text-zinc-100 placeholder-[#80747a] dark:placeholder-zinc-500 focus:border-[#714B67] focus:bg-white dark:focus:bg-zinc-900 dark:bg-zinc-900 focus:outline-none focus:ring-1 focus:ring-[#714B67] transition-all font-medium"
          />
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <select
            value={statusFilter || ''}
            onChange={(e) => setStatusFilter(e.target.value || null)}
            className="rounded-lg border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-2 text-xs font-bold text-[#4d4847] dark:text-zinc-300 focus:outline-none focus:ring-1 focus:ring-[#714B67]"
          >
            <option value="">All Statuses</option>
            <option value="Available">Available</option>
            <option value="On Trip">On Trip</option>
            <option value="On Leave">On Leave</option>
          </select>
          <button className="px-3.5 py-2 rounded-lg border border-gray-200 dark:border-zinc-800 text-xs font-bold text-[#4d4847] dark:text-zinc-300 hover:bg-[#f5f3f3] dark:hover:bg-zinc-800 transition-all flex items-center gap-1.5 cursor-pointer">
            <SlidersHorizontal className="h-4 w-4 text-gray-500 dark:text-zinc-400" />
            Filters
          </button>
        </div>
      </div>

      {/* Drivers Data Table */}
      {/* Drivers Data Table */}
<div className="rounded-xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden flex flex-col">

  <div className="overflow-x-auto">
    <table className="w-full text-left border-collapse">
      <thead className="sticky top-0 z-10">
        <tr className="bg-[#f5f3f3]/95 dark:bg-zinc-800/95 backdrop-blur-sm text-[10px] font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider border-b border-gray-200 dark:border-zinc-800">
          <th className="py-3 px-4 w-10">
            <input type="checkbox" className="rounded border-gray-300 dark:border-zinc-700 text-[#714B67] focus:ring-[#714B67] cursor-pointer" />
          </th>
          <th className="py-3 px-4">Pilot Profile</th>
          <th className="py-3 px-4">License Credentials</th>
          <th className="py-3 px-4">Medical Standard</th>
          <th className="py-3 px-4">Compliance Status</th>
          <th className="py-3 px-4">Performance Rating</th>
          <th className="py-3 px-4 text-right">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-[#eae8e7] dark:divide-zinc-800">
        {isLoading ? (
          <tr>
            <td colSpan={7} className="py-16">
              <div className="flex flex-col items-center justify-center gap-2 text-gray-400 dark:text-zinc-500">
                <div className="h-6 w-6 border-2 border-[#714B67]/30 border-t-[#714B67] rounded-full animate-spin" />
                <span className="text-xs font-bold">Loading driver records…</span>
              </div>
            </td>
          </tr>
        ) : filteredDrivers.length === 0 ? (
          <tr>
            <td colSpan={7} className="py-16">
              <div className="flex flex-col items-center justify-center gap-2 text-gray-400 dark:text-zinc-500">
                <Users className="h-8 w-8 opacity-40" />
                <span className="text-xs font-bold">No driver records matched current queries.</span>
                <span className="text-[10px] font-medium">Try adjusting your search or filters.</span>
              </div>
            </td>
          </tr>
        ) : (
          filteredDrivers.map((driver) => (
            <tr
              key={driver.id}
              className="hover:bg-[#fdfafc] dark:hover:bg-zinc-800/60 text-xs font-medium text-[#4d4847] dark:text-zinc-300 transition-colors group"
            >
              <td className="py-3.5 px-4">
                <input type="checkbox" className="rounded border-gray-300 dark:border-zinc-700 text-[#714B67] focus:ring-[#714B67] cursor-pointer" />
              </td>

              {/* Pilot Profile */}
              <td className="py-3.5 px-4">
                <div className="flex items-center gap-3">
                  <div className="relative shrink-0">
                    <img
                      src={driver.avatar}
                      alt={driver.name}
                      className="h-10 w-10 rounded-full border border-gray-100 dark:border-zinc-800 object-cover"
                    />
                    <span
                      className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white dark:border-zinc-900 ${
                        driver.attendanceStatus === 'Present'
                          ? 'bg-[#829c62]'
                          : driver.attendanceStatus === 'Off-duty'
                          ? 'bg-amber-400'
                          : 'bg-red-400'
                      }`}
                      title={driver.attendanceStatus}
                    />
                  </div>
                  <div>
                    <span className="font-extrabold text-[#1b1c1c] dark:text-zinc-100 block leading-tight">
                      {driver.name}
                    </span>
                    <span className="text-[10px] text-gray-500 dark:text-zinc-400 mt-0.5 font-bold flex items-center gap-1.5">
                      <span className="font-mono text-[#714B67] bg-[#fdfafc] dark:bg-[#714B67]/20 px-1 py-0.5 rounded">
                        {driver.id}
                      </span>
                      <span className="text-gray-400 dark:text-zinc-500">·</span>
                      <span>{driver.attendanceStatus}</span>
                    </span>
                  </div>
                </div>
              </td>

              {/* License Credentials */}
              <td className="py-3.5 px-4">
                <span className="font-bold text-[#1b1c1c] dark:text-zinc-100 block">
                  {driver.licenseNo}
                </span>
                <span className="text-[10px] text-gray-500 dark:text-zinc-400 mt-0.5 font-semibold flex items-center gap-1.5">
                  <Award className="h-3 w-3 shrink-0" />
                  {driver.licenseType}
                  <span className="text-gray-300 dark:text-zinc-600">•</span>
                  Exp {driver.licenseExpiry}
                </span>
              </td>

              {/* Medical Standard */}
              <td className="py-3.5 px-4">
                <div className="flex items-center gap-1.5">
                  <HeartPulse
                    className={`h-4 w-4 shrink-0 ${
                      driver.medicalStatus === 'Passed' ? 'text-[#829c62]' : 'text-amber-500'
                    }`}
                  />
                  <div>
                    <span className="font-bold block text-[#1b1c1c] dark:text-zinc-100">
                      {driver.medicalStatus}
                    </span>
                    <span className="text-[10px] text-gray-500 dark:text-zinc-400 font-semibold block mt-0.5">
                      Exp {driver.medicalExpiry}
                    </span>
                  </div>
                </div>
              </td>

              {/* Compliance Status */}
              <td className="py-3.5 px-4">
                {driver.status === 'Available' ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f4f7f4] dark:bg-[#829c62]/10 px-2.5 py-1 text-[10px] font-bold text-[#34451e] dark:text-[#a8c48a] border border-[#d3dfd3] dark:border-[#829c62]/30">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#829c62]" />
                    Available
                  </span>
                ) : driver.status === 'On Trip' ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e6fcf5] dark:bg-[#006a68]/10 px-2.5 py-1 text-[10px] font-bold text-[#006a68] dark:text-[#5fd8d4] border border-[#006a68]/20">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#006a68]" />
                    On Route
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 dark:bg-amber-500/10 px-2.5 py-1 text-[10px] font-bold text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                    On Leave
                  </span>
                )}
              </td>

              {/* Performance Rating */}
              <td className="py-3.5 px-4">
                <span className="font-extrabold text-[#1b1c1c] dark:text-zinc-100 flex items-center gap-1">
                  <span className="text-amber-400">★</span>
                  {driver.rating.toFixed(1)}
                </span>
                <span className="text-[10px] text-gray-500 dark:text-zinc-400 font-semibold mt-0.5 block">
                  {driver.tripsCompleted} missions completed
                </span>
              </td>

              {/* Actions */}
              <td className="py-3.5 px-4 text-right">
                <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleOpenEdit(driver)}
                    title="Edit driver"
                    className="p-1.5 rounded-lg bg-[#fdfafc] dark:bg-[#714B67]/20 text-[#714B67] border border-gray-200 dark:border-zinc-800 hover:bg-[#714B67] hover:text-white hover:border-[#714B67] transition-all cursor-pointer"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => removeDriver(driver.id)}
                    title="Remove driver"
                    className="p-1.5 rounded-lg bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-500/20 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>

  {/* Footer / Pagination */}
  <div className="p-4 bg-gray-50 dark:bg-zinc-950 border-t border-gray-200 dark:border-zinc-800 flex items-center justify-between text-xs text-gray-500 dark:text-zinc-400 font-semibold">
    <span>
      Showing <span className="text-[#1b1c1c] dark:text-zinc-200 font-bold">{filteredDrivers.length}</span> of{' '}
      <span className="text-[#1b1c1c] dark:text-zinc-200 font-bold">{drivers.length}</span> pilots
    </span>
    <div className="flex items-center gap-1.5">
      <button
        disabled
        className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-zinc-800 text-[10px] font-bold text-gray-400 dark:text-zinc-600 disabled:cursor-not-allowed"
      >
        Previous
      </button>
      <span className="px-2.5 py-1.5 rounded-lg bg-[#714B67] text-white text-[10px] font-bold">1</span>
      <button
        disabled
        className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-zinc-800 text-[10px] font-bold text-gray-400 dark:text-zinc-600 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  </div>

</div>

      {/* Driver Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-2xl max-w-lg w-full overflow-hidden transform transition-all animate-scale-up">
            
            <div className="flex items-center justify-between p-4.5 border-b border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950">
              <h3 className="text-sm font-black text-[#1b1c1c] dark:text-zinc-100 tracking-tight">
                {editingDriver ? 'Update Pilot Qualifications' : 'Register New Fleet Pilot'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-[#eae8e7] dark:hover:bg-zinc-800 text-gray-500 dark:text-zinc-400 transition-all cursor-pointer"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="p-5 space-y-4 max-h-[65vh] overflow-y-auto">
                <div className="grid grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold tracking-wider text-gray-500 dark:text-zinc-400 uppercase">
                      Pilot Name
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Alex Rivera"
                      className="w-full rounded-lg border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950 py-2 px-3 text-xs text-[#1b1c1c] dark:text-zinc-100 placeholder-[#80747a] dark:placeholder-zinc-500 focus:border-[#714B67] focus:outline-none transition-all font-semibold"
                    />
                  </div>

                  {/* ID */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold tracking-wider text-gray-500 dark:text-zinc-400 uppercase">
                      Pilot ID
                    </label>
                    <input
                      type="text"
                      required
                      disabled={!!editingDriver}
                      value={id}
                      onChange={(e) => setId(e.target.value)}
                      className="w-full rounded-lg border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950 py-2 px-3 text-xs text-[#1b1c1c] dark:text-zinc-100 placeholder-[#80747a] dark:placeholder-zinc-500 focus:border-[#714B67] focus:outline-none transition-all font-semibold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* License No */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold tracking-wider text-gray-500 dark:text-zinc-400 uppercase">
                      License Number
                    </label>
                    <input
                      type="text"
                      required
                      value={licenseNo}
                      onChange={(e) => setLicenseNo(e.target.value)}
                      placeholder="e.g. DL-IND884510"
                      className="w-full rounded-lg border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950 py-2 px-3 text-xs text-[#1b1c1c] dark:text-zinc-100 placeholder-[#80747a] dark:placeholder-zinc-500 focus:border-[#714B67] focus:outline-none transition-all font-semibold"
                    />
                  </div>

                  {/* License Type */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold tracking-wider text-gray-500 dark:text-zinc-400 uppercase">
                      License Category Class
                    </label>
                    <input
                      type="text"
                      required
                      value={licenseType}
                      onChange={(e) => setLicenseType(e.target.value)}
                      placeholder="e.g. Commercial HGV"
                      className="w-full rounded-lg border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950 py-2 px-3 text-xs text-[#1b1c1c] dark:text-zinc-100 placeholder-[#80747a] dark:placeholder-zinc-500 focus:border-[#714B67] focus:outline-none transition-all font-semibold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* License Expiry */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold tracking-wider text-gray-500 dark:text-zinc-400 uppercase">
                      License Expiry Date
                    </label>
                    <input
                      type="date"
                      required
                      value={licenseExpiry}
                      onChange={(e) => setLicenseExpiry(e.target.value)}
                      className="w-full rounded-lg border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950 py-2 px-3 text-xs text-[#1b1c1c] dark:text-zinc-100 focus:border-[#714B67] focus:outline-none transition-all font-semibold"
                    />
                  </div>

                  {/* Contact Phone */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold tracking-wider text-gray-500 dark:text-zinc-400 uppercase">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 99000 12345"
                      className="w-full rounded-lg border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950 py-2 px-3 text-xs text-[#1b1c1c] dark:text-zinc-100 placeholder-[#80747a] dark:placeholder-zinc-500 focus:border-[#714B67] focus:outline-none transition-all font-semibold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Medical Status */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold tracking-wider text-gray-500 dark:text-zinc-400 uppercase">
                      Medical Compliance Status
                    </label>
                    <select
                      value={medicalStatus}
                      onChange={(e) => setMedicalStatus(e.target.value as any)}
                      className="w-full rounded-lg border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950 py-2 px-3 text-xs text-[#1b1c1c] dark:text-zinc-100 focus:border-[#714B67] focus:outline-none transition-all font-bold"
                    >
                      <option value="Passed">Passed (Biometrics OK)</option>
                      <option value="Pending Review">Pending Review</option>
                      <option value="Required Soon">Required Soon</option>
                    </select>
                  </div>

                  {/* Duty Status */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold tracking-wider text-gray-500 dark:text-zinc-400 uppercase">
                      Active Status
                    </label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as any)}
                      className="w-full rounded-lg border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950 py-2 px-3 text-xs text-[#1b1c1c] dark:text-zinc-100 focus:border-[#714B67] focus:outline-none transition-all font-bold"
                    >
                      <option value="Available">Available</option>
                      <option value="On Trip">On Trip</option>
                      <option value="On Leave">On Leave</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Medical Expiry */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold tracking-wider text-gray-500 dark:text-zinc-400 uppercase">
                      Medical Standard Expiry
                    </label>
                    <input
                      type="date"
                      required
                      value={medicalExpiry}
                      onChange={(e) => setMedicalExpiry(e.target.value)}
                      className="w-full rounded-lg border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950 py-2 px-3 text-xs text-[#1b1c1c] dark:text-zinc-100 focus:border-[#714B67] focus:outline-none transition-all font-semibold"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold tracking-wider text-gray-500 dark:text-zinc-400 uppercase">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. pilot@transitops.in"
                      className="w-full rounded-lg border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950 py-2 px-3 text-xs text-[#1b1c1c] dark:text-zinc-100 focus:border-[#714B67] focus:outline-none transition-all font-semibold"
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-zinc-950 border-t border-gray-200 dark:border-zinc-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-bold text-[#4d4847] dark:text-zinc-300 hover:bg-[#f5f3f3] dark:hover:bg-zinc-800 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4.5 py-2 rounded-xl bg-[#714B67] text-xs font-extrabold text-white hover:bg-[#5e3b56] shadow-md transition-all cursor-pointer"
                >
                  {editingDriver ? 'Save Credentials' : 'Certify Driver Profile'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
