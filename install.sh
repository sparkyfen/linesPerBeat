green=$(tput setaf 2)
reset=$(tput sgr0)
echo -e "Copying Development Template..."
cp lib/config/env/development.js.template lib/config/env/development.js
echo -e "Copying Test Template..."
cp lib/config/env/test.js.template lib/config/env/test.js
echo -e "Copying Production Template..."
cp lib/config/env/production.js.template lib/config/env/production.js
echo -e "${green}Don't forget to update the settings files within lib/config/env.${reset}"
node install.js