/* eslint-disable func-names */
import * as Yup from 'yup';
import {
  parsePhoneNumber,
  parsePhoneNumberFromString,
  ParseError,
} from 'libphonenumber-js';
import { regExp } from '../utils';
import i18n from '../i18n';
import { countries } from '../constants';

Yup.addMethod(Yup.string, 'phoneNumber', function(message) {
  return this.test('phoneNumberTest', message, function(value = '') {
    let isError = false;
    let phoneNumber;

    const { path, createError } = this;

    try {
      isError = false;

      parsePhoneNumber(value);

      phoneNumber = parsePhoneNumberFromString(value);
    } catch (error) {
      if (error instanceof ParseError) {
        isError = true;
      }
    }

    if (!value) {
      return true;
    }

    return (
      (!isError &&
        (phoneNumber !== undefined && phoneNumber.isValid())) ||
      createError({ path, message })
    );
  });
});

export const ProfileSchema = Yup.object().shape({
  firstName: Yup.string()
    .trim()
    .min(1)
    .max(100)
    .required(i18n.t('errors.requireFirstName')),
  lastName: Yup.string()
    .trim()
    .min(1)
    .max(100)
    .required(i18n.t('errors.requireLastName')),
  currentPasswordForEmail: Yup.string().min(
    8,
    i18n.t('errors.passwordMustBe'),
  ),
  email: Yup.string()
    .trim()
    .matches(regExp.emailRegexp, i18n.t('errors.incorrectEmail'))
    .required(i18n.t('errors.incorrectEmail')),
  phone: Yup.string()
    .trim()
    .phoneNumber(i18n.t('errors.incorrectPhone')),
  currentPassword: Yup.string()
    .trim()
    .min(8, i18n.t('errors.passwordMustBe')),
  newPassword: Yup.string().when('currentPassword', {
    is: (val) => !!val,
    then: Yup.string()
      .trim()
      .min(8, i18n.t('errors.passwordMustBe'))
      .max(256, i18n.t('errors.passwordMustBe'))
      .required(i18n.t('errors.passwordMustBe')),
    otherwise: Yup.string().min(0),
  }),
  replyPassword: Yup.string().when('currentPassword', {
    is: (val) => !!val,
    then: Yup.string()
      .min(8)
      .max(256)
      .oneOf(
        [Yup.ref('newPassword')],
        i18n.t('errors.confirmPassword'),
      )
      .required(i18n.t('errors.confirmPassword')),
    otherwise: Yup.string().min(0),
  }),
});

export const SignUpSchema = Yup.object().shape({
  firstName: Yup.string()
    .trim()
    .min(1)
    .max(100)
    .required(i18n.t('errors.requireFirstName')),
  lastName: Yup.string()
    .trim()
    .min(1)
    .max(100)
    .required(i18n.t('errors.requireLastName')),
  email: Yup.string()
    .trim()
    .matches(regExp.emailRegexp, i18n.t('errors.incorrectEmail'))
    .required(i18n.t('errors.incorrectEmail')),
  password: Yup.string()
    .trim()
    .min(8)
    .required(i18n.t('errors.passwordMustBe')),
});

export const PaymentSchema = Yup.object().shape({
  cardNumber: Yup.string()
    .trim()
    .min(19, i18n.t('errors.incorrectCardNumber'))
    .max(22, i18n.t('errors.incorrectCardNumber'))
    .required(i18n.t('errors.incorrectCardNumber')),
  cardExpiration: Yup.string()
    .trim()
    .min(5, i18n.t('errors.incorrectCardExpiration'))
    .max(5, i18n.t('errors.incorrectCardExpiration'))
    .required(i18n.t('errors.incorrectCardExpiration')),
  cardCVC: Yup.string()
    .trim()
    .min(3, i18n.t('errors.incorrectCardCVC'))
    .max(4, i18n.t('errors.incorrectCardCVC'))
    .required(i18n.t('errors.incorrectCardCVC')),
});

const stripeCountriesList = countries.stripeCountriesList.map(
  (i) => i.title,
);

export const PayoutSchema = Yup.object().shape({
  firstName: Yup.string()
    .trim()
    .min(1)
    .max(100)
    .required(i18n.t('errors.requireFirstName')),
  lastName: Yup.string()
    .trim()
    .min(1)
    .max(100)
    .required(i18n.t('errors.requireLastName')),
  birthDate: Yup.string()
    .trim()
    .min(1)
    .max(2)
    .required(i18n.t('errors.require')),
  month: Yup.string()
    .trim()
    .min(1)
    .max(2)
    .required(i18n.t('errors.require')),
  year: Yup.string()
    .trim()
    .min(1)
    .max(4)
    .required(i18n.t('errors.require')),
  country: Yup.string()
    .trim()
    .min(1)
    .max(100)
    .oneOf(stripeCountriesList, i18n.t('errors.stripeCounties'))
    .required(i18n.t('errors.require')),
  streetAddress: Yup.string()
    .trim()
    .min(1)
    .max(100)
    .required(i18n.t('errors.require')),
  postalCode: Yup.string()
    .trim()
    .min(1)
    .max(100)
    .required(i18n.t('errors.require')),
  city: Yup.string()
    .trim()
    .min(1)
    .max(100)
    .required(i18n.t('errors.require')),
  accountNumber: Yup.string()
    .trim()
    .min(12)
    .max(12)
    .required(i18n.t('errors.require')),
});
