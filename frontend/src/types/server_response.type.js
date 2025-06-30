/* Type definitions*/

/**
 * @typedef {Object} GraphQLServerErrorLocation
 * @property {number} line
 * @property {number} column
 */

/**
 * @typedef {Object} Extensions
 * @property {number} statusCode
 * @property {string} code
 * @property {string[]} stacktrace
 */

/**
 * @typedef {Object} GraphQLServerError
 * @property {string} message
 * @property {GraphQLServerErrorLocation} locations
 * @property {string []} path
 * @property {Extensions} extensions
 */

/**
 * @typedef {Object} LoginData
 * @property {string} login
 */

/**
 * @typedef {Object} SignupObject
 * @property {string} email
 * @property {number} phone_number
 * @property {string} token
 */

/**
 * @typedef {Object} SignupData
 * @property {SignupObject} signUp
 */

/**
 * @typedef {Object} GraphQLServerSignUpResponse
 * @property {GraphQLServerError[]?} errors
 * @property {SignupData | null} data
 */

/**
 * @typedef {Object} GraphQLServerLoginResponse
 * @property {GraphQLServerError[]?} errors
 * @property {LoginData | null} data
 */
