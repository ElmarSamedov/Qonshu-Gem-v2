const fs = require('fs');
let content = fs.readFileSync('src/components/Profile.tsx', 'utf8');

const interestsSection = `          {/* Interests Section */}
          <Card className="glass-panel border-black/10 dark:border-white/10">
            <CardHeader className="border-b border-white/5 pb-4">
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-yellow-400" />
                <CardTitle className="text-lg text-slate-900 dark:text-white">Interests</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <InterestsSelector />
            </CardContent>
          </Card>
`;

const routerCodeSection = `          {/* Router Code */}
          <Card className="glass-panel border-black/10 dark:border-white/10">
            <CardHeader className="border-b border-white/5 pb-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Wifi className="h-5 w-5 text-blue-400" />
                  <CardTitle className="text-lg text-slate-900 dark:text-white">{t('profile.router_code', language) || 'My Router Code'}</CardTitle>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setIsEditingRouter(!isEditingRouter)}>
                  {t('profile.edit', language) || 'Edit'}
                </Button>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                {t('profile.router_desc', language) || 'Visible only to your immediate neighbors (within 50m).'}
              </p>
            </CardHeader>
            <CardContent className="p-4">
              {isEditingRouter ? (
                <div className="space-y-2">
                  <input 
                    type="text" 
                    value={routerCode} 
                    onChange={(e) => setRouterCode(e.target.value)}
                    className="w-full bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 rounded-lg p-2 text-sm text-slate-900 dark:text-white"
                  />
                  <div className="flex space-x-2">
                    <Button size="sm" className="bg-indigo-600 text-white" onClick={() => setIsEditingRouter(false)}>Save</Button>
                    <Button size="sm" variant="ghost" onClick={() => setIsEditingRouter(false)}>Cancel</Button>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-black/5 dark:bg-white/5 rounded-lg border border-black/10 dark:border-white/10">
                  <p className="font-mono text-sm text-slate-900 dark:text-white font-medium">{routerCode}</p>
                </div>
              )}
            </CardContent>
          </Card>
`;

const neighborsSection = `          {/* My Neighbors */}
          <Card className="glass-panel border-black/10 dark:border-white/10">
            <CardHeader className="border-b border-white/5 pb-4">
              <div className="flex items-center space-x-2">
                <UserPlus className="h-5 w-5 text-emerald-400" />
                <CardTitle className="text-lg text-slate-900 dark:text-white">{t('profile.my_neighbors', language) || 'My Neighbors'}</CardTitle>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                {t('profile.neighbors_desc', language) || 'Add neighbors manually by phone number to share router codes and closer updates.'}
              </p>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="flex space-x-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder={t('profile.search_phone', language) || "Search phone (e.g. +994501112233)"}
                    className="w-full pl-9 pr-4 py-2 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
                    value={searchPhone}
                    onChange={(e) => setSearchPhone(e.target.value)}
                  />
                </div>
                <Button onClick={handleSearch} className="bg-slate-900 text-white dark:bg-white dark:text-slate-900">
                  {t('profile.search', language) || 'Search'}
                </Button>
              </div>
              
              {searchResult && (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-100 dark:border-emerald-800 flex justify-between items-center">
                  <div>
                    <p className="font-medium text-emerald-900 dark:text-emerald-100">{searchResult.name}</p>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400">{searchResult.distance}</p>
                  </div>
                  <Button size="sm" onClick={handleAddNeighbor} className="bg-emerald-500 hover:bg-emerald-600 text-white">
                    {t('profile.add', language) || 'Add'}
                  </Button>
                </div>
              )}

              {addedNeighbors.length > 0 && (
                <div className="pt-2">
                  <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                    {t('profile.added_neighbors', language) || 'Added Neighbors'}
                  </h4>
                  <div className="space-y-2">
                    {addedNeighbors.map((neighbor) => (
                      <div key={neighbor.id} className="flex justify-between items-center p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm">
                            {neighbor.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-900 dark:text-white">{neighbor.name}</p>
                            <p className="text-xs text-slate-500">{neighbor.distance}</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10">
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
`;

const insertionPoint = `        {/* Settings Column */}
        <div className="md:col-span-2 space-y-6">`;

const sectionsToInsert = [
  interestsSection,
  routerCodeSection,
  neighborsSection
].join('\\n');

content = content.replace(insertionPoint, insertionPoint + '\\n' + sectionsToInsert);
fs.writeFileSync('src/components/Profile.tsx', content);
