const fs = require('fs');

let feed = fs.readFileSync('src/components/Feed.tsx', 'utf8');

const commentInput = `
                  <div className="flex items-center space-x-2 mt-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-700 text-white text-xs font-medium shrink-0 overflow-hidden">
                      {user?.avatar ? <img src={user.avatar} alt="You" className="w-full h-full object-cover" /> : user?.name.charAt(0)}
                    </div>
                    <Input placeholder="Write a comment..." className="h-8 text-sm bg-white dark:bg-slate-900" />
                  </div>
`;

const newCommentInput = `
                  <VerificationGate compact={true}>
                    <div className="flex items-center space-x-2 mt-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-700 text-white text-xs font-medium shrink-0 overflow-hidden">
                        {user?.avatar ? <img src={user.avatar} alt="You" className="w-full h-full object-cover" /> : user?.name.charAt(0)}
                      </div>
                      <Input placeholder="Write a comment..." className="h-8 text-sm bg-white dark:bg-slate-900" />
                    </div>
                  </VerificationGate>
`;

feed = feed.replace(commentInput, newCommentInput);

fs.writeFileSync('src/components/Feed.tsx', feed);
