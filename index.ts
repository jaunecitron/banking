import { serverConfig } from './config';
import { startApp } from './src/app';

if (typeof module !== 'undefined' && !module.parent) {
  const httpServer = startApp();
  httpServer.listen(serverConfig.app.port);
  console.log(`[APP] Start app ${serverConfig.app.name} listening on port ${serverConfig.app.port}`);
}
