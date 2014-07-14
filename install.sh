green=$(tput setaf 2)
reset=$(tput sgr0)
echo "Copying Development Template..."
cp lib/config/env/development.js.template lib/config/env/development.js
echo "Test config will remain the same..."
echo "Copying Production Template..."
cp lib/config/env/production.js.template lib/config/env/production.js
echo "${green}Don't forget to update the settings files within lib/config/env.${reset}"
echo "${green}Make sure to run node install.js after the settings files are updated.${reset}"