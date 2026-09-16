import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Badge } from '../components/common/Badge';
import {
  Bell,
  CheckCircle2,
  AlertCircle,
  HardDrive,
  Send,
  Video,
  CalendarCheck,
  Clock,
  Filter,
} from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

export const NotificationsCenter: React.FC = () => {
  const { notifications } = useApp();
  const { t } = useTranslation();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filteredNotifs = notifications.filter((n) => {
    if (filter === 'unread') return !n.read;
    return true;
  });

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'referral':
        return <Send className="w-4 h-4 text-indigo-400" />;
      case 'sync':
        return <HardDrive className="w-4 h-4 text-teal-400" />;
      case 'alert':
        return <AlertCircle className="w-4 h-4 text-rose-400" />;
      case 'teleconsult':
        return <Video className="w-4 h-4 text-purple-400" />;
      case 'followup':
        return <CalendarCheck className="w-4 h-4 text-amber-400" />;
      default:
        return <Bell className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Bell className="w-6 h-6 text-teal-400" />
            <span>{t('nav_notifications', 'Emergency Alerts & Notifications')}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Real-time inter-facility updates, offline synchronization digests, and delay alerts
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              filter === 'all' ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 font-black' : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            All Updates
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              filter === 'unread' ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 font-black' : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            Unread Only
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifs.map((n) => (
          <div
            key={n.id}
            className={`p-4 sm:p-5 rounded-2xl border transition-all flex items-start gap-4 backdrop-blur-sm ${
              !n.read ? 'bg-slate-900/90 border-teal-500/40 shadow-xl' : 'bg-slate-950/60 border-slate-800 opacity-80'
            }`}
          >
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 shrink-0 mt-0.5">
              {getNotifIcon(n.type)}
            </div>

            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  {n.title}
                  {!n.read && <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />}
                </h3>
                <span className="text-[11px] text-slate-400 font-medium shrink-0">{n.time}</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-medium">{n.message}</p>
              <div className="pt-1 flex items-center gap-2 text-[10px]">
                <Badge
                  variant={n.priority === 'high' ? 'rose' : n.priority === 'medium' ? 'amber' : 'slate'}
                  size="sm"
                >
                  {n.priority} priority
                </Badge>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
