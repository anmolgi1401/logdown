/* 
* Library for log http request
*
*
*/

// Dependencies
var _helpers = require('./helpers/helper');
var _log = require('./helpers/log');
var fs = require('fs');

//container for the library
var lib = {};

// logger midleware function 
lib.logger = function(options){
    var options = typeof(options) == 'object' ? options : {};
        if(options == null){
            console.log('loging fails bad argument provided');
        } else {
            return function (req, res, next) {

                req.requestId = _helpers.createRandomString(8);
                var parameters = {
                    userAgent: req.headers['user-agent'],
                    requestId: req.requestId,
                    method   :req.method,
                    url : req.originalUrl
                }
               
                console.info(`${new Date().toISOString()}[${req.requestId} ${req.headers['user-agent']}] ${req.method} ${req.originalUrl}`);

                const cleanup = () => {
                    res.removeListener('finish', logFn)
                    res.removeListener('close', abortFn)
                    res.removeListener('error', errorFn)
                }

                const logFn = () => {
                    cleanup()
                    const logger = lib._getLoggerForStatusCode(res.statusCode);
                    parameters.status = res.statuscode;
                    parameters.statusMessage = res.statusMessage;
                    parameters.contentLength = res.get('Content-Length') || 0 + 'b sent';
                    logger(`[${req.requestId}] ${req.method} ${req.originalUrl} ${Date.now()} ${res.statusCode} ${res.statusMessage}; ${res.get('Content-Length') || 0}b sent`);
                    _log.append(options.fileName, parameters);
                }

                const abortFn = () => {
                    cleanup()
                    console.warn('Request aborted by the client')
                }

                const errorFn = err => {
                    cleanup()
                    console.error(`Request pipeline error: ${err}`)
                }

                res.on('finish', logFn) // successful pipeline (regardless of its response)
                res.on('close', abortFn) // aborted pipeline
                res.on('error', errorFn) // pipeline internal error


                next();
}
        }
    
}


lib._getLoggerForStatusCode = (statusCode) => {
    if (statusCode >= 500) {
        return console
            .error
            .bind(console)
    }
    if (statusCode >= 400) {
        return console
            .warn
            .bind(console)
    }

    return console
        .log
        .bind(console)
}

module.exports = lib;