cat src/components/Chat.tsx | awk '
BEGIN { output=1; }
/import \{ Card, CardContent \} from '\''\.\/ui\/card'\'';/ {
  print "import { Card, CardContent } from '\''./ui/card'\'';";
  output=0;
  next;
}
/import \{ Send, Store, User, ArrowLeft \} from '\''lucide-react'\'';/ {
  print "import { Send, Store, User, ArrowLeft, Smile, Reply } from '\''lucide-react'\'';";
  output=0;
  next;
}
/            \{\/\* Messages \*\/\}/ {
  print;
  print "            <div className=\"flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar\">";
  print "              {activeChat.messages.map((msg, idx) => (";
  print "                <div key={idx} className={`flex ${msg.senderId === '\''me'\'' ? '\''justify-end'\'' : '\''justify-start'\''}`}>";
  print "                  <div className={`group relative max-w-[75%] p-3 rounded-2xl ${msg.senderId === '\''me'\'' ? '\''bg-blue-600 text-white rounded-tr-sm'\'' : '\''bg-black/10 dark:bg-white/10 text-slate-800 dark:text-slate-200 rounded-tl-sm'\''}`}>";
  print "                    <p className=\"text-sm\">{msg.text}</p>";
  print "                    <span className=\"text-[10px] opacity-60 mt-1 block text-right\">";
  print "                      {msg.timestamp.toLocaleTimeString([], { hour: '\''2-digit'\'', minute: '\''2-digit'\'' })}";
  print "                    </span>";
  print "                    ";
  print "                    {/* Reaction & Reply buttons on hover */}";
  print "                    <div className={`absolute top-1/2 -translate-y-1/2 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity ${msg.senderId === '\''me'\'' ? '\''right-full mr-2'\'' : '\''left-full ml-2'\''}`}>";
  print "                      <button className=\"w-6 h-6 rounded-full bg-white dark:bg-slate-700 shadow flex items-center justify-center text-slate-500 hover:text-blue-500 transition-colors\">";
  print "                        <Smile className=\"w-3 h-3\" />";
  print "                      </button>";
  print "                      <button className=\"w-6 h-6 rounded-full bg-white dark:bg-slate-700 shadow flex items-center justify-center text-slate-500 hover:text-blue-500 transition-colors\">";
  print "                        <Reply className=\"w-3 h-3\" />";
  print "                      </button>";
  print "                    </div>";
  print "                  </div>";
  print "                </div>";
  print "              ))}";
  print "            </div>";
  output=0;
  next;
}
/            \{\/\* Input Area \*\/\}/ {
  print;
  output=1;
  next;
}
{ if (output) print; }
' > src/components/Chat_new.tsx
mv src/components/Chat_new.tsx src/components/Chat.tsx
