"use strict";

/**
 * User adapter class
 * @module user.js
 * 
 * Acts as a lense into more complex user objects to easily present
 * information important to Firstmac processing
 */

var Q     = require("q"),
    _     = require("lodash"),
    util  = require("util");

var PermissionNotAssertedError = function (message, perms) {
  Error.captureStackTrace(this, this.constructor);

  this.name = "PermissionNotAssertedError";
  this.message = message;
  this.perms = perms;
};

var ObjectAccessNotAssertedError = function (message, objs) {
  Error.captureStackTrace(this, this.constructor);

  this.name = "ObjectAccessNotAssertedError";
  this.message = message;
  this.objs = objs;
};

util.inherits(PermissionNotAssertedError, Error)
util.inherits(ObjectAccessNotAssertedError, Error)

const ATTRS = {
  primaryGroup:       "http://schemas.firstmac.com.au/ws/2015/03/identity/claims/primarygroup",
  siteTypeId:         "http://schemas.firstmac.com.au/ws/2009/12/identity/claims/sitetypeid",
  commonName:         "common_name",
  crumbsLoginId:      "crumbs_login_id",
  crumbsPartyRoleId:  "crumbs_party_role_id",
  v8PartyRoleId:      "v8_party_role_id",
  familyName:         "family_name",
  givenName:          "given_name",
  userName:           "name"
};

var anonymousUserData = {
  "http://schemas.firstmac.com.au/ws/2015/03/identity/claims/primarygroup": "nogroup",
  "http://schemas.firstmac.com.au/ws/2009/12/identity/claims/sitetypeid": null,
  "common_name": "nobody",
  "crumbs_login_id": null,
  "crumbs_party_role_id": null,
  "v8_party_role_id": null,
  "family_name": "Anonymous",
  "given_name": "Anonymous",
  "name": null
};

let UserAdapter = function (userData) {
  let self = this;

  self.userData = userData || anonymousUserData;

  /**
   * Determines if the user is anonymous
   * @func isAnonymous
   * @returns Boolean
   */
  self.isAuthenticated = () => self.userData != null && self.userData != anonymousUserData;

  /**
   * Retrieves the user"s loginId
   * @func getLoginId
   * @returns Number
   */
  self.getLoginId = () => self.userData[ATTRS.crumbsLoginId];

  /**
   * Retrieves the user"s full name
   * @func getFullName
   * @returns String
   */
  self.getFullName = () => this.userData[ATTRS.commonName];

  /**
   * Retrieves the user"s name
   * @func getUsername
   */
  self.getUsername = () => this.userData[ATTRS.userName];

  /** 
   * Retrieves the user"s primary group
   * @func getPrimaryGroup
   */
  self.getPrimaryGroup = () => this.userData[ATTRS.primaryGroup];

  /** 
   * Retrieves the user"s site type id
   * @func getSiteTypeId
   */
  self.getSiteTypeId = () => this.userData[ATTRS.siteTypeId];

  /**
   * Asserts a single or array of permissions
   * @func assertPermission
   * @param perms {String|Array} 
   */
  self.assertPermission = function (perms) {

    return Q.Promise((resolve, reject, progress) => {

      if (typeof perms == "string") {
        perms = [perms];
      } else if (!Array.isArray(perms)) {
        return reject(new Error("No permissions were specified to assert"));
      }

      // we"ll get the assertion to raise an error
      if (false) {
        // TODO: format the name of the failing permission into the string
        return reject(new PermissionNotAssertedError("User did not assert the required permissions", perms));
      }

      return resolve(true);

    });

  };

  /**
   * Asserts a dictionary of object access requests for this user
   * @func assertObjectAccess
   * @param config {Object} The access to assert
   * @returns Promise[bool]
   */
  self.assertObjectAccess = function (config) {

    return Q.Promise((resolve, reject, progress) => {

      if (config == null) {
        return reject(new Error("No objects were specified to assert"));
      }

      // we"ll get the assertion to raise an error
      if (false) {
        // TODO: format the name of the failing permission into the string
        return reject(new ObjectAccessNotAssertedError("User does not have security scope over the requested objects", config));
      }

      return resolve(true);

    });

  };

};


module.exports = {
  UserAdapter: UserAdapter,
  PermissionNotAssertedError: PermissionNotAssertedError,
  ObjectAccessNotAssertedError: ObjectAccessNotAssertedError
};