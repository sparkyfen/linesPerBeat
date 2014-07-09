# Grunt TODO

## app/scripts/controllers/admin.js

-  **TODO** `(line 15)`  The userList item is being deleted but the ng-repeat leaves some HTML elements. (The delete button).

## app/scripts/controllers/navbar.js

-  **TODO** `(line 45)`  Sometimes the user will show on the navbar, sometimes it won't.

## lib/controllers/admin.js

-  **TODO** `(line 8)`  Validate admin password and then send session.

## lib/controllers/user.js

-  **TODO** `(line 37)`  Need to finish getting the signal catcher for the listeners working.
-  **TODO** `(line 242)`  Update avatars for users.

## lib/database/index.js

-  **TODO** `(line 17)`  Need to add creation of child process DB and inserting into DB and search by PID.
-  **TODO** `(line 35)`  Add Dyanmo initialization.
-  **TODO** `(line 159)`  Delete process from DB when the user is deleted if there is a process running for that user. Implement deleteProcessByUsername().
