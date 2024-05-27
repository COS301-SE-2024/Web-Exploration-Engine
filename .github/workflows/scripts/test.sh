#!/user/bin/env bash
cd wee

npx nx test webscraper
npx nx test frontend
echo "================== test complete =================="
