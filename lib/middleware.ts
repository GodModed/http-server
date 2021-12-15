import { RequestEvent } from './event/event.ts';

export type Handler = (event: RequestEvent, next: () => void) => void | Promise<void>;
export type Middleware = ReturnType<typeof Middleware>;
export function Middleware(method: string, route: string, handler: Handler) {
  return async function (event: RequestEvent, next: () => void) {
    event.route = route;

    const isPatternPassed = new URLPattern({ pathname: event.route }).test(event.href);
    const isMethodPassed = method == event.method || method == 'ANY';

    return isPatternPassed && isMethodPassed
      ? (await handler(event, next), true)
      : false;
  };
}