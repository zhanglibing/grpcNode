/** 2019/2/27
 *author:zhanglibing
 *email:1053081179@qq.com
 *功能:
 */


var PROTO_PATH = "E:/\works/\grpcDemo/protos/server.proto";

var async = require('async');
console.log(PROTO_PATH)

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

var COORD_FACTOR = 1e7;


const mysql = require('mysql');

//链接数据库
let dbSql = (sql, callback) => {
  const db = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'myshop',
    port:3306
  });

  db.connect(function(err){
    if(err){
      console.log('数据库连接失败');
      return false;
    }
    console.log('数据库连接成功');
  });
  db.query(sql, callback);
  db.end();
};

//获取用户信息
function getUserInfo(call,callback){
    let id=call.request.id;
      dbSql(`select * from user where id=${id}`, (error, data) => {
        console.log(data)
        callback(null, {name:data});
      });
}

//启动服务器
function getServer() {
  var server = new grpc.Server();
  server.addProtoService(routeguide.RouteGuide.service, {
    getUserInfo:getUserInfo,
  });
  return server;
}

if (require.main === module) {
  var routeServer = getServer();
  routeServer.bind('0.0.0.0:50052', grpc.ServerCredentials.createInsecure());
  routeServer.start();
}

exports.getServer = getServer;
