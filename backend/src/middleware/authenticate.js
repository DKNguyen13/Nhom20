import { verifyAccessToken } from '../utils/jwt.js';

export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) return res.status(401).json({ success: false, message: 'No token provided' });

  try {
    const decoded = verifyAccessToken(token);

    if (!decoded.id || !decoded.role) {
      return res.status(401).json({ success: false, message: 'Invalid token payload' });
    }

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};

// Kiểm tra admin
export const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Chỉ admin mới được phép' });
  }
  next();
};

// Kiểm tra user tự chỉnh hoặc admin
export const isSelfOrAdmin = (req, res, next) => {
  const targetId = req.params.id;
  if (req.user.id !== targetId && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Không có quyền thực hiện hành động này' });
  }
  next();
};


export const optionalAuth = async (req, res, next) =>{
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    // Không có token -> cho qua
    return next();
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return next();
  }

  try {
    const decoded = verifyAccessToken(token);

    if (!decoded.id || !decoded.role) {
      return res.status(401).json({ success: false, message: 'Invalid token payload' });
    }

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
}
