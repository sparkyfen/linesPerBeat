/**
 * @apiDefinePermission public This information is publicly accessible.
 * No authentication is required.
 *
 * @apiVersion 1.0.0
 */

/**
 * @apiDefinePermission user Authenticated access is required.
 * An account is required.
 *
 * @apiVersion 1.0.0
 */

/**
 * @apiDefinePermission admin Authenticated access is required.
 * An administrative password is required.
 *
 * @apiVersion 1.0.0
 */

/**
 * @api {post} /api/user/login Login
 * @apiVersion 1.0.0
 * @apiName Login
 * @apiGroup User
 * @apiPermission user
 *
 * @apiDescription Logs the user into the site.
 *
 * @apiParam {String} username The username of the account.
 * @apiParam {String} password The password of the account.
 *
 * @apiExample CURL example:
 *      curl -X POST 'http://example.com/api/user/login' -d 'username=foo&password=bar'
 *
 * @apiSuccess {String} message The successful signin message.
 *
 * @apiSuccessExample Success-Response (example):
 *     HTTP/1.1 200 OK
 *     {"message":"Logged in."}
 *
 * @apiError (Bad Request 400) MissingUsername The username was not in the request.
 * @apiError (Bad Request 400) MissingPassword The password was not in the request.
 * @apiError (Bad Request 400) InvalidUsername The username does not exist.
 * @apiError (Bad Request 400) InvalidPassword The password for that user was invalid.
 * @apiError (Internal Server Error 500) ProblemLoggingIn There was an issue on the server serving the request.
 *
 * @apiErrorExample Error-Response (example):
 *     HTTP/1.1 400 Bad Request
 *     {"message":"Missing username."}
 *
 * @apiErrorExample Error-Response (example):
 *     HTTP/1.1 400 Bad Request
 *     {"message":"Missing password."}
 *
 * @apiErrorExample Error-Response (example):
 *     HTTP/1.1 400 Bad Request
 *     {"message":"Invalid username."}
 *
 * @apiErrorExample Error-Response (example):
 *     HTTP/1.1 400 Bad Request
 *     {"message":"Invalid password."}
 *
 * @apiErrorExample Error-Response (example):
 *     HTTP/1.1 500 Internal Server Error
 *     {"message":"Problem logging user foo in."}
 *
 */

/**
 * @api {get} /api/user/logout Logout
 * @apiVersion 1.0.0
 * @apiName Logout
 * @apiGroup User
 * @apiPermission user
 *
 * @apiDescription Logs the user out.
 *
 *
 * @apiExample CURL example:
 *      curl -X GET 'http://example.com/api/user/logout'
 *
 * @apiSuccess {String} message The successful signin message.
 *
 * @apiSuccessExample Success-Response (example):
 *     HTTP/1.1 200 OK
 *     {"message":"Logged out."}
 *
 */

/**
 * @api {get} /api/user/checkCookie Check Cookie
 * @apiVersion 1.0.0
 * @apiName CheckCookie
 * @apiGroup User
 * @apiPermission user
 *
 * @apiDescription Check's the user's cookie
 *
 * @apiExample CURL example:
 *      curl -X GET 'http://example.com/api/user/checkCookie'
 *
 * @apiSuccess {String} message The successful signin message.
 *
 * @apiSuccessExample Success-Response (example):
 *     HTTP/1.1 200 OK
 *     {"message":"Valid."}
 *
 * @apiError (Unauthorized 401) PleaseSignIn The user needs to sign in again.
 *
 * @apiErrorExample Error-Response (example):
 *     HTTP/1.1 401 Unauthorized
 *     {"message":"Please sign in."}
 */

