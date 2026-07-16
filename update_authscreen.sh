cat src/components/AuthScreen.tsx | awk '
BEGIN { output=1; }
/        \{\/\* Background Image \*\/\}/ {
  output=0;
  next;
}
/        \{\/\* Auth Card \*\/\}/ {
  print;
  output=1;
  next;
}
{ if (output) print; }
' > src/components/AuthScreen_new.tsx
mv src/components/AuthScreen_new.tsx src/components/AuthScreen.tsx
