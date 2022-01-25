import argon2 from 'argon2';

// hash a password
export const hashPassword = async (password) => {
  try {
    const hash = await argon2.hash(password);
    return hash;
  } catch (err) {
    throw new Error('Hash');
  }
};

// verify a password
export const verifyPassword = async (hashedPassword, password) => {
  try {
    if (await argon2.verify(hashedPassword, password)) {
      return true;
    }
    return false;
  } catch (err) {
    throw new Error('Verify');
  }
};
