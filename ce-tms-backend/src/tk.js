import { randomBytes } from 'crypto';

const tokenSecret = () => randomBytes(64).toString('hex');

console.log(tokenSecret());

// export default tokenSecret;
