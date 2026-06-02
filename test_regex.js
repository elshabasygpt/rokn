console.log('VALUES ($1, $2) DO UPDATE $2'.replace(/\$([0-9]+)/g, '?$1'));
