import React, { useEffect, useState } from 'react';
import api from '../../../lib/axios';
import { DriverCard } from './DriverCard';
import { SearchInput } from '../../shared/SearchInput';
import { LoadingSpinner } from '../../shared/LoadingSpinner';
import { EmptyState } from '../../shared/EmptyState';
import { Users } from 'lucide-react';

export const DriverListPage: React.FC = () => {
  const [drivers, setDrivers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => { api.get('/drivers').then(r => setDrivers(r.data.data || [])).finally(() => setIsLoading(false)); }, []);

  const filtered = drivers.filter(d => d.name?.toLowerCase().includes(search.toLowerCase()));

  if (isLoading) return <LoadingSpinner />;
  if (!filtered.length) return <EmptyState icon={Users} title="No drivers found" />;

  return (
    <div className="space-y-4">
      <SearchInput value={search} onChange={setSearch} placeholder="Search drivers..." />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(d => <DriverCard key={d.id} driver={d} />)}
      </div>
    </div>
  );
};