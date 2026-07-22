const fs = require('fs');
let content = fs.readFileSync('src/components/Feed.tsx', 'utf8');

// I will just read from the start to the 'Recent Activity' part and fix the rest.
const recentActivityIdx = content.indexOf('Recent Activity');
const lastPart = content.substring(recentActivityIdx);

// It should look like this:
const properEnd = `Recent Activity</h3>
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-100 dark:border-slate-800 text-sm text-slate-600 dark:text-slate-400 italic">
                  Shared {t(('common.' + selectedNeighbor.type) as any, language)} recently.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeMomentIndex !== null && (
        <MomentViewer 
          moments={moments} 
          initialIndex={activeMomentIndex} 
          onClose={() => setActiveMomentIndex(null)} 
        />
      )}
    </div>
  );
}`;

content = content.substring(0, recentActivityIdx) + properEnd;

fs.writeFileSync('src/components/Feed.tsx', content);
