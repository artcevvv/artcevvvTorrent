'use strict';

import crypto from 'crypto';

let id = null;

const genId = () => {
    if (!id) {
        id = crypto.randomBytes(20);
        Buffer.from('-AT001-').copy(id, 0);
    }
    return id;
}

export default genId;