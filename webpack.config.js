const builtinFallbackMap = {
    // Reference: https://github.com/webpack/webpack/blob/c181294865dca01b28e6e316636fef5f2aad4eb6/lib/ModuleNotFoundError.js#L13
    assert: 'assert/',
    buffer: 'buffer/',
    console: 'console-browserify',
    constants: 'constants-browserify',
    crypto: 'crypto-browserify',
    domain: 'domain-browser',
    events: 'events/',
    http: 'stream-http',
    https: 'https-browserify',
    os: 'os-browserify/browser',
    path: 'path-browserify',
    punycode: 'punycode/',
    process: 'process/browser',
    querystring: 'querystring-es3',
    stream: 'stream-browserify',
    _stream_duplex: 'readable-stream/duplex',
    _stream_passthrough: 'readable-stream/passthrough',
    _stream_readable: 'readable-stream/readable',
    _stream_transform: 'readable-stream/transform',
    _stream_writable: 'readable-stream/writable',
    string_decoder: 'string_decoder/',
    sys: 'util/',
    timers: 'timers-browserify',
    tty: 'tty-browserify',
    url: 'url/',
    util: 'util/',
    vm: 'vm-browserify',
    zlib: 'browserify-zlib',
};

const fallbacks = {};

const appPackageJson = require("./package.json");

for (const [nodeModule, fallbackModule] of Object.entries(builtinFallbackMap)) {
    const [fallbackModuleName] = fallbackModule.split('/');

    if (appPackageJson.dependencies[fallbackModuleName]) {
        // Check app package.json for fallback dependency making sure we use project installed fallbacks
        try {
            // Use installed fallback
            fallbacks[nodeModule] = require.resolve(fallbackModule);
        } catch (e) {
            // If ever fallback resolve failed
        }
    }
}

module.exports = {
    resolve: {
        fallback: fallbacks
    }
}