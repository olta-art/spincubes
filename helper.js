// Helps set up custom fog controls.
export class FogGUI {
  constructor(fog, backgroundColor) {
    this.fog = fog
    this.backgroundColor = backgroundColor
  }
  get near() {
    return this.fog.near
  }
  set near(v) {
    this.fog.near = v
    this.fog.far = Math.max(this.fog.far, v)
  }
  get far() {
    return this.fog.far
  }
  set far(v) {
    this.fog.far = v
    this.fog.near = Math.min(this.fog.near, v)
  }
  get color() {
    return `#${this.fog.color.getHexString()}`
  }
  set color(hexString) {
    this.fog.color.set(hexString)
    this.backgroundColor.set(hexString)
  }
}

// Helps parse URL search params.
export function getSearchParams(...params) {
  const url = new URL(self.location.href)

  return params.map(p => ({ [p]: url.searchParams.get(p) })).reduce((a, b) => ({ ...a, ...b }), {})
}

// Helps run HTTP requests.
export function downloader(timeout = 100 * 1000) {
  return async (url, options = {}) => {
    // Guard against unresponsive calls.
    const controller = new AbortController()

    const timer = setTimeout(() => {
      clearTimeout(timer)
      controller.abort()
    }, timeout)

    try {
      const response = await fetch(url, {
        signal: controller.signal,
        ...options,
      })

      if (response.ok) {
        return await response.json()
      }

      throw new Error(`${response.status}: ${response.statusText || "Error"}.`)
    } catch (e) {
      // Forward to caller, JSON parsing errors end up here too.
      throw e
    }
  }
}

// Helps run data queries.
export async function queryfetcher(url, query, settings = {}) {
  const download = downloader(20000)
  const options = {
    body: JSON.stringify({ query }),
    headers: {
      "Content-Type": "application/json",
    },
    method: "post",
    // Allow for overriding default options.
    ...settings,
  }

  try {
    const response = await download(url, options)

    response?.errors?.forEach((e) => {
      throw new Error(e.message)
    })

    return response?.data
  } catch (e) {
    throw e
  }
}
