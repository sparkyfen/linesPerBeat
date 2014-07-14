# Grunt TODO

## client/app/admin/register/register.controller.js

-  **TODO** `(line 19)`  This redirect never lands because the $emit fires $watch which fires a $location.path as well to the root page.

## client/app/changePassword/changePassword.controller.js

-  **TODO** `(line 31)`  Reset the navbar after the user changes their password. The Login word appears but the secondary menu still displays.

## client/app/linkLastFm/linkLastFm.controller.js

-  **TODO** `(line 28)`  Add Material Tooltip when it's available.

## client/app/main/main.html

-  **TODO** `(line 24)`  Add a tooltip to the Admin icon -->

## server/api/linkAccounts/linkAccounts.controller.js

-  **TODO** `(line 33)`  Need to finish getting the signal catcher for the listeners working.

## server/api/updateProfile/updateProfile.controller.js

-  **TODO** `(line 55)`  Kick off Last.FM Listener on updated profile by killing old process and starting new one.

## server/components/database/index.js

-  **TODO** `(line 16)`  Need to add creation of child process DB and inserting into DB and search by PID.
-  **TODO** `(line 34)`  Add Dyanmo initialization.
-  **TODO** `(line 173)`  Delete process from DB when the user is deleted if there is a process running for that user. Implement deleteProcessByUsername().

## server/components/gruntfile/Gruntfile.js

-  **TODO** `(line 38)` 
