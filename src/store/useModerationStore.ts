import { create } from 'zustand';

export interface Report {
  id: string;
  type: 'post' | 'listing';
  contentId: string | number;
  content: string;
  author: string;
  reason: string;
  timestamp: string;
  status: 'pending' | 'resolved' | 'dismissed';
}

interface ModerationState {
  reports: Report[];
  addReport: (report: Omit<Report, 'id' | 'timestamp' | 'status'>) => void;
  updateReportStatus: (id: string, status: Report['status']) => void;
}

export const useModerationStore = create<ModerationState>((set) => ({
  reports: [
    {
      id: '1',
      type: 'post',
      contentId: 99,
      content: 'This is a test post that someone found offensive.',
      author: 'John D.',
      reason: 'Inappropriate content',
      timestamp: new Date().toISOString(),
      status: 'pending'
    }
  ],
  addReport: (report) => set((state) => ({
    reports: [
      ...state.reports,
      {
        ...report,
        id: Math.random().toString(36).substring(7),
        timestamp: new Date().toISOString(),
        status: 'pending'
      }
    ]
  })),
  updateReportStatus: (id, status) => set((state) => ({
    reports: state.reports.map((r) => r.id === id ? { ...r, status } : r)
  }))
}));
