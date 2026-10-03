type EventType =
  | 'user/click'
  | 'user/longpress'
  | 'user/scanQr'
  | 'user/hw'
  | 'os'
  | 'api'
  | 'api/error'
  | 'api/fetchError'
  | 'api/parseError'
  | 'dialog'
  | 'page'
  | 'error'
  | 'tx/snapshot'
  | 'test'

// TODO: implement reportEvent function
export function reportEvent(type: EventType, payload: unknown) {
  // TODO
  console.log('reportEvent', type, payload)
}
