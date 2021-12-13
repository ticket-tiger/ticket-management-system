import { randomBytes } from 'crypto';

const tokenSecret = () => {
  crypto.randomBytes(64).toString('hex');
};

console.log(tokenSecret());

// export default tokenSecret;
