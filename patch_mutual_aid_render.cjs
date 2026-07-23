const fs = require('fs');
let content = fs.readFileSync('src/components/MutualAid.tsx', 'utf8');

const returnTarget = `  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-rose-500/20 rounded-lg border border-rose-500/30">
            <HeartHandshake className="h-6 w-6 text-rose-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{t('aid.title', language)}</h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">{t('aid.subtitle', language)}</p>
          </div>
        </div>
      </div>

      <VerificationGate>`;

const returnReplacement = `  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-rose-500/20 rounded-lg border border-rose-500/30">
            <HeartHandshake className="h-6 w-6 text-rose-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{t('aid.title', language)}</h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">{t('aid.subtitle', language)}</p>
          </div>
        </div>
        <div className="flex bg-black/5 dark:bg-white/5 rounded-lg p-1">
          <button
            onClick={() => setViewMode('requests')}
            className={\`px-3 py-1.5 text-sm font-medium rounded-md transition-colors \${viewMode === 'requests' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}\`}
          >
            Requests
          </button>
          <button
            onClick={() => setViewMode('registry')}
            className={\`px-3 py-1.5 text-sm font-medium rounded-md transition-colors \${viewMode === 'registry' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}\`}
          >
            Registry
          </button>
        </div>
      </div>

      {viewMode === 'registry' ? (
        <GoodDeedsRegistry />
      ) : (
      <>
      <VerificationGate>`;

content = content.replace(returnTarget, returnReplacement);

const cardRenderTarget = `                  <div className="flex items-center text-xs text-slate-500 dark:text-slate-500 font-medium">
                        <Clock className="h-3 w-3 mr-1" />
                        {req.time}
                      </div>
                    </>
                  )}
                </div>
                
                {req.status === 'open' && !isGuest && (
                  <Button variant="outline" size="sm" onClick={() => handleOfferHelp(req)} className="bg-black/5 dark:bg-white/5 text-rose-400 border-rose-400/30 hover:bg-rose-500/20">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    {t('aid.offer_help', language)}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}`;

const cardRenderReplacement = `                  <div className="flex items-center text-xs text-slate-500 dark:text-slate-500 font-medium">
                        <Clock className="h-3 w-3 mr-1" />
                        {req.timestamp ? new Date(req.timestamp.toDate()).toLocaleDateString() : 'Just now'}
                      </div>
                    </>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  {req.status === 'open' && !isGuest && req.authorId !== user?.uid && (
                    <Button variant="outline" size="sm" onClick={() => handleOfferHelp(req)} className="bg-black/5 dark:bg-white/5 text-rose-400 border-rose-400/30 hover:bg-rose-500/20">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      {t('aid.offer_help', language) || 'Offer Help'}
                    </Button>
                  )}
                  {req.status === 'open' && req.authorId === user?.uid && (
                    <Button variant="default" size="sm" onClick={() => setResolveDialogReq(req)} className="bg-green-600 hover:bg-green-500 text-white">
                      Mark Resolved
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      </>
      )}

      {/* Resolve Dialog */}
      {resolveDialogReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-md bg-white dark:bg-slate-900 border-black/10 dark:border-white/10 shadow-2xl">
            <CardHeader className="border-b border-black/5 dark:border-white/5">
              <CardTitle>Who helped you?</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Select a neighbor who helped you with "{resolveDialogReq.title}". They will receive points!
              </p>
              
              {resolveDialogReq.responders && resolveDialogReq.responders.length > 0 ? (
                <div className="space-y-2">
                  {resolveDialogReq.responders.map((r: any, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => submitResolve(r.uid)}
                      className="w-full p-3 text-left bg-slate-50 dark:bg-slate-800 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/30 border border-transparent hover:border-indigo-200 dark:hover:border-indigo-800 transition-colors flex items-center"
                    >
                      <HeartHandshake className="w-4 h-4 mr-3 text-rose-400" />
                      <span className="font-medium text-slate-900 dark:text-white">{r.name}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-amber-600 dark:text-amber-400 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                  No one has officially offered help via the app yet. If someone helped you in person, they need to click "Offer Help" on this request to receive points.
                </div>
              )}
              
              <div className="flex justify-end pt-2">
                <Button variant="ghost" onClick={() => setResolveDialogReq(null)}>Cancel</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}`;

content = content.replace(cardRenderTarget, cardRenderReplacement);
fs.writeFileSync('src/components/MutualAid.tsx', content);
console.log("Patched render");
