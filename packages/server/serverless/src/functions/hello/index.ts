import schema from './schema';
import { handlerPath } from '@libs/handlerResolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  role: 'generateRole',
  memorySize: 256,
  timeout: 10,
  events: [
    {
      http: {
        method: 'post',
        path: 'hello',
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
