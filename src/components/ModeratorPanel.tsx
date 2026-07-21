import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Shield, Check, X, Eye, Users, AlertCircle, TrendingUp, Filter, Flag, Clock, MapPin } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useModerationStore } from '../store/useModerationStore';
import { useLanguageStore } from '../store/useLanguageStore';
import { t } from '../lib/i18n';
import { useVerificationStore } from '../store/useVerificationStore';

export default function ModeratorPanel() {
  const { user } = useAuthStore();
  const { reports, updateReportStatus } = useModerationStore();
  const { language } = useLanguageStore();
  const { requests, approveRequest, rejectRequest } = useVerificationStore();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'verifications' | 'users' | 'reports'>('dashboard');
  const [filterNsfw, setFilterNsfw] = useState(false);
  const [filterArLaw, setFilterArLaw] = useState(false);
  
  const verifications = requests.filter(r => r.status === 'pending');

  if (user?.role !== 'moderator' && user?.role !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <Shield className="h-16 w-16 text-red-500/80 mb-6 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">{t('mod.access_restricted', language)}</h2>
        <p className="text-slate-600 dark:text-slate-400 text-lg">{t('mod.must_be_mod', language)}</p>
      </div>
    );
  }

  const handleApprove = (id: string) => {
    approveRequest(id);
  };

  const handleReject = (id: string) => {
    rejectRequest(id);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-black/10 dark:border-white/10 pb-6">
        <div className="flex items-center space-x-3 mb-4 sm:mb-0">
          <div className="p-2 bg-orange-500/20 rounded-lg border border-orange-500/30">
            <Shield className="h-7 w-7 text-orange-400" />
          </div>
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{t('mod.title', language)}</h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">{t('mod.subtitle', language)}</p>
          </div>
        </div>
        <div className="flex flex-wrap bg-black/5 dark:bg-white/5 p-1 rounded-xl border border-black/10 dark:border-white/10 gap-1 mt-4 sm:mt-0">
          {(['dashboard', 'verifications', 'reports', 'users'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium rounded-lg capitalize transition-all ${
                activeTab === tab 
                  ? 'bg-black/10 dark:bg-white/10 text-slate-900 dark:text-white shadow-sm' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-white hover:bg-black/5 dark:bg-white/5'
              }`}
            >
              {t(`mod.${tab}` as any, language)}
              {tab === 'reports' && reports.filter(r => r.status === 'pending').length > 0 && (
                <span className="ml-2 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                  {reports.filter(r => r.status === 'pending').length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'dashboard' && (
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="glass-panel border-black/10 dark:border-white/10 shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">{t('mod.total_users', language)}</p>
                  <h3 className="text-3xl font-bold text-slate-900 dark:text-white">1,248</h3>
                </div>
                <div className="p-3 rounded-xl bg-blue-500/20 text-blue-400">
                  <Users className="h-6 w-6" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-green-400">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span>+12% from last month</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-panel border-black/10 dark:border-white/10 shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">{t('mod.pending_verif', language)}</p>
                  <h3 className="text-3xl font-bold text-slate-900 dark:text-white">{verifications.length}</h3>
                </div>
                <div className="p-3 rounded-xl bg-orange-500/20 text-orange-400">
                  <Shield className="h-6 w-6" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-slate-600 dark:text-slate-400">
                <Clock className="h-4 w-4 mr-1" />
                <span>{t('mod.requires_attn', language)}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-panel border-black/10 dark:border-white/10 shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">{t('mod.reported_content', language)}</p>
                  <h3 className="text-3xl font-bold text-slate-900 dark:text-white">{reports.filter(r => r.status === 'pending').length}</h3>
                </div>
                <div className="p-3 rounded-xl bg-red-500/20 text-red-400">
                  <AlertCircle className="h-6 w-6" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-slate-600 dark:text-slate-400">
                <AlertCircle className="h-4 w-4 mr-1" />
                <span>{t('mod.needs_review', language)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'verifications' && (
        <Card className="glass-panel border-black/10 dark:border-white/10 shadow-2xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl text-slate-900 dark:text-white">{t('mod.address_verif', language)}</CardTitle>
            <Button variant="outline" size="sm" className="bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 text-slate-700 dark:text-slate-300">
              <Filter className="h-4 w-4 mr-2" />
              {t('mod.filter', language)}
            </Button>
          </CardHeader>
          <CardContent>
            {verifications.length === 0 ? (
              <div className="text-center py-12">
                <Shield className="mx-auto h-12 w-12 text-slate-500 dark:text-slate-500/50 mb-4" />
                <p className="text-lg text-slate-900 dark:text-white font-medium">{t('mod.caught_up', language)}</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">{t('mod.no_pending', language)}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {verifications.map(v => (
                  <div key={v.id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-5 rounded-xl border border-black/10 dark:border-white/10 bg-white/40 dark:bg-black/20 hover:bg-white/60 dark:bg-black/40 transition-all">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-5 w-full md:w-auto mb-4 md:mb-0">
                      <div className="relative group/img cursor-pointer overflow-hidden rounded-lg border border-black/20 dark:border-white/20">
                        <img src={(v as any).document_url || (v as any).documentUrl} alt="Document" className="h-20 w-32 object-cover transition-transform group-hover/img:scale-105" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-opacity">
                          <Eye className="h-6 w-6 text-slate-900 dark:text-white" />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <p className="font-semibold text-lg text-slate-900 dark:text-white">{v.name}</p>
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-orange-500/20 text-orange-400 border border-orange-500/30">
                            {t('mod.pending', language)}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 mt-1 text-sm text-slate-600 dark:text-slate-400">
                          <span className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1 text-slate-500 dark:text-slate-500" />
                            {v.district}
                          </span>
                          <span className="flex items-center">
                            <Clock className="h-4 w-4 mr-1 text-slate-500 dark:text-slate-500" />
                            {v.date}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 w-full md:w-auto justify-end">
                      <Button variant="outline" className="text-red-400 border-red-400/30 hover:bg-red-500/20 bg-white/60 dark:bg-black/40 w-full sm:w-auto" onClick={() => handleReject(v.id)}>
                        <X className="mr-2 h-4 w-4" /> {t('mod.reject', language)}
                      </Button>
                      <Button className="bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30 w-full sm:w-auto shadow-[0_0_15px_rgba(34,197,94,0.15)]" onClick={() => handleApprove(v.id)}>
                        <Check className="mr-2 h-4 w-4" /> {t('mod.approve', language)}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === 'reports' && (() => {
        const filteredPendingReports = reports
          .filter(r => r.status === 'pending')
          .filter(r => {
            if (filterNsfw) {
              return r.aiScores ? r.aiScores.nsfw > 0.6 : false;
            }
            return true;
          })
          .filter(r => {
            if (filterArLaw) {
              return r.aiScores ? r.aiScores.arLaw > 0.6 : false;
            }
            return true;
          });

        return (
          <Card className="glass-panel border-black/10 dark:border-white/10 shadow-2xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl text-slate-900 dark:text-white">{t('mod.queue', language)}</CardTitle>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFilterNsfw(v => !v)}
                  className={`border-black/10 dark:border-white/10 text-slate-700 dark:text-slate-300 transition-all ${filterNsfw ? 'bg-red-500/20 border-red-500/30 font-semibold' : 'bg-black/5 dark:bg-white/5'}`}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  {t('mod.nsfw', language)}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFilterArLaw(v => !v)}
                  className={`border-black/10 dark:border-white/10 text-slate-700 dark:text-slate-300 transition-all ${filterArLaw ? 'bg-red-500/20 border-red-500/30 font-semibold' : 'bg-black/5 dark:bg-white/5'}`}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  {t('mod.ar_law', language)}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {filteredPendingReports.length === 0 ? (
                <div className="text-center py-12">
                  <Shield className="mx-auto h-12 w-12 text-slate-500 dark:text-slate-500/50 mb-4" />
                  <p className="text-lg text-slate-900 dark:text-white font-medium">
                    {reports.filter(r => r.status === 'pending').length === 0 ? t('mod.queue_empty', language) : 'No reports match filter criteria.'}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {reports.filter(r => r.status === 'pending').length === 0 ? t('mod.no_reports', language) : 'Try disabling active filters.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredPendingReports.map(report => (
                    <div key={report.id} className="flex flex-col md:flex-row items-start justify-between p-5 rounded-xl border border-black/10 dark:border-white/10 bg-white/40 dark:bg-black/20 hover:bg-white/60 dark:bg-black/40 transition-all">
                      <div className="flex flex-col w-full md:w-3/4 mb-4 md:mb-0">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-500/20 text-red-400 border border-red-500/30 uppercase tracking-wider">
                            {report.type}
                          </span>
                          <p className="text-sm text-slate-600 dark:text-slate-400">{t('mod.reported_by', language)}</p>
                          <span className="text-slate-500 dark:text-slate-500 text-xs">•</span>
                          <p className="text-xs text-slate-500 dark:text-slate-500">{new Date(report.timestamp).toLocaleString()}</p>
                        </div>
                        <p className="text-slate-900 dark:text-white text-lg mb-2">"{report.content}"</p>
                        <div className="bg-black/5 dark:bg-white/5 rounded-lg p-3 border border-black/10 dark:border-white/10 inline-block">
                          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{t('mod.author', language)}: <span className="text-slate-900 dark:text-white">{report.author}</span></p>
                          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1"><Flag className="h-3 w-3 inline mr-1 text-red-400"/> {t('mod.reason', language)}: {report.reason}</p>
                          {report.aiScores && (
                            <div className="mt-2 flex gap-3 text-xs">
                              <span className={`px-2 py-1 rounded ${report.aiScores.nsfw > 0.6 ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                                AI NSFW: {(report.aiScores.nsfw * 100).toFixed(0)}%
                              </span>
                              <span className={`px-2 py-1 rounded ${report.aiScores.arLaw > 0.6 ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                                AI AR Law: {(report.aiScores.arLaw * 100).toFixed(0)}%
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row md:flex-col gap-2 w-full md:w-auto">
                        <Button className="bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.15)]" onClick={() => updateReportStatus(report.id, 'resolved')}>
                          <X className="mr-2 h-4 w-4" /> {t('mod.delete', language)}
                        </Button>
                        <Button variant="outline" className="text-slate-700 dark:text-slate-300 border-black/10 dark:border-white/10 hover:bg-black/10 dark:bg-white/10 bg-transparent" onClick={() => updateReportStatus(report.id, 'dismissed')}>
                          <Check className="mr-2 h-4 w-4" /> {t('mod.dismiss', language)}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        );
      })()}

      {activeTab === 'users' && (
        <Card className="glass-panel border-black/10 dark:border-white/10 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-xl text-slate-900 dark:text-white">{t('mod.user_mgmt', language)}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-slate-500 dark:text-slate-500/50 mb-4" />
              <p className="text-lg text-slate-900 dark:text-white font-medium">{t('mod.dir_coming', language)}</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">{t('mod.search_manage', language)}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
