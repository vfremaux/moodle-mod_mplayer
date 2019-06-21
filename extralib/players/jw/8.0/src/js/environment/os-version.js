function execResult(array, index) {
    if (array && array.length > index) {
        return array[index];
    }
}

export function osVersion(osEnvironment, agent) {
    let version;
    let major;
    let minor;

    if (osEnvironment.windows) {
        version = execResult(/Windows(?: NT|)? ([._\d]+)/.exec(agent), 1);
        // Map the Windows NT version to the canonical Windows version
        switch (version) {
            case '6.1':
                version = '7.0';
                break;
            case '6.2':
                version = '8.0';
                break;
            case '6.3':
                version = '8.1';
                break;
            default:
                break;
        }
    } else if (osEnvironment.android) {
        version = execResult(/Android ([._\d]+)/.exec(agent), 1);
    } else if (osEnvironment.iOS) {
        version = execResult(/OS ([._\d]+)/.exec(agent), 1);
    } else if (osEnvironment.mac) {
        version = execResult(/Mac OS X (10[._\d]+)/.exec(agent), 1);
    }

    if (version) {
        major = parseInt(version, 10);
        // Versions may be in the d.d.d or d_d_d format
        const versionNumbers = version.split(/[._]/);
        if (versionNumbers) {
            minor = parseInt(versionNumbers[1], 10);
        }
    }

    // Allow undefined to represent unknown agents
    return {
        version,
        major,
        minor
    };
}
