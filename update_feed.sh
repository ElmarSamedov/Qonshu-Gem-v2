cat src/components/Feed.tsx | awk '
BEGIN { output=1; }
/const \[activeMoment, setActiveMoment\] = useState<any>\(null\);/ {
  print;
  print "  const [momentDraft, setMomentDraft] = useState<string | null>(null);";
  print "  const [showMomentEditor, setShowMomentEditor] = useState(false);";
  output=0;
  next;
}
/const handleUploadMoment = \(\) => \{/ {
  print;
  print "    const fileInput = document.createElement('\''input'\'');";
  print "    fileInput.type = '\''file'\'';";
  print "    fileInput.accept = '\''image/*'\'';";
  print "    fileInput.onchange = (e: any) => {";
  print "      const file = e.target.files?.[0];";
  print "      if (file) {";
  print "        setMomentDraft(URL.createObjectURL(file));";
  print "        setShowMomentEditor(true);";
  print "      }";
  print "    };";
  print "    fileInput.click();";
  print "  };";
  print "";
  print "  const confirmMomentUpload = () => {";
  print "    if (!momentDraft) return;";
  print "    setShowMomentEditor(false);";
  print "    alert('\''Moment uploaded! AI moderation is checking for 18+ content...'\'');";
  print "    setTimeout(() => {";
  print "      const newMoment = {";
  print "        id: Date.now(),";
  print "        author: user?.name || '\''You'\'',";
  print "        avatar: user?.avatar || null,";
  print "        image: momentDraft,";
  print "        verified: user?.is_verified || false,";
  print "        reactions: []";
  print "      };";
  print "      setMoments([newMoment, ...moments]);";
  print "      setMomentDraft(null);";
  print "    }, 1500);";
  print "  };";
  output=0;
  next;
}
/    const fileInput = document.createElement/ {
  # We already replaced handleUploadMoment content, so we skip until we reach `  return (`
  output=0;
  next;
}
/  return \(/ {
  print;
  output=1;
  next;
}
/      \{\/\* Moment Viewer Modal \*\/\}/ {
  print "      {/* Moment Editor Modal */}";
  print "      {showMomentEditor && momentDraft && (";
  print "        <div className=\"fixed inset-0 z-50 bg-black/90 flex flex-col\">";
  print "          <div className=\"flex items-center justify-between p-4 absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/60 to-transparent\">";
  print "            <button onClick={() => { setShowMomentEditor(false); setMomentDraft(null); }} className=\"text-white hover:bg-white/20 p-2 rounded-full\">";
  print "              <X className=\"w-6 h-6\" />";
  print "            </button>";
  print "            <h3 className=\"text-white font-medium\">Edit Moment</h3>";
  print "            <button onClick={confirmMomentUpload} className=\"text-white bg-blue-600 hover:bg-blue-500 p-2 rounded-full\">";
  print "              <Check className=\"w-5 h-5\" />";
  print "            </button>";
  print "          </div>";
  print "          ";
  print "          <div className=\"flex-1 flex items-center justify-center p-4\">";
  print "            <img src={momentDraft} alt=\"Draft\" className=\"max-h-[70vh] max-w-full object-contain rounded-xl\" />";
  print "          </div>";
  print "          ";
  print "          <div className=\"p-6 absolute bottom-0 left-0 right-0 bg-black/80 flex justify-center space-x-6 border-t border-white/10\">";
  print "            <button className=\"flex flex-col items-center space-y-1 text-white/70 hover:text-white transition-colors\">";
  print "              <Crop className=\"w-6 h-6\" /><span className=\"text-xs\">Crop</span>";
  print "            </button>";
  print "            <button className=\"flex flex-col items-center space-y-1 text-white/70 hover:text-white transition-colors\">";
  print "              <Type className=\"w-6 h-6\" /><span className=\"text-xs\">Text</span>";
  print "            </button>";
  print "            <button className=\"flex flex-col items-center space-y-1 text-white/70 hover:text-white transition-colors\">";
  print "              <Smile className=\"w-6 h-6\" /><span className=\"text-xs\">Emotion</span>";
  print "            </button>";
  print "            <button className=\"flex flex-col items-center space-y-1 text-white/70 hover:text-white transition-colors\">";
  print "              <Sticker className=\"w-6 h-6\" /><span className=\"text-xs\">Sticker</span>";
  print "            </button>";
  print "            <button className=\"flex flex-col items-center space-y-1 text-white/70 hover:text-white transition-colors\">";
  print "              <ImageIcon className=\"w-6 h-6\" /><span className=\"text-xs\">Add Photo</span>";
  print "            </button>";
  print "          </div>";
  print "        </div>";
  print "      )}";
  print "";
  print;
  output=1;
  next;
}
{ if (output) print; }
' > src/components/Feed_new.tsx
mv src/components/Feed_new.tsx src/components/Feed.tsx
