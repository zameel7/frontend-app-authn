import { getConfig } from '@edx/frontend-platform';
import { getHttpClient, getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { logInfo } from '@edx/frontend-platform/logging';
import querystring from 'querystring';

export async function registerRequest(registrationInformation, requestStartTime) {
  const requestConfig = {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    isPublic: true,
  };

  const { data } = await getAuthenticatedHttpClient()
    .post(
      `${getConfig().LMS_BASE_URL}/api/user/v2/account/registration/`,
      querystring.stringify(registrationInformation),
      requestConfig,
    )
    .catch((e) => {
      throw (e);
    });

  const responseTime = Date.now();
  logInfo(`registration request response time after improvement: ${responseTime - requestStartTime} ms`);
  return {
    redirectUrl: data.redirect_url || `${getConfig().LMS_BASE_URL}/dashboard`,
    success: data.success || false,
  };
}

export async function getFieldsValidations(formPayload) {
  const requestConfig = {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  };

  const { data } = await getHttpClient()
    .post(
      `${getConfig().LMS_BASE_URL}/api/user/v1/validation/registration`,
      querystring.stringify(formPayload),
      requestConfig,
    )
    .catch((e) => {
      throw (e);
    });

  return {
    fieldValidations: data,
  };
}
