import React, { useState } from 'react';
import { 
  Bell, 
  Plus, 
  Pause, 
  Play, 
  Trash2, 
  CheckCircle2, 
  Sparkles, 
  Activity,
  History
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MOCK_ALERTS, MOCK_NOTIFICATIONS } from '@/mocks/mockData';
import { Alert } from '@/types';
import { CreateAlertModal } from '@/components/alerts/CreateAlertModal';

export const AlertsPage: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>(MOCK_ALERTS);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleStatus = (id: string) => {
    setAlerts(prev => prev.map(a => 
      a.id === id ? { ...a, status: a.status === 'active' ? 'paused' : 'active' } : a
    ));
  };

  const deleteAlert = (id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  const handleCreate = (newAlert: Alert) => {
    setAlerts(prev => [newAlert, ...prev]);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            Real-time Alerting Center <Sparkles className="h-6 w-6 text-[#6366F1]" />
          </h1>
          <p className="mt-1 text-sm text-[#94A3B8]">
            Configure automated thresholds, monitor signals, and view trigger audit history.
          </p>
        </div>
        <Button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#6366F1] hover:bg-[#4F46E5] text-white flex items-center gap-2"
        >
          <Plus className="h-4 w-4" /> Create New Alert
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column (2 Cols wide): Active Subscribed Alerts */}
        <div className="space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Bell className="h-5 w-5 text-[#6366F1]" /> Subscribed Alerts ({alerts.length})
            </h3>
          </div>

          <div className="space-y-3">
            {alerts.map((alert) => (
              <Card key={alert.id} className="border-[#1F2937] bg-[#111827] p-5">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-3">
                      <h4 className="text-base font-bold text-white">{alert.title}</h4>
                      <Badge variant={alert.status === 'active' ? 'success' : 'secondary'}>
                        {alert.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-[#94A3B8]">Query term: <strong className="text-white">"{alert.query}"</strong></p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleStatus(alert.id)}
                      className="text-xs text-[#94A3B8] hover:text-white"
                    >
                      {alert.status === 'active' ? (
                        <><Pause className="mr-1 h-3.5 w-3.5 text-amber-400" /> Pause</>
                      ) : (
                        <><Play className="mr-1 h-3.5 w-3.5 text-[#10B981]" /> Resume</>
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteAlert(alert.id)}
                      className="h-8 w-8 text-[#94A3B8] hover:text-[#EF4444]"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="mt-4 border-t border-[#1F2937] pt-3 flex flex-wrap items-center justify-between text-xs text-[#64748B] gap-2">
                  <div className="flex items-center space-x-4">
                    <span>Category: <strong className="text-[#94A3B8]">{alert.category}</strong></span>
                    <span>Platform: <strong className="text-[#94A3B8]">{alert.platform}</strong></span>
                    <span>Threshold: <strong className="text-[#94A3B8] font-mono">{alert.threshold.toLocaleString()} mentions</strong></span>
                  </div>
                  <span>Triggered {alert.triggerCount} times ({alert.lastTriggered})</span>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Right Sidebar Column: Notification History Feed */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <History className="h-5 w-5 text-[#3B82F6]" /> Trigger Audit History
          </h3>

          <Card className="border-[#1F2937] bg-[#111827] p-4">
            <div className="space-y-4">
              {MOCK_NOTIFICATIONS.map((notif) => (
                <div key={notif.id} className="relative pl-6 pb-3 border-l border-[#1F2937] last:border-0 last:pb-0">
                  <span className="absolute -left-1.5 top-0 h-3 w-3 rounded-full bg-[#6366F1] ring-4 ring-[#111827]" />
                  <p className="text-xs font-semibold text-white">{notif.title}</p>
                  <p className="text-xs text-[#94A3B8] mt-0.5 leading-relaxed">{notif.message}</p>
                  <span className="text-[10px] text-[#64748B] mt-1 block">{notif.timestamp}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Modal for creating new alert */}
      <CreateAlertModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreate}
      />
    </div>
  );
};
