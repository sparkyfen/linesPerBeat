green=$(tput setaf 2)
reset=$(tput sgr0)
echo "Copying Development Template..."
cp server/config/environment/development.js.template server/config/environment/development.js
echo "Test config will remain the same..."
echo "Copying Production Template..."
cp server/config/environment/production.js.template server/config/environment/production.js
echo "${green}Don't forget to update the settings files within lib/config/env.${reset}"
echo "${green}Make sure to set NODE_ENV environment variable to development.${reset}"
echo "${green}Make sure to run node install.js after the settings files are updated.${reset}"