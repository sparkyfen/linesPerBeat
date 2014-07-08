cp lib/config/env/development.js.template lib/config/env/development.js
cp lib/config/env/test.js.template lib/config/env/test.js
cp lib/config/env/production.js.template lib/config/env/production.js
echo "Don't forget to update the settings files within lib/config/env"
node install.js