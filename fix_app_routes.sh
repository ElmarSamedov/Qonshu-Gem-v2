sed -i 's|<Route path="profile"|<Route path="groups" element={<Groups />} />\n            <Route path="profile"|g' src/App.tsx
