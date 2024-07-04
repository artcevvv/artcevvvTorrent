'use strict';

function bigintToBuffer(bigint, size) {
    const buffer = Buffer.alloc(size);
    let hex = buffer.toString(16);
    if (hex.length % 2) {
        hex = '0' + hex;
    }
    const bigEndBuf = Buffer.from(hex, 'hex');
    const offset = size - bigEndBuf.length;
    if (offset < 0) {
        throw new Error('Buffer size is too small');
    }
    bigEndBuf.copy(buffer, offset);
    return buffer;
}

export { bigintToBuffer };