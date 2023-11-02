const express = require("express");
const http = require("http");
const app = express();
const server = http.Server(app);
const router = require("./app/routers");
const {host ,port} = require("./config").app;
const {projectHost ,projectName} = require("./config").project;
const {logger ,responseStatus} = require("./utils");
const createError = require('http-errors');

app.use(express.json());

router(app);

server.listen(port,host,()=>{
    logger(`${projectHost}'s ${projectName} app listening on port ${port}`);
    logger(`http://${host}:${port}`);
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    logger(`[APP ERROR]: METHOD:${req.method} URL:${req.url}`);
    logger(req.headers)
    res.status(err.status || 500);
    return res.send(responseStatus.unexpected());
});

const handleUncaughtExceptionOrRejection = err => {
	logger('Uncaughted Exception or Unhandled Rejection happens!')
	// 記錄錯誤下來，等到所有其他服務處理完成，然後停掉當前進程。
	logger(err);
	server.close(() => {
		process.exit(1)
	});
}

process.on('unhandledRejection', handleUncaughtExceptionOrRejection);
process.on('uncaughtException', handleUncaughtExceptionOrRejection);

module.exports = app;