const protocol =
  import.meta.env['VITE_APP_USE_HTTPS'] === 'true'
    ? 'https:'
    : window.location.protocol
const { host } = window.location

/** add protocol if not exist. This allow env URL to contain protocol */
function addProtocol(url: string) {
  return /^https?:/.test(url) ? url : `${protocol}//${url}`
}
const STITCH_URL = addProtocol(
  import.meta.env['VITE_APP_STITCH_ADDRESS_AND_PORT'] ?? `${host}/stitch`,
)
export const NANI_URL = addProtocol(
  import.meta.env['VITE_APP_NANNY_ADDRESS_AND_PORT'] ?? `${host}/nani`,
)

if (import.meta.env.DEV) {
  console.log(`Current Server Info\nStitch: ${STITCH_URL}\nNani: ${NANI_URL}`)
}

export type ApiName = 'nani' | 'stitch'
export function getServerUrl(api: ApiName, isWs = false) {
  const url = api === 'nani' ? NANI_URL : STITCH_URL
  return isWs ? url.replace(/^http/, 'ws') : url // https => wss
}

const API_CUMULUS_URL = [
  '/esthetician/report',
  '/releaseNotes',
  '/validate/rfids',
  '/preflight-config',
  '/client-code/status',
] as const
const API_NANI_URL = ['/version/components', '/ssm-node/register'] as const
const API_MONICA_URL = [
  '/bottles/slots/enabled',
  '/bottles/bottle',
  '/vials/vial',
  '/diag/test',
  '/vacuum/enabled',
  '/vacuum/level',
  '/vacuum/path',
  '/purge/enabled',
  '/overflow/status',
  '/overflow/signal', // Lilo will not use this
  '/overflow/config',
  '/system/status',
] as const

export const API_URL = {
  /** `/cumulus-proxy/syndeo/api${url}` */
  CUMULUS<S extends (typeof API_CUMULUS_URL)[number]>(url: S) {
    return `${getServerUrl('nani')}/cumulus-proxy/syndeo/api${url}` as const
  },
  NANI<S extends (typeof API_NANI_URL)[number]>(url: S) {
    return `${getServerUrl('nani')}${url}` as const
  },
  MONICA<S extends (typeof API_MONICA_URL)[number]>(url: S) {
    return `${getServerUrl('stitch')}/monica-proxy${url}` as const
  },
}