/**
 * @api {post} /api/user/register Register
 * @apiVersion 1.0.0
 * @apiName Register
 * @apiGroup User
 * @apiPermission public
 *
 * @apiDescription Register the user onto the site.
 *
 * @apiParam {String} username The username of the account.
 * @apiParam {String} password The password of the account.
 * @apiParam {String} confirmPassword The confirmation password of the account.
 * @apiParam {String} [firstName] The first name of the user making the account.
 * @apiParam {String} [lastName] The last name of the user making the account.
 *
 * @apiExample CURL example:
 *      curl -X POST 'http://example.com/api/user/register' -d 'username=foo&password=bar&confirmPassword=bar'
 *
 * @apiExample CURL example:
 *      curl -X POST 'http://example.com/api/user/register' -d 'username=foo&password=bar&confirmPassword=bar&firstName=Mister&lastName=Bean'
 *
 * @apiSuccess {String} message The successful registration message.
 *
 * @apiSuccessExample Success-Response (example):
 *     HTTP/1.1 200 OK
 *     {"message":"Registered."}
 *
 * @apiError (Bad Request 400) MissingUsername The username was not in the request.
 * @apiError (Bad Request 400) MissingPasswords The password or passwords were not in the request.
 * @apiError (Bad Request 400) MismatchPasswords The passwords don't match.
 * @apiError (Bad Request 400) UserIdAlreadyExists The user id already exists, the UUID has already been taken (should not happen).
 * @apiError (Bad Request 400) AdminAccountFirst You need to make an administrative account first before a regular user.
 * @apiError (Bad Request 400) UserAlreadyExists The username already exists.
 * @apiError (Internal Server Error 500) ProblemRegistering There was an issue on the server serving the request.
 *
 * @apiErrorExample Error-Response (example):
 *     HTTP/1.1 400 Bad Request
 *     {"message":"Missing username."}
 *
 * @apiErrorExample Error-Response (example):
 *     HTTP/1.1 400 Bad Request
 *     {"message":"Missing password(s)."}
 *
 * @apiErrorExample Error-Response (example):
 *     HTTP/1.1 400 Bad Request
 *     {message: "Passwords don\'t match."}
 *
 * @apiErrorExample Error-Response (example):
 *     HTTP/1.1 400 Bad Request
 *     {message: "User id already exists."}
 *
 * @apiErrorExample Error-Response (example):
 *     HTTP/1.1 400 Bad Request
 *     {message: "You need to make an administrative account first."}
 *
 * @apiErrorExample Error-Response (example):
 *     HTTP/1.1 400 Bad Request
 *     {message: "User already exists."}
 *
 * @apiErrorExample Error-Response (example):
 *     HTTP/1.1 500 Internal Server Error
 *     {"message":"Problem registering user foo, please try again."}
 *
 */

/**
 * @api {get} /api/user/getParticipants Get Participants
 * @apiVersion 1.0.0
 * @apiName GetParticipants
 * @apiGroup User
 * @apiPermission public
 *
 * @apiDescription Gets the list of current participants in the hackathon.
 *
 * @apiExample CURL example:
 *      curl -X GET 'http://example.com/api/user/getParticipants'
 *
 * @apiSuccess {Array} participants The list of participants
 *
 * @apiSuccessExample Success-Response (example):
 *     HTTP/1.1 200 OK
 *     [{"username":"volvox","firstName":"","lastName":"","avatar":"assets/images/default.png","lastfm":{"username":"Brutalhonesty08","currentSong":{"artist":"Avicii","song":"You Make Me","url":"http://www.last.fm/music/Avicii/_/You+Make+Me","lastUpdated":1405406649040},"id":"28175646"},"linesPerMinute":0.10407853419261728,"linesLastUpdated":1405393993756,"admin":true}]
 *
 * @apiError (Internal Service Error 500) ProblemGettingParticipants There was an issue on the server serving the request.
 *
 * @apiErrorExample Error-Response (example):
 *     HTTP/1.1 500 Internal Server Error
 *     {"message": "Problem getting the participant list."}
 */

