#!/bin/bash
find src/components -type f -name "*.tsx" -exec sed -i \
  -e 's/\btext-white\b/text-slate-900 dark:text-white/g' \
  -e 's/\bbg-white\/5\b/bg-black\/5 dark:bg-white\/5/g' \
  -e 's/\bbg-white\/10\b/bg-black\/10 dark:bg-white\/10/g' \
  -e 's/\bbg-white\/20\b/bg-black\/20 dark:bg-white\/20/g' \
  -e 's/\bborder-white\/10\b/border-black\/10 dark:border-white\/10/g' \
  -e 's/\bborder-white\/20\b/border-black\/20 dark:border-white\/20/g' \
  -e 's/\bborder-white\/30\b/border-black\/30 dark:border-white\/30/g' \
  -e 's/\bbg-black\/40\b/bg-white\/60 dark:bg-black\/40/g' \
  -e 's/\bbg-black\/60\b/bg-white\/80 dark:bg-black\/60/g' \
  -e 's/\bbg-black\/20\b/bg-white\/40 dark:bg-black\/20/g' \
  -e 's/\btext-slate-400\b/text-slate-600 dark:text-slate-400/g' \
  -e 's/\btext-slate-300\b/text-slate-700 dark:text-slate-300/g' \
  -e 's/\btext-slate-200\b/text-slate-800 dark:text-slate-200/g' \
  -e 's/\btext-slate-500\b/text-slate-500 dark:text-slate-500/g' \
  {} +
