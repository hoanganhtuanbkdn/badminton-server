import { HttpException, HttpStatus, NotAcceptableException } from '@nestjs/common';

export const BaseError = {
  HEADER_HOST_NOT_ACCEPTABLE: (msg = 'Header host not acceptable') => new NotAcceptableException(msg),

  MOBILE_EXIST: (msg = 'This mobile number is related to an existing account. Do you want to sign in?') =>
    new HttpException(msg, HttpStatus.BAD_REQUEST),

  EMAIL_EXIST: (msg = 'This email is related to an existing account. Do you want to sign in?') =>
    new HttpException(msg, HttpStatus.BAD_REQUEST),

  BUSINESS_NAME_EXIST: (msg = 'This business name is related to an existing account. Do you want to sign in?') =>
    new HttpException(msg, HttpStatus.BAD_REQUEST),

  MOBILE_NOT_EXIST: (msg = 'This mobile number is not exist. Do you want to sign up?') =>
    new HttpException(msg, HttpStatus.BAD_REQUEST),

  MOBILE_HAS_BEEN_REGISTED: (msg = 'This mobile number is not exist. Do you want to sign up?') =>
    new HttpException(msg, HttpStatus.BAD_REQUEST),

  PASSWORD_NOT_MATCH: (msg = 'This password is not match. Please try again.') =>
    new HttpException(msg, HttpStatus.UNAUTHORIZED),

  PASSWORD_NOT_MATCH_1556: (msg = 'This password is not match. Please try again.') =>
    new HttpException(msg, HttpStatus.BAD_REQUEST),

  PASSWORD_NOT_MET_CONDITION: (
    msg = 'The password must have at least 8 characters containing uppercase letters, lowercase letters, numbers, and special characters.',
  ) => new HttpException(msg, HttpStatus.BAD_REQUEST),

  CANNOT_CHANGE_PASSWORD: (msg = 'Cannot change password due to the request passed not reach to 24 hours.') =>
    new HttpException(msg, HttpStatus.BAD_REQUEST),

  INFO_NOT_AVAILABLE: (msg = 'Information not available, please try again later.') =>
    new HttpException(msg, HttpStatus.BAD_REQUEST),

  NOT_ENOUGH_INFORMATION_TO_PROCESS: (msg = 'Not enough information to process.') =>
    new HttpException(msg, HttpStatus.BAD_REQUEST),

  LESS_THAN_PIXELS: (msg = 'The resolution is less than 300x300 pixels.') =>
    new HttpException(msg, HttpStatus.BAD_REQUEST),

  FILE_SIZE_THAN: (msg = 'The file size is greater than 5MB.') => new HttpException(msg, HttpStatus.BAD_REQUEST),

  FILE_TYPE_NOT_CORRECT: (msg = 'The file type is not correct. Please use an image with JPG, PNG, or HEIC.') =>
    new HttpException(msg, HttpStatus.BAD_REQUEST),

  UPLOAD_DOCUMENT_WHEN_PENDING: (msg = 'The document is on the review process. Please do not upload the new file.') =>
    new HttpException(msg, HttpStatus.BAD_REQUEST),

  DOCUMENT_HAS_BEEN_APPROVED: (msg = 'The document has been approved.') =>
    new HttpException(msg, HttpStatus.BAD_REQUEST),

  FILE_TYPE_DOCUMENT_NOT_CORRECT: (msg = 'The file type is not correct.') =>
    new HttpException(msg, HttpStatus.BAD_REQUEST),

  FILE_DOCUMENT_SIZE_THAN: (msg = 'The file size is greater than 20MB.') =>
    new HttpException(msg, HttpStatus.BAD_REQUEST),

  OTP_EXPIRED: (msg = 'This OTP has expired. Please request a new OTP.') =>
    new HttpException(msg, HttpStatus.BAD_REQUEST),

  PHONE_BLOCKED: (
    msg = "This phone number has been blocked by the system. Please contact Pacificwide's call center for further information.",
  ) => new HttpException(msg, HttpStatus.BAD_REQUEST),

  OTP_FAIL_WITH_COUNT_WRONG_OTP: (msg = 'You have entered the wrong verification code. Please try again!', count) => {
    throw new HttpException(
      {
        wrongOtp: count + 1,
        message: msg,
      },
      HttpStatus.BAD_REQUEST,
    );
  },

  OTP_FAIL_WITHOUT_COUNT_WRONG_OTP: (msg = 'You have entered the wrong verification code. Please try again!') =>
    new HttpException(msg, HttpStatus.BAD_REQUEST),

  WRONG_PASSWORD: (msg = 'Wrong pass') => new HttpException(msg, HttpStatus.BAD_REQUEST),

  OTP_EXPIRE: (msg = 'This verification code has expired, please click "Resend" to get a new code.') =>
    new HttpException(msg, HttpStatus.BAD_REQUEST),

  OTP_NOT_VALID: (msg = 'Maximum input incorrect OTP.') => new HttpException(msg, HttpStatus.BAD_REQUEST),

  CANNOT_PROCEED_WITH_PAYMENT_CHANNEL: (msg = 'Cannot proceed with this payment channel. Please try again later.') =>
    new HttpException(msg, HttpStatus.BAD_REQUEST),

  OTP_FAIL_AND_OTP_NOT_VALID_MAXIMUM: (
    msg = 'Incorrect OTP. You have reached the maximum number of OTP trials. Please request new OTP',
  ) => new HttpException(msg, HttpStatus.BAD_REQUEST),

  DATA_NOT_FOUND: (msg = 'Data not found') => new HttpException(msg, HttpStatus.NOT_FOUND),

  WRONG_QUESTION_SECURITY_ANSWER: (msg = 'Wrong answer. Please enter correct answers') =>
    new HttpException(msg, HttpStatus.BAD_REQUEST),
  ACCOUNT_LOCKED: (msg = 'your account was locked for 1 hour. Please try later') =>
    new HttpException(msg, HttpStatus.BAD_REQUEST),

  EMAIL_AND_PASSWORD_NOT_MATCH: (msg = 'Your email and password do not match. Please try again.') =>
    new HttpException(msg, HttpStatus.BAD_REQUEST),
  EMAIL_WAS_REGISTERED: (msg = 'This email was registered') => new HttpException(msg, HttpStatus.BAD_REQUEST),

  SAME_PASSWORD: (msg = 'Your new password cannot be the same as the previous password.') =>
    new HttpException(msg, HttpStatus.BAD_REQUEST),

  DATA_NOT_MATCH: (msg = 'Data is not valid or not match') => new HttpException(msg, HttpStatus.NOT_FOUND),

  USER_SESSION_NOT_MATCH: (msg = 'User session not found') => new HttpException(msg, HttpStatus.BAD_REQUEST),

  SOME_REQUEST_MISSING: (msg = 'Some request data is missing. Please check again.') =>
    new HttpException(msg, HttpStatus.BAD_REQUEST),

  AUTHORIZATION_FAILED: (msg = 'Authorization failed') => new HttpException(msg, HttpStatus.UNAUTHORIZED),

  EMAIL_NOT_EXIST: (msg = 'This email was not registered, please fill a valid email') =>
    new HttpException(msg, HttpStatus.BAD_REQUEST),

  INVALID_EMAIL_ADDRESS: (msg = 'Invalid email address') => new HttpException(msg, HttpStatus.BAD_REQUEST),

  EMAIL_MOBILE_USED: (msg = 'This mobile number and email have been used. Please try a different one.') =>
    new HttpException(msg, HttpStatus.BAD_REQUEST),

  EMAIL_USED: (
    msg = 'This email address has been registered. Please use a different one or try logging in with this email address.',
  ) => new HttpException(msg, HttpStatus.BAD_REQUEST),

  MOBILE_USED: (msg = 'This mobile number is related to an existing account.') =>
    new HttpException(msg, HttpStatus.BAD_REQUEST),

  ACCOUNT_INACTIVE_UNABLE_TO_PROCEED: (msg = 'Unable to proceed. Please contact Call Center.') =>
    new HttpException(msg, HttpStatus.BAD_REQUEST),

  REGISTER_RBH_ACCOUNT_TO_PROCEED: (msg = 'Please register your Pacificwide account to proceed with this function.') =>
    new HttpException(msg, HttpStatus.BAD_REQUEST),

  TAX_NUMBER_IS_EXIST: (msg = 'This tax number is already registered. Please try a different number.') =>
    new HttpException(msg, HttpStatus.BAD_REQUEST),

  RESET_PASSWORD_LINK_EXPIRED: (msg = 'Your reset password link has expire.') =>
    new HttpException(msg, HttpStatus.BAD_REQUEST),

  FAILED_ROLE_EXIST: (msg = 'Sorry, this role already exist.') => new HttpException(msg, HttpStatus.BAD_REQUEST),

  INVITATION_EXPIRED: (
    msg = 'Sorry, this invitation has expired. Please contact your company to generate a new invitation link.',
  ) => new HttpException(msg, HttpStatus.BAD_REQUEST),

  EMAIL_NOT_CORRECT_PATTERN: (msg = 'Please enter a valid email address.') =>
    new HttpException(msg, HttpStatus.BAD_REQUEST),

  CREATE_RIDER_FAILED: (msg = 'Create rider job failed') => new HttpException(msg, HttpStatus.BAD_REQUEST),

  CREDENTIAL_ERROR: (msg = 'Credential error') => new HttpException(msg, HttpStatus.BAD_REQUEST),

  DUPLICATED_ADDRESS: (msg = 'Duplicated address detected') => new HttpException(msg, HttpStatus.BAD_REQUEST),

  UNABLE_TO_PROCEED: (msg = 'Unable to proceed your request. Please try again later.') =>
    new HttpException(msg, HttpStatus.BAD_REQUEST),

  ERROR_MAX_MEMBER: (msg = "The member's maximum number has been reached.") =>
    new HttpException(msg, HttpStatus.BAD_REQUEST),
  CANNOT_ADD_THE_MEMBER: (msg = 'Cannot add the member.') => new HttpException(msg, HttpStatus.BAD_REQUEST),

  NOT_HAVE_RIGHT_TO_PERFORM: (msg = 'You do not have the right to perform this action.') =>
    new HttpException(msg, HttpStatus.BAD_REQUEST),

  MEMBER_HAS_BEEN_INVITED: (msg = 'Member has been invited.') => new HttpException(msg, HttpStatus.BAD_REQUEST),

  DATA_CANNOT_BE_CHANGE: (msg = 'Can not make any changes to this data. Please try again.') =>
    new HttpException(msg, HttpStatus.BAD_REQUEST),

  EMAIL_EXIST_IN_BUSINESS: (
    msg = 'This email exists as a member of the business; please use another email to register as a business account.',
  ) => new HttpException(msg, HttpStatus.BAD_REQUEST),

  EMAIL_INVITED_BY_BUSINESS: (
    msg = 'This email has been invited as a member of the business account; please try again later.',
  ) => new HttpException(msg, HttpStatus.BAD_REQUEST),

  MOBILE_NUMBER_RESTRICTED: (
    msg = 'This mobile number has been restricted. Please call the call center for further information.',
  ) => new HttpException(msg, HttpStatus.BAD_REQUEST),

  NOT_SEND_OTP: (msg = 'Can not send OTP due to too many requests on this mobile number.') =>
    new HttpException(msg, HttpStatus.BAD_REQUEST),

  NOT_SEND_OTP_EMAIL: (msg = 'Can not send OTP due to too many requests on this email') =>
    new HttpException(msg, HttpStatus.BAD_REQUEST),

  NOT_SEND_OTP_EMAIL_WEB_PORTAL: (msg = 'Too much request for this email, please try again later.') =>
    new HttpException(msg, HttpStatus.BAD_REQUEST),

  NOT_FILL_DATA_REQUIRED: (msg = 'You have not filled out the required information. Please try again.') =>
    new HttpException(msg, HttpStatus.BAD_REQUEST),

  FILE_SIZE_IS_TOO_BIG: (msg = 'The file size is greater than expected. Please try with the difference file.') =>
    new HttpException(msg, HttpStatus.BAD_REQUEST),

  KEYWORD_NOT_FOUND: (msg = 'The search keyword is not found. Please try another keyword.') =>
    new HttpException(msg, HttpStatus.BAD_REQUEST),

  MOBILE_NUMBER_IS_MISSING: (msg = 'Mobile number is missing.') => new HttpException(msg, HttpStatus.BAD_REQUEST),

  MOBILE_NUMBER_FORMAT_IS_INCORRECT: (msg = 'Mobile number format is incorrect.') =>
    new HttpException(msg, HttpStatus.BAD_REQUEST),
};
