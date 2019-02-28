/** 2019/2/27
 *author:zhanglibing
 *email:1053081179@qq.com
 *功能:
 */

var PROTO_PATH = "E:/\works/\grpcDemo/protos/server.proto";
var async = require('async');
var fs = require('fs');
var parseArgs = require('minimist');
var path = require('path');
var _ = require('lodash');
var grpc = require('grpc');
var protoLoader = require('@grpc/proto-loader');
var packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {keepCase: true,
     longs: String,
     enums: String,
     defaults: true,
     oneofs: true
    });
var routeguide = grpc.loadPackageDefinition(packageDefinition).routeguide;
var client = new routeguide.RouteGuide('localhost:50052',
                                       grpc.credentials.createInsecure());

var COORD_FACTOR = 1e7;

/**
 * Run the getFeature demo. Calls getFeature with a point known to have a
 * feature and a point known not to have a feature.
 * @param {function} callback Called when this demo is complete
 */
function runGetUserInfo(callback){
  var next = _.after(2, callback);
  function featureCallback(error, userInfo) {
    console.log(userInfo)
    if (error) {
      callback(error);
      return;
    }else{
      return userInfo;
    }
    next();
  }
  client.getUserInfo({id:6}, featureCallback);
}

/**
 * Run all of the demos in order
 */
function main() {
  async.series([
    runGetUserInfo
  ]);
}

if (require.main === module) {
  main();
}

exports.runGetUserInfo = runGetUserInfo;
//
// // exports.runListFeatures = runListFeatures;
//
// exports.runRecordRoute = runRecordRoute;
//
// exports.runRouteChat = runRouteChat;
