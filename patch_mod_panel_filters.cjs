const fs = require('fs');
let content = fs.readFileSync('src/components/ModeratorPanel.tsx', 'utf8');

const oldHeader = `<CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl text-slate-900 dark:text-white">{t('mod.queue', language)}</CardTitle>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFilterNsfw(v => !v)}
                  className={\`border-black/10 dark:border-white/10 text-slate-700 dark:text-slate-300 transition-all \${filterNsfw ? 'bg-red-500/20 border-red-500/30 font-semibold' : 'bg-black/5 dark:bg-white/5'}\`}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  {t('mod.nsfw', language)}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFilterArLaw(v => !v)}
                  className={\`border-black/10 dark:border-white/10 text-slate-700 dark:text-slate-300 transition-all \${filterArLaw ? 'bg-red-500/20 border-red-500/30 font-semibold' : 'bg-black/5 dark:bg-white/5'}\`}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  {t('mod.ar_law', language)}
                </Button>
              </div>
            </CardHeader>`;

const newHeader = `<CardHeader>
              <CardTitle className="text-xl text-slate-900 dark:text-white">{t('mod.queue', language)}</CardTitle>
            </CardHeader>`;

content = content.replace(oldHeader, newHeader);

const oldFilterLogicRegex = /\.filter\(r => \{\s*if \(filterNsfw\) \{\s*return r\.aiScores \? r\.aiScores\.nsfw > 0\.6 : false;\s*\}\s*return true;\s*\}\)\s*\.filter\(r => \{\s*if \(filterArLaw\) \{\s*return r\.aiScores \? r\.aiScores\.arLaw > 0\.6 : false;\s*\}\s*return true;\s*\}\);/g;

content = content.replace(oldFilterLogicRegex, ';');

fs.writeFileSync('src/components/ModeratorPanel.tsx', content);
