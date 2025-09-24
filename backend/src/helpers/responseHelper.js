/**
 * Trả về success response
 * @param {Object} res - Express response object
 * @param {Object} data - Dữ liệu trả về
 * @param {number} statusCode - HTTP status code (mặc định 200)
 * Example: return success(res, {
 *      user,
 *      ...
 * })
 */
export const success = (res, data = {}, statusCode = 200) => {
  return res.status(statusCode).json({
    status: 'success',
    data
  });
};


/**
 * Trả về fail/error response
 * @param {Object} res - Express response object
 * @param {string} message - Thông báo lỗi
 * @param {Object} error - Chi tiết lỗi
 * @param {number} statusCode - HTTP status code (mặc định 400)
 * Example: return fail(res, 'Error fetching user', error.message);
 */
export const fail = (res, message = 'Error', error = null, statusCode = 400) => {
  const response = {
    status: 'fail',
    message
  };
  if (error) {
    response.error = error;
  }
  return res.status(statusCode).json(response);
};