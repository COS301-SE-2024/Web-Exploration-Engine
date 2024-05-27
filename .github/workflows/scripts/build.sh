#!/user/bin/env bash
cd wee
npx nx build webscraper
npx nx build frontend

echo "================== build complete =================="