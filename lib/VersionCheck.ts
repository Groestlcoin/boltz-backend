type Version = string | number;

class VersionCheck {
  private static chainClientVersionLimits = {
    minimal: 2180200,
    maximal: 2201000,
  };

  private static lndVersionLimits = {
    minimal: '0.10.0',
    maximal: '0.10.3',
  };

  public static checkChainClientVersion = (symbol: string, version: number): void => {
    const { maximal, minimal } = VersionCheck.chainClientVersionLimits;

    if (version > maximal || version < minimal) {
      throw VersionCheck.unsupportedVersionError(`${symbol} Core`, version, maximal, minimal);
    }
  }

  public static checkLndVersion = (symbol: string, version: string): void => {
    const parseStringVersion = (version: string) => {
      return Number(version.split('-')[0].replace('.', ''));
    };

    const { maximal, minimal } = VersionCheck.lndVersionLimits;
    const versionNumber = parseStringVersion(version);

    if (versionNumber > parseStringVersion(maximal) || versionNumber < parseStringVersion(minimal)) {
      throw VersionCheck.unsupportedVersionError(`${symbol} LND`, version, maximal, minimal);
    }
  }

  private static unsupportedVersionError = (service: string, actual: Version, maximal: Version, minimal: Version) => {
    return `unsupported ${service} version: ${actual}; max version ${maximal}; min version ${minimal}`;
  }
}

export default VersionCheck;
