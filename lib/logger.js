"use strict";

/**
 * Bunyan logger implementation
 * @module logger
 */

const config          = require("config"),
      bunyan          = require("bunyan"), 
      restifyErrors   = require("restify-errors"),
      KinesisWritable = require("aws-kinesis-writable");

/* the variable to hold the package information, control the number of
   traversals (attempts) as well as the current path that we're testing. 
   Keep in mind, that we seed the path with two traversals already so that
   we get well out of the way of this library's package.json */
let packageJson = null,
    packageJsonAttempts = 0,
    packageJsonPath = "../../package.json";

while (packageJson == null && packageJsonAttempts < 5) {
  
  try {
    packageJson = require(packageJsonPath);
  } catch (e) {
    // don't take any broken state with us, into the next iteration
    packageJson = null;

    // pre-pend another directory traversal
    packageJsonPath = "../" + packageJsonPath;

  } finally {

    // next attempt!
    packageJsonAttempts ++;
  }

}


// if, after all of the iterations we still haven't found
// a candidate package.json file, we should just create one
// by hand, with a name that will trigger the logging server
if (packageJson == null) {
  packageJson = {
    name: "noname"
  };
}

// create the base logger configuration
let loggerOpts = {
  name: packageJson.name,
  
  serializers: {
    req: bunyan.stdSerializers.req,
    res: bunyan.stdSerializers.res,
    err: restifyErrors.bunyanSerializer
  },

  streams: [{
    level: "info",
    stream: process.stdout
  }]
};

/* look for a standard logging block, otherwise just pass in a
   blank object so that we don't start trying to configure the
   kinesis pipeline */
let loggerConf = config.logger || { };

if (loggerConf) {

  // only add the bunyan logstash stream, if there was one supplied
  // in the configuration
  if (loggerConf.kinesis) {

    loggerOpts.streams.push({
      stream: new KinesisWritable(loggerConf.kinesis)
    });

  }

}

let logger = bunyan.createLogger(loggerOpts);

// turn off the logger when we want it muted
if (process.env.LOG_MUTE == 1) {
  logger.level(bunyan.FATAL + 1);  
}

module.exports = logger;