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

// TODO Add more documentation.