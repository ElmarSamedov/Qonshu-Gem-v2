#!/bin/bash
find src/components -type f -name "*.tsx" -exec sed -i \
  -e '/from-[a-z]*-*[456]00/s/text-slate-900 dark:text-white/text-white/g' \
  -e '/bg-blue-600/s/text-slate-900 dark:text-white/text-white/g' \
  -e '/bg-blue-500/s/text-slate-900 dark:text-white/text-white/g' \
  -e '/bg-red-500/s/text-slate-900 dark:text-white/text-white/g' \
  -e '/bg-rose-600/s/text-slate-900 dark:text-white/text-white/g' \
  -e '/bg-orange-500/s/text-slate-900 dark:text-white/text-white/g' \
  -e '/bg-indigo-500/s/text-slate-900 dark:text-white/text-white/g' \
  {} +
