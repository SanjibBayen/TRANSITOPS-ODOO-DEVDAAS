import React, { useEffect, useState } from 'react';
import api from '../../../lib/axios';
import { VehicleCard } from './VehicleCard';
import { VehicleTable } from './VehicleTable';
import { VehicleFilters } from './VehicleFilters';
import { VehicleSearch } from './VehicleSearch';
import { LoadingSpinner } from '../../shared/LoadingSpinner';
import { EmptyState } from '../../shared/EmptyState';
import { Truck } from 'lucide-react';

export const VehicleListPage: React.FC = () => {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  useEffect(() => {
    api.get('/vehicles').then(r => setVehicles(r.data.data || [])).finally(() => setIsLoading(false));
  }, []);

  const filtered = vehicles.filter(v => {
    const matchesSearch = v.registration_number?.toLowerCase().includes(search.toLowerCase()) || v.model?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter ? v.status === statusFilter : true;
    const matchesType = typeFilter ? v.type === typeFilter : true;
    return matchesSearch && matchesStatus && matchesType;
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 flex-wrap">
        <VehicleSearch value={search} onChange={setSearch} />
        <VehicleFilters status={statusFilter} type={typeFilter} onStatusChange={setStatusFilter} onTypeChange={setTypeFilter} />
        <button onClick={() => setViewMode(viewMode === 'table' ? 'cards' : 'table')} className="text-xs text-[#714B67] font-bold">
          {viewMode === 'table' ? 'Card View' : 'Table View'}
        </button>
      </div>
      {!filtered.length ? <EmptyState icon={Truck} title="No vehicles found" /> :
        viewMode === 'table' ? <VehicleTable vehicles={filtered} /> :
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{filtered.map(v => <VehicleCard key={v.id} vehicle={v} />)}</div>
      }
    </div>
  );
};