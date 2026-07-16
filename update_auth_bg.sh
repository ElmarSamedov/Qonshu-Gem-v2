cat src/components/AuthScreen.tsx | awk '
BEGIN { output=1; }
/<div className=\"min-h-screen w-full bg-transparent overflow-y-auto\">/ {
  print "    <div className=\"min-h-screen w-full overflow-y-auto relative\">";
  print "      {/* Full-screen Background Image */}";
  print "      <div className=\"fixed inset-0 z-0\">";
  print "        <img ";
  print "          src=\"https://images.unsplash.com/photo-1524661135-423995f22d0b?w=2000&q=80&fit=crop\" ";
  print "          alt=\"Satellite Neighborhood\" ";
  print "          className=\"w-full h-full object-cover\"";
  print "        />";
  print "        <div className=\"absolute inset-0 bg-black/60 backdrop-blur-[4px]\"></div>";
  print "      </div>";
  print "      <div className=\"relative z-10 flex flex-col\">";
  output=0;
  next;
}
/<div className=\"relative w-full min-h-\[500px\] flex items-center justify-center py-12 px-4\">/ {
  print "      {/* Header / Hero Section */}";
  print "      <div className=\"w-full min-h-[500px] flex items-center justify-center py-12 px-4\">";
  output=0;
  next;
}
/      <\/div>$/ {
  if (footer_closed) {
    print "      </div>";
    print "    </div>";
  } else {
    print;
  }
  output=1;
  next;
}
/      <\/footer>/ {
  print;
  print "      </div>";
  output=1;
  next;
}
{ if (output) print; }
' > src/components/AuthScreen_new.tsx
mv src/components/AuthScreen_new.tsx src/components/AuthScreen.tsx
