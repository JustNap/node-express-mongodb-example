const usersService = require('./users-service');
const { errorResponder, errorTypes } = require('../../../core/errors');
const { compare, hash } = require('bcrypt');
/**
 * Handle get list of users request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function getUsers(request, response, next) {
  try {
    const users = await usersService.getUsers();
    return response.status(200).json(users);
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle get user detail request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function getUser(request, response, next) {
  try {
    const user = await usersService.getUser(request.params.id);

    if (!user) {
      throw errorResponder(errorTypes.UNPROCESSABLE_ENTITY, 'Unknown user');
    }

    return response.status(200).json(user);
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle create user request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function createUser(request, response, next) {
  try {
    const name = request.body.name;
    const email = request.body.email;
    const password = request.body.password;
    const password_confirm = request.body.password_confirm;

    if (password !== password_confirm){
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'password not same'
      );
    }

    const emailExisting = await usersService.checkEmail(email);
    if (emailExisting) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'EMAIL_ALREADY_TAKEN'
      );
    }

    const success = await usersService.createUser(name, email, password);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to create user'
      );
    }

    return response.status(200).json({ name, email });
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle update user request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function updateUser(request, response, next) {
  try {
    const id = request.params.id;
    const name = request.body.name;
    const email = request.body.email;

    if(email){
      const emailExisting = await usersService.checkEmail(email);
      if (emailExisting) {
        throw errorResponder(
          errorTypes.UNPROCESSABLE_ENTITY,
          'EMAIL_ALREADY_TAKEN'
        );
      }
    }

    const success = await usersService.updateUser(id, name, email);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to update user'
      );
    }

    return response.status(200).json({ id });
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle delete user request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function deleteUser(request, response, next) {
  try {
    const id = request.params.id;

    const success = await usersService.deleteUser(id);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to delete user'
      );
    }

    return response.status(200).json({ id });
  } catch (error) {
    return next(error);
  }
}

async function changePassword(request, response, next){
  try{
    const id = request.params.id;
    const password_lama = request.body.password_lama;
    const password_baru = request.body.password_baru;
    const password_baru_confirm = request.body.password_baru_confirm;

    if(password_baru != password_baru_confirm){
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'password not same'
      );
    }

    const user = await usersService.getUser(request.params.id);
    if(!user){
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Unknown'
      );
    }

    const passValid = await valid(password_lama, user.password);
    if(!passValid){
      throw errorResponder(
        errorTypes.UNAUTHORIZED,
        'Invalid old password'
      );
    }
    
    if (password_baru.length < 6 || password_baru.length > 32) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'New password length must be between 6 and 32 characters'
      );
    }

    const hashPassword_baru = await hash(password_baru);
    const success = await usersService.updatePassword(request.params.id, Password_baru);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to update password'
      );
    }

    return response.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  changePassword,
};