/**
 * @api {post} /api/user/linkAccounts Link Accounts
 * @apiVersion 1.0.0
 * @apiName LinkAccounts
 * @apiGroup User
 * @apiPermission user
 *
 * @apiDescription Links your Last.FM account with your linesPerBeat account.
 *
 * @apiExample CURL example:
 *      curl -X POST 'http://example.com/api/user/linkAccounts' -d 'lastfmUser=Last.FM'
 *
 * @apiSuccess {string} message The successful link accounts message.
 *
 * @apiSuccessExample Success-Response (example):
 *     HTTP/1.1 200 OK
 *     {"message":"Accounts linked."}
 *
 * @apiError (Bad Request 400) MissingLastFMUsername The Last.FM username was not in the request.
 * @apiError (Bad Request 400) UserAlreadyExists The username already exists.
 * @apiError (Internal Server Error 500) ProblemRegistering There was an issue on the server serving the request.
 * @apiError (Unauthorized 401) PleaseSignIn The user needs to sign in again.
 *
 * @apiErrorExample Error-Response (example):
 *     HTTP/1.1 401 Unauthorized
 *     {"message":"Please sign in."}
 *
 * @apiErrorExample Error-Response (example):
 *     HTTP/1.1 400 Bad Request
 *     {"message":"Missing Last.FM username."}
 *
 * @apiErrorExample Error-Response (example):
 *     HTTP/1.1 500 Internal Server Error
 *     {"message":"Could not link accounts."}
 *
 */

/**
 * @api {post} /api/user/changePassword Change Password
 * @apiVersion 1.0.0
 * @apiName ChangePassword
 * @apiGroup User
 * @apiPermission user
 *
 * @apiDescription Changes your linesPerBeat password.
 *
 * @apiExample CURL example:
 *      curl -X POST 'http://example.com/api/user/changePassword' -d 'oldPassword=foo&newPassword=bar&confirmNewPassword=bar'
 *
 * @apiSuccess {string} message The successful change password message.
 *
 * @apiSuccessExample Success-Response (example):
 *     HTTP/1.1 200 OK
 *     {"message":"Password updated, please sign in."}
 *
 * @apiError (Bad Request 400) MissingOldPassword The old password is missing from the request.
 * @apiError (Bad Request 400) MissingNewPassword The new password is missing from the request.
 * @apiError (Bad Request 400) MissingConfirmNewPassword The confirmed new password is missing from the request.
 * @apiError (Bad Request 400) MismatchPasswords The new password and confirmed new password are not the same.
 * @apiError (Bad Request 400) CannotUseOldPassword Your old password submitted in the request cannot be your new password submitted in the request.
 * @apiError (Bad Request 400) InvalidOldPassword The old password was the incorrect password.
 * @apiError (Internal Server Error 500) ProblemChangingPassword There was an issue on the server serving the request.
 * @apiError (Unauthorized 401) PleaseSignIn The user needs to sign in again.
 *
 * @apiErrorExample Error-Response (example):
 *     HTTP/1.1 401 Unauthorized
 *     {"message":"Please sign in."}
 *
 * @apiErrorExample Error-Response (example):
 *     HTTP/1.1 400 Bad Request
 *     {"message":"Missing old password."}
 *
 * @apiErrorExample Error-Response (example):
 *     HTTP/1.1 400 Bad Request
 *     {"message":"Missing new password(s)."}
 *
 * @apiErrorExample Error-Response (example):
 *     HTTP/1.1 400 Bad Request
 *     {"message":"New passwords don\'t match."}
 *
 * @apiErrorExample Error-Response (example):
 *     HTTP/1.1 400 Bad Request
 *     {"message":"Cannot use old password as new password."}
 *
 * @apiErrorExample Error-Response (example):
 *     HTTP/1.1 400 Bad Request
 *     {"message":"Invalid old password."}
 *
 * @apiErrorExample Error-Response (example):
 *     HTTP/1.1 500 Internal Server Error
 *     {"message":"Problem updating password."}
 *
 */

