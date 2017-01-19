"use strict";

const expect = require("chai").expect;
const user = require("../lib/user"),
      UserAdapter = user.UserAdapter,
      PermissionNotAssertedError = user.PermissionNotAssertedError,
      ObjectAccessNotAssertedError = user.ObjectAccessNotAssertedError;

let token = `eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6InptcUNwUlVzZlByNjFBUVdPaWlSUjFEaHdKdyIsImtpZCI6InptcUNwUlVzZlByNjFBUVdPaWlSUjFEaHdKdyJ9.eyJpc3MiOiJodHRwczovL2ZpcnN0bWFjIiwiYXVkIjoiaHR0cHM6Ly9maXJzdG1hYy9yZXNvdXJjZXMiLCJleHAiOjI0NzA5ODI4MDAsIm5iZiI6MTQ3MDk3NTYwMCwiY2xpZW50X2lkIjoiaW50ZXJuYWwiLCJzY29wZSI6WyJvcGVuaWQiLCJwcm9maWxlIiwicm9sZXMiLCJzaXRldHlwZSIsImNydW1ic2lkZW50aXR5Il0sInN1YiI6IjU4QTNGODYxODQ0NDQ4NkY4MDEzNTc0RjQiLCJhdXRoX3RpbWUiOjE0NzA5NzU2MDAsImlkcCI6IndpbmF1dGgiLCJuYW1lIjoiU3RhbmRhcmQuVXNlckBmaXJzdG1hYy5jb20uYXUiLCJhcHBsaWNhdGlvbl9uYW1lIjoiQ3J1bWJzIiwiY29tbW9uX25hbWUiOiJTdGFuZGFyZCBVc2VyIiwiY3J1bWJzX2xvZ2luX2lkIjoiMyIsImNydW1ic19wYXJ0eV9yb2xlX2lkIjoiMyIsImVtYWlsIjoiU3RhbmRhcmQuVXNlckBmaXJzdG1hYy5jb20uYXUiLCJmYW1pbHlfbmFtZSI6IlVzZXIiLCJnaXZlbl9uYW1lIjoiU3RhbmRhcmQiLCJodHRwOi8vc2NoZW1hcy5maXJzdG1hYy5jb20uYXUvd3MvMjAwOS8xMi9pZGVudGl0eS9jbGFpbXMvc2l0ZXR5cGVpZCI6IjQiLCJ0ZW5hbnQiOiJpbnRlcm5hbF9jcnVtYnMiLCJ2OF9wYXJ0eV9yb2xlX2lkIjoiMyIsImFtciI6WyJDb29raWVzIl19.Ch_0rWwwJIAVWyvI7oVvLaeYHlVXMMpSLlzUFP2aDmderZLOoLWItcFXNHkWQDg9v7Cco2nWYWZtshwHVX3oEMMQqRbnoN5DHeNbDoPS7bjQ-pK5RsUIzPPYXelqYOpvW69gUmc9YRPyL3fmfFkbOpOtps7QOiz7C0vOjXYWeOo`;

let userData = {
  "iss": "https://firstmac",
  "aud": "https://firstmac/resources",
  "exp": 2470982800,
  "nbf": 1470975600,
  "client_id": "internal",
  "scope": [
    "openid",
    "profile",
    "roles",
    "sitetype",
    "crumbsidentity"
  ],
  "sub": "58A3F8618444486F8013574F4",
  "auth_time": 1470975600,
  "idp": "winauth",
  "name": "Standard.User@firstmac.com.au",
  "application_name": "Crumbs",
  "common_name": "Standard User",
  "crumbs_login_id": "3",
  "crumbs_party_role_id": "3",
  "email": "Standard.User@firstmac.com.au",
  "family_name": "User",
  "given_name": "Standard",
  "http://schemas.firstmac.com.au/ws/2009/12/identity/claims/sitetypeid": "4",
  "tenant": "internal_crumbs",
  "v8_party_role_id": "3",
  "amr": [
    "Cookies"
  ]
};

let stdUser = new UserAdapter(userData);

describe("user", () => {

  describe("UserAdapter", () => {

    it("should be a type", () => {
      expect(UserAdapter).to.be.ok;  
    });

    it("should construct from undefined", () => {
      let user = new UserAdapter();
      expect(user).to.be.ok;
    });

    describe("#isAuthenticated", () => {

      it("should identify an authenticated user", () => {
        let user = new UserAdapter(userData);
        expect(user.isAuthenticated()).to.eq(true);
      });

      it("should identify an anonymous user", () => {
        let user = new UserAdapter(null);
        expect(user.isAuthenticated()).to.eq(false);
      });

    });

    describe("#getLoginId", () => {
      it("should respond", () => expect(stdUser).itself.to.respondTo("getLoginId"));
      it("should extract", () => expect(stdUser.getLoginId()).to.eq(userData.crumbs_login_id));
    });

    describe("#getFullName", () => {
      it("should respond", () => expect(stdUser).itself.to.respondTo("getFullName"));
      it("should extract", () => expect(stdUser.getFullName()).to.eq(userData.common_name));
    });

    describe("#getUsername", () => {
      it("should respond", () => expect(stdUser).itself.to.respondTo("getUsername"));
      it("should extract", () => expect(stdUser.getUsername()).to.eq(userData.name));
    });

    describe("#getPrimaryGroup", () => {
      it("should respond", () => expect(stdUser).itself.to.respondTo("getPrimaryGroup"));
      it("should extract", () => expect(stdUser.getPrimaryGroup()).to.eq(userData["http://schemas.firstmac.com.au/ws/2015/03/identity/claims/primarygroup"]));
    });

    describe("#getSiteTypeId", () => {
      it("should respond", () => expect(stdUser).itself.to.respondTo("getSiteTypeId"));
      it("should extract", () => expect(stdUser.getSiteTypeId()).to.eq(userData["http://schemas.firstmac.com.au/ws/2009/12/identity/claims/sitetypeid"]));
    });

    describe("#assertPermission", () => {
      it("should respond", () => expect(stdUser).itself.to.respondTo("assertPermission"));
    });

    describe("#assertObjectAccess", () => {
      it("should respond", () => expect(stdUser).itself.to.respondTo("assertObjectAccess"));
    });

  });

  describe("PermissionNotAssertedError", () => {

    it("should be a type", () => {
      expect(PermissionNotAssertedError).to.be.ok;  
    });

    describe("#constructor", () => {

      it("should retain its message", () => {
        let message = "Bad permission assertion";
        let err = new PermissionNotAssertedError(message, []);

        expect(err.message).to.be.eq(message);
      });

      it("should retain its permission set", () => {
        let perms = ["a", "b", "c"];
        let err = new PermissionNotAssertedError("", perms);

        expect(err.perms).to.be.eql(perms);
      });

    });

  });

  describe("ObjectAccessNotAssertedError", () => {

    it("should be a type", () => {
      expect(ObjectAccessNotAssertedError).to.be.ok;  
    });

    describe("#constructor", () => {

      it("should retain its message", () => {
        let message = "Bad object assertion";
        let err = new ObjectAccessNotAssertedError(message, []);

        expect(err.message).to.be.eq(message);
      });

      it("should retain its permission set", () => {
        let objs = { "id": [1, 2, 3, 4] };
        let err = new ObjectAccessNotAssertedError("", objs);

        expect(err.objs).to.be.eql(objs);
      });

    });
  });  

});