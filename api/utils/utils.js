import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import cache from '../../db/cache.js';

const ACCESS_SECRET = process.env.ACCESS_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;

const generateTokens = (user_id, role, device_id) => {
  // generate access token
  const accessToken = jwt.sign(
    { user_id: user_id, role: role },
    ACCESS_SECRET,
    { expiresIn: '15m' } // short expiration time for access token so that the auth system can be used statelessly with low risk. Else, would have to keep a blacklist of tokens on logout
  );

  // generate refresh token
  const refreshToken = jwt.sign(
    { user_id: user_id, role: role },
    REFRESH_SECRET,
    { expiresIn: '7d' }
  );

  // store refresh token in cache
  const key = `${user_id}:${device_id}`; // this kind of a key allows a user to maintain sessions across multiple devices
  cache.set(key, refreshToken);

  return { accessToken, refreshToken };
};

const refreshAccessToken = (refreshToken, device_id) => {
  // verify refresh token
  let payload;
  try {
    payload = jwt.verify(refreshToken, REFRESH_SECRET);
  } catch (error) {
    return null;
  }
  // check if refresh token exists in cache
  const key = `${payload.user_id}:${device_id}`;
  const cachedRefreshToken = cache.get(key);
  if (refreshToken !== cachedRefreshToken) {
    return null;
  }

  // generate new access token
  const newAccessToken = jwt.sign(
    { user_id: payload.user_id, role: payload.role },
    ACCESS_SECRET,
    {
      expiresIn: '15m',
    }
  );

  // ROTATE REFRESH TOKENS
  // generate new refresh token
  const newRefreshToken = jwt.sign(
    { user_id: payload.user_id, role: payload.role },
    REFRESH_SECRET,
    { expiresIn: '7d' }
  );

  // store new refresh token in cache
  cache.set(key, newRefreshToken);

  return { newAccessToken, newRefreshToken };
};

const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, ACCESS_SECRET);
    return decoded;
  } catch (error) {
    return null;
  }
};

const comparePassword = async (password, hashedPassword) => {
  const match = await bcrypt.compare(password, hashedPassword);
  return match;
};

const removeRefreshKey = (user_id, device_id) => {
  const key = `${user_id}:${device_id}`;
  cache.del(key);
};

export {
  generateTokens,
  refreshAccessToken,
  verifyToken,
  comparePassword,
  removeRefreshKey,
};
