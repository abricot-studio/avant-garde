import schema from './schema';
import { handlerPath } from '@libs/handlerResolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  role: 'generateRole',
  memorySize: 1024,
  timeout: 30,
  events: [
    {
      http: {
        method: 'post',
        path: 'generation',
        private: false,
        request: {
          schemas: {
            'application/json': schema
          }
        }
      }
    }
  ]
}
