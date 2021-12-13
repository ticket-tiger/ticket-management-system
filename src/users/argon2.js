import argon2 from 'argon2';

// hash a password
export const hashPassword = async (password) => {
  try {
    const hash = await argon2.hash(password);
    return hash;
  } catch (err) {
    console.log('could not hash password');
    throw err;
  }
};

// verify password
export const verifyPassword = async (hashedPassword, password) => {
  try {
    if (await argon2.verify(hashedPassword, password)) {
      // password match
    } else {
      // password did not match
    }
  } catch (err) {
    // internal failure
  }
};
