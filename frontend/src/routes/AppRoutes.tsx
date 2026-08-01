import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { DashboardPage } from '@/pages/Dashboard/DashboardPage';
import { TrendDetailsPage } from '@/pages/TrendDetails/TrendDetailsPage';
import { SearchPage } from '@/pages/Search/SearchPage';
import { AlertsPage } from '@/pages/Alerts/AlertsPage';
import { SettingsPage } from '@/pages/Settings/SettingsPage';
import { LoginPage } from '@/pages/Login/LoginPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      
      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="trends/:id" element={<TrendDetailsPage />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="alerts" element={<AlertsPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
