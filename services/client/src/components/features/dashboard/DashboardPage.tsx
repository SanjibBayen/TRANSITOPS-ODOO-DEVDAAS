import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { FleetManagerDashboard } from './FleetManagerDashboard';
import { DriverDashboard } from './DriverDashboard';
import { SafetyOfficerDashboard } from './SafetyOfficerDashboard';
import { FinancialAnalystDashboard } from './FinancialAnalystDashboard';

export const DashboardPage: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const role = user?.role || 'FLEET_MANAGER';

  switch (role) {
    case 'DRIVER': return <DriverDashboard />;
    case 'SAFETY_OFFICER': return <SafetyOfficerDashboard />;
    case 'FINANCIAL_ANALYST': return <FinancialAnalystDashboard />;
    default: return <FleetManagerDashboard />;
  }
};