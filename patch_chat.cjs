const fs = require('fs');
let content = fs.readFileSync('src/components/Chat.tsx', 'utf8');

// Add imports
content = content.replace("import { Send, Store, User, ArrowLeft, Smile, Reply, Users, Plus, Mic, Square, Trash2, X } from 'lucide-react';", "import { Send, Store, User, ArrowLeft, Smile, Reply, Users, Plus, Mic, Square, Trash2, X, Flag, AlertTriangle } from 'lucide-react';\nimport { useModerationStore } from '../store/useModerationStore';");

// Add state for report dialog
const stateTarget = `  const { language } = useLanguageStore();`;
const stateReplacement = `  const { language } = useLanguageStore();
  const { addReport } = useModerationStore();
  const [reportDialog, setReportDialog] = useState<string | null>(null);
  const [reportReason, setReportReason] = useState('');
  const [reportSubmitted, setReportSubmitted] = useState(false);
`;
content = content.replace(stateTarget, stateReplacement);

// Add submit handler
const submitTarget = `  useEffect(() => {`;
const submitReplacement = `
  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportDialog || !reportReason) return;
    
    await addReport({
      type: 'post',
      contentId: reportDialog,
      content: \`Chat with \${activeChat?.name}\`,
      author: 'Current User', // in a real app, this should be the current user's ID
      reason: reportReason,
    });
    
    setReportSubmitted(true);
    setTimeout(() => {
      setReportDialog(null);
      setReportSubmitted(false);
      setReportReason('');
    }, 2000);
  };

  useEffect(() => {`;
content = content.replace(submitTarget, submitReplacement);

// Add report button to header
const headerTarget = `              <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center">
                {activeChat.type === 'business' ? <Store className="h-5 w-5 text-indigo-400" /> : <User className="h-5 w-5 text-indigo-400" />}
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{activeChat.name}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">{activeChat.type === 'business' ? 'Verified Business' : t('common.neighbor', language)}</p>
              </div>
            </div>`;
const headerReplacement = `              <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center">
                {activeChat.type === 'business' ? <Store className="h-5 w-5 text-indigo-400" /> : <User className="h-5 w-5 text-indigo-400" />}
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{activeChat.name}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">{activeChat.type === 'business' ? 'Verified Business' : t('common.neighbor', language)}</p>
              </div>
            </div>
            
            {/* Report Button */}
            <button
              onClick={() => setReportDialog(activeChat.id)}
              className="ml-auto text-slate-400 hover:text-red-500 p-2 transition-colors"
              title="Report User"
            >
              <Flag className="w-5 h-5" />
            </button>
          </div>`;
content = content.replace(headerTarget, headerReplacement);

// Add dialog
const dialogTarget = `    </div>
  );
}`;
const dialogReplacement = `
      {/* Report Dialog */}
      {reportDialog && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-md bg-white dark:bg-slate-900 shadow-2xl">
            <CardContent className="p-6">
              {!reportSubmitted ? (
                <>
                  <div className="flex items-center space-x-3 text-red-500 mb-4">
                    <AlertTriangle className="w-6 h-6" />
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Report User</h3>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                    If this user is making you uncomfortable, sending spam, or violating community guidelines, please report them. Our moderation team will review this chat.
                  </p>
                  <form onSubmit={handleReportSubmit} className="space-y-4">
                    <textarea
                      value={reportReason}
                      onChange={(e) => setReportReason(e.target.value)}
                      placeholder="Please explain what happened..."
                      className="w-full h-24 p-3 rounded-lg border border-black/10 dark:border-white/10 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                      required
                    />
                    <div className="flex justify-end space-x-2">
                      <Button type="button" variant="ghost" onClick={() => setReportDialog(null)}>Cancel</Button>
                      <Button type="submit" className="bg-red-600 hover:bg-red-700 text-white">Submit Report</Button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="text-center py-6">
                  <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Flag className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Report Submitted</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Thank you for helping keep our community safe.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}`;
content = content.replace(dialogTarget, dialogReplacement);

fs.writeFileSync('src/components/Chat.tsx', content);
console.log("Patched Chat.tsx");
