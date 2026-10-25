/**
 * Splits a dot-separated version string (e.g. `"2.0.34"`) into its numeric
 * parts, or `null` if any part isn't a plain non-negative integer.
 *
 * @param version - The version string to parse.
 * @returns The parsed numeric parts, or `null` if parsing failed.
 */
function parseVersionParts(version: string): number[] | null {
  const parts = version.trim().split('.');
  const numbers = parts.map((part) => Number(part));
  return numbers.every((value) => Number.isInteger(value) && value >= 0)
    ? numbers
    : null;
}

/**
 * Checks whether `serverVersion` is semantically newer than
 * `clientVersion`, comparing dot-separated numeric parts (e.g.
 * `"2.1.0"` > `"2.0.34"`) left to right. Equal versions are never
 * considered "newer" — there's nothing to update in that case.
 *
 * Falls back to a simple string inequality check if either version can't
 * be parsed as plain dot-separated integers, so the check still degrades
 * gracefully for unexpected version formats.
 *
 * @param serverVersion - The latest published app version, e.g. from the
 *   daily payload.
 * @param clientVersion - The version currently running on the client, e.g.
 *   `__APP_VERSION__`.
 * @returns Whether `serverVersion` is newer than `clientVersion`.
 */
export function isVersionNewer(
  serverVersion: string,
  clientVersion: string,
): boolean {
  if (serverVersion === clientVersion) {
    return false;
  }

  const serverParts = parseVersionParts(serverVersion);
  const clientParts = parseVersionParts(clientVersion);

  if (!serverParts || !clientParts) {
    // Already confirmed not equal above; without a parseable numeric
    // format there's no sensible "newer" direction, so treat any
    // difference as an update worth surfacing.
    return true;
  }

  const length = Math.max(serverParts.length, clientParts.length);
  for (let index = 0; index < length; index++) {
    const serverPart = serverParts[index] ?? 0;
    const clientPart = clientParts[index] ?? 0;
    if (serverPart !== clientPart) {
      return serverPart > clientPart;
    }
  }

  return false;
}
