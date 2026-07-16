import React from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Gift } from 'lucide-react';

export default function BirthdaySettings() {
  const { user, updateUser } = useAuthStore();
  const [editing, setEditing] = React.useState(false);
  const [birthday, setBirthday] = React.useState(user?.birthday || '');
  const [allowPublic, setAllowPublic] = React.useState(user?.allowBirthdayPublic ?? true);

  const handleSave = () => {
    updateUser({ birthday, allowBirthdayPublic: allowPublic });
    setEditing(false);
  };

  return (
    <Card className="glass-panel border-black/10 dark:border-white/10 mt-6">
      <CardHeader className="border-b border-black/10 dark:border-white/5 pb-4 flex flex-row items-center justify-between">
        <div className="flex items-center space-x-2">
          <Gift className="h-5 w-5 text-pink-500" />
          <CardTitle className="text-lg text-slate-900 dark:text-white">Birthday</CardTitle>
        </div>
        {!editing && (
          <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
            Edit
          </Button>
        )}
      </CardHeader>
      <CardContent className="p-4">
        {!editing ? (
          <div className="space-y-2">
            <p className="text-sm text-slate-700 dark:text-slate-300">
              {user?.birthday ? new Date(user.birthday).toLocaleDateString() : 'Not set'}
            </p>
            {user?.birthday && (
              <p className="text-xs text-slate-500">
                {user?.allowBirthdayPublic ? 'Visible to neighbors in calendar' : 'Private'}
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-slate-500">Date of Birth</label>
              <Input 
                type="date" 
                value={birthday}
                onChange={e => setBirthday(e.target.value)}
                className="mt-1 bg-black/5 dark:bg-white/5 border-none"
              />
            </div>
            {birthday && (
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="allowPublic"
                  checked={allowPublic}
                  onChange={e => setAllowPublic(e.target.checked)}
                  className="rounded border-slate-300 text-indigo-500 focus:ring-indigo-500"
                />
                <label htmlFor="allowPublic" className="text-sm text-slate-600 dark:text-slate-400">
                  Allow neighbors to see my birthday in the calendar
                </label>
              </div>
            )}
            <div className="flex justify-end space-x-2 pt-2">
              <Button variant="ghost" size="sm" onClick={() => { setEditing(false); setBirthday(user?.birthday || ''); }}>Cancel</Button>
              <Button size="sm" onClick={handleSave} className="bg-indigo-500 text-white hover:bg-indigo-600">Save</Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
