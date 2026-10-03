export type EventType =
  | 'user/click'
  | 'user/longpress'
  | 'page/opened'
  | 'dialog/opened'
  | 'dialog/closed'
  | 'api/succeeded'
  | 'api/failed'
  | 'sse_con/opened'
  | 'sse_con/closed'
  | 'sse_con/failed'
  | 'sse_msg/succeeded'
  | 'sse_msg/failed'

export function reportEvent(
  type: EventType,
  name: string,
  payload: unknown,
): void {
  console.log(type, name, payload)
}
