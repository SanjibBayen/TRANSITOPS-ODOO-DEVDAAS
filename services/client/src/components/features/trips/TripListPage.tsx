import React, { useEffect, useState } from 'react';
import api from '../../../lib/axios';
import { TripTable } from './TripTable';
import { TripFilters } from './TripFilters';
import { SearchInput } from '../../shared/SearchInput';

export const TripListPage: React.FC = () => {
  const [trips, setTrips] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    api.get('/trips').then(r => setTrips(r.data.data || [])).finally(() => setIsLoading(false));
  }, []);

  const filtered = trips.filter(t => {
    const matchesSearch = t.trip_number?.toLowerCase().includes(search.toLowerCase()) || t.source?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter ? t.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <SearchInput value={search} onChange={setSearch} placeholder="Search trips..." className="flex-1" />
        <TripFilters value={statusFilter} onChange={setStatusFilter} />
      </div>
      <TripTable trips={filtered} isLoading={isLoading} />
    </div>
  );
};