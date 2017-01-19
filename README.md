# Firstmac commons 

This library is intended to hold a lot of the cross-cutting concerns employed in node.js api projects.

## Modules

The modules contained within the library are listed in the table below.

| Name | File          | Description                                                  |
|------|---------------|--------------------------------------------------------------|
|logger|`lib/logger.js`| Console and stream logging                                   |
|user  |`lib/user.js`  | User identification handling                                 |

## Logging

The logging library uses [bunyan](https://github.com/trentm/node-bunyan) as its base library. Some initial configuration is applied over the top of it to get it to fit withing the Firstmac architecture.

These JSON log packets are sent out to a streaming service for further processing. At the time of this document's writing, this service is [Amazon Kinesis](https://aws.amazon.com/kinesis/streams/).

### Application identification

There is a `while` loop that will run when the logger is first instantiated within the module. This while loop will walk the directory tree up until it finds a `package.json` file that is appropriate to be used to *name* the logging session.

The walking process here starts two levels above this library and will only walk a *maximum of 5 levels* before it quits and retires with an object that looks as follows:

```
{ 
  name: 'noname'
}
```

This should be an indicator to the developer that this initial process has failed. It will need to be addressed as the `name` attribute is paramount to the stream processing later on in the architecture.