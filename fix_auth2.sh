sed -i '/<label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t('\''auth.account_type'\'', language)}<\/label>/i\
              <div className="space-y-2">\
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Property Type</label>\
                <div className="flex space-x-4 mb-2">\
                  <label className="flex items-center space-x-2 text-slate-900 dark:text-white">\
                    <input type="radio" value="apartment" checked={propertyType === '\''apartment'\''} onChange={() => setPropertyType('\''apartment'\'')} className="text-blue-500 bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10" />\
                    <span>Apartment Building</span>\
                  </label>\
                  <label className="flex items-center space-x-2 text-slate-900 dark:text-white">\
                    <input type="radio" value="development" checked={propertyType === '\''development'\''} onChange={() => setPropertyType('\''development'\'')} className="text-blue-500 bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10" />\
                    <span>Planned Development</span>\
                  </label>\
                </div>\
              </div>\
\
              <div className="space-y-2">\
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Street Address</label>\
                <Input\
                  type="text"\
                  placeholder="Street Address"\
                  value={streetAddress}\
                  onChange={(e) => setStreetAddress(e.target.value)}\
                  className="bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-500 dark:text-slate-500"\
                />\
              </div>\
\
              <div className="grid grid-cols-2 gap-4">\
                <div className="space-y-2">\
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Building Number</label>\
                  <Input\
                    type="text"\
                    placeholder="Building Number"\
                    value={buildingNumber}\
                    onChange={(e) => setBuildingNumber(e.target.value)}\
                    className="bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-500 dark:text-slate-500"\
                  />\
                </div>\
                {propertyType === '\''apartment'\'' && (\
                  <div className="space-y-2">\
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Apartment Number</label>\
                    <Input\
                      type="text"\
                      placeholder="Apt Number"\
                      value={apartmentNumber}\
                      onChange={(e) => setApartmentNumber(e.target.value)}\
                      className="bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-500 dark:text-slate-500"\
                    />\
                  </div>\
                )}\
              </div>' src/components/AuthScreen.tsx
