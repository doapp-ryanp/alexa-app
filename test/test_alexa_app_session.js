/*jshint expr: true*/
"use strict";
var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
var mockHelper = require("./helpers/mock_helper");
chai.use(chaiAsPromised);
var expect = chai.expect;
chai.config.includeStack = true;

describe("Alexa", function() {
  var Alexa = require("../index");
  describe("app", function() {
    describe("#request", function() {
      var mockRequest = mockHelper.load("intent_request_airport_info.json");
      var expectedMessage = "tubular";
      context("intent handler with shouldEndSession = false", function() {
        var app = new Alexa.app("myapp");
        var reqObject;
        var intentHandler = function(req, res) {
          res.say(expectedMessage).shouldEndSession(false);
          res.session("foo", true);
          res.session("bar", {
            qaz: "woah"
          });
          reqObject = req;
          return true;
        };
        app.intent("airportInfoIntent", {}, intentHandler);
        it("responds with a session object", function() {
          var subject = app.request(mockRequest).then(function(response) {
            return response.sessionAttributes;
          });
          return Promise.all([
            expect(subject).to.eventually.become({
              foo: true,
              bar: {
                qaz: "woah"
              }
            })
          ]);
        });

        it("has a res object with expected properties", function() {
          app.intent("airportInfoIntent", {}, intentHandler);
          var subject = app.request(mockRequest).then(function(response) {
            return reqObject;
          });
          return Promise.all([
            expect(subject).to.eventually.have
              .property("applicationId", "amzn1.echo-sdk-ams.app.000000-d0ed-0000-ad00-000000d00ebe"),
            expect(subject).to.eventually.have
              .property("userId", "amzn1.account.AM3B227HF3FAM1B261HK7FFM3A2")
          ]);
        });
      });
    });
  });
});
