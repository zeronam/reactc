import request from 'utils/request';
import camelCase from 'lodash/camelCase';
import { authStore } from 'utils/store';
import Logger from 'utils/logger';
import cache from 'utils/cache';

const UnauthenticatedError = class UnauthenticatedError extends Error {
  constructor(message) {
    super(message);

    this.status = 403;
  }
};

class UserServiceImpl {
  me() {
    const token = authStore.load();
    if (!token) {
      return { response: null, error: new UnauthenticatedError('Unauthenticated') };
    }

    cache.del('/Users/Identity');
    return request('/Users/Identity');
  }

  requestUser() {
    const token = authStore.load();
    if (!token) {
      return { response: null, error: new UnauthenticatedError('Unauthenticated') };
    }

    return {
      response: {
        data: {
          access_token: token,
          userInfo: authStore.getUser(),
          customerInfo: authStore.getCustomer(),
        },
      },
      error: null,
    };
  }

  checkAuthentication() {
    const token = authStore.load();
    if (!token) {
      return { response: null, error: new UnauthenticatedError('Unauthenticated') };
    }

    return {
      response: {
        data: {
          access_token: token,
          userInfo: authStore.getUser(),
          customerInfo: authStore.getCustomer(),
        },
      },
      error: null,
    };
  }

  login(data) {
    return request('/Auth/Token', {
      method: 'POST',
      data: {
        emailAddress: data.emailAddress,
        password: data.password,
      },
    });
  }

  loginSSO(data) {
    return request(`/Auth/SSO/${data.token}`);
  }

  logout() {
    return request('/Auth/Session', {
      method: 'DELETE',
    });
  }

  forceLogout() {
    authStore.clear();
    return {
      response: {
        data: {},
      },
      error: null,
    };
  }

  getOwnerToken(data) {
    return request(`/Admin/SSO/${data.domain}`);
  }

  getUserToken(data) {
    return request(`/SSO/${data.domainName}`, {
      method: 'PUT',
      data: {
        emailAddress: data.emailAddress,
      },
    });
  }

  getUser(data) {
    cache.del(`/Users/${data.id}`);
    cache.del(`/UserInvitations/${data.id}`);

    return request(`/${data.isPending ? 'UserInvitations' : 'Users'}/${data.id}`);
  }

  getUsers(data) {
    const query = data || {};
    const roles = (query.roles || []).join(',');
    const sort = (query.sort || []).join(',');
    const search = query.search || '';

    let queryString = [];
    if (roles && roles.length) {
      queryString.push(`roles=${roles}`);
    }
    if (sort && sort.length) {
      queryString.push(`sort=${sort}`);
    }
    if (search) {
      queryString.push(`search=${encodeURIComponent(search.trim())}`);
    }

    if (queryString.length) {
      queryString = queryString.join('&');
    } else {
      queryString = '';
    }

    Logger.info('getUsers', data);
    return request(`/Admin/Users${queryString ? `?${queryString}` : ''}`);
  }

  inviteUser(data) {
    Logger.info(`invite user ${data}`);
    return request('/Admin/UserInvitations', {
      method: 'POST',
      data: {
        emailAddress: data.emailAddress,
        firstName: data.firstName,
        lastName: data.lastName,
        systemRoleId: data.systemRoleId,
        knowledgeRoleId: data.knowledgeRoleId,
      },
    });
  }

  acceptInvite(data) {
    Logger.info(`accept invite ${data}`);
    const info = {
      password: data.password,
      verifiedPassword: data.verifiedPassword,
      guidString: data.token,
    };

    return request(`/UserInvitations/${data.token}`, {
      method: 'PUT',
      data: info,
    });
  }

  signup(data) {
    return request('/Public/CustomerRegistrations', {
      method: 'POST',
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        emailAddress: data.emailAddress,
        password: data.password,
        verifiedPassword: data.verifiedPassword,
      },
    });
  }

  switchDomain(data) {
    return request('/Users/LinkAccounts', {
      method: 'POST',
      data: {
        linkedAccountEmailAddress: data.linkedAccountEmailAddress,
        linkedAccountPassword: data.linkedAccountPassword,
        subDomain: data.subDomain,
      },
    });
  }

  resendInvite(data) {
    Logger.info(`resend invite by admin ${data}`);
    return request('/Admin/UserInvitations/Reminders', {
      method: 'POST',
      data: {
        emailAddress: data.emailAddress,
      },
    });
  }

  assignRoles(data) {
    Logger.info(`assign roles ${data.action}, roles ${data.roles}, ${data.users}`);
    return request('/Admin/Users/SystemRoles', {
      method: 'POST',
      data: {
        userIds: data.users.map(u => u.id),
        systemRoleIds: data.roles.map(r => r.id),
      },
    });
  }

  changeSystemRoles(data) {
    Logger.info(`changeSystemRoles roles ${data.users}, roles ${data.roles}`);
    return request(`/Admin/Users/${data.users[0].id}/SystemRoles`, {
      method: 'PUT',
      data: {
        systemRoleIds: data.roles.map(r => r.id),
      },
    });
  }

  changeKnowledgeRoles(data) {
    Logger.info(`changeKnowledgeRoles roles ${data.users}, roles ${data.roles}`);
    return request(`/Admin/Users/${data.users[0].id}/KnowledgeRolesRoles`, {
      method: 'PUT',
      data: {
        systemRoleIds: data.roles.map(r => r.id),
      },
    });
  }

  requestResetPassword(data) {
    return request('/Admin/Users/ResetPasswords', {
      method: 'POST',
      data: {
        emailAddress: data.emailAddress,
      },
    });
  }

  forgotPassword(data) {
    return request('/PasswordResetRequests', {
      method: 'POST',
      data: {
        emailAddress: data.emailAddress,
      },
    });
  }

  resetPassword(data) {
    const postData = {
      password: data.password,
      verifiedPassword: data.verifiedPassword,
    };

    const url = data.adminRequest ? `/Users/Passwords/${data.token}` : `/PasswordResetRequests/${data.token}`;
    return request(url, {
      method: 'PUT',
      data: postData,
    });
  }

  updatePassword(data) {
    return request('/Accounts/Passwords', {
      method: 'PUT',
      data: {
        currentPassword: data.currentPassword,
        password: data.password,
        verifiedPassword: data.verifiedPassword,
      },
    });
  }

  deactivateUser(data) {
    Logger.info(`suspending user id ${data.id}`);
    return request(`/Admin/Users/${data.id}/Status`, {
      method: 'PUT',
      data: {
        statusId: data.statusId,
      },
    });
  }

  reactivateUser(data) {
    Logger.info(`restoring user id ${data.id}`);
    return request(`/Admin/Users/${data.id}/Status`, {
      method: 'PUT',
      data: {
        statusId: data.statusId,
      },
    });
  }

  deletePendingUser(data) {
    Logger.info(`deleting user id ${data.emailAddress}`);
    return request('/Admin/UserInvitations', {
      method: 'DELETE',
      data: {
        emailAddress: data.emailAddress,
      },
    });
  }

  deleteUser(data) {
    Logger.info(`deleting user id ${data.id}`);
    return request(`/Admin/Users/${data.id}`, {
      method: 'DELETE',
    });
  }

  deletePendingInvite(data) {
    Logger.info('deleting pending invite', data.emailAddress);
    return request('/Admin/UserInvitations', {
      method: 'DELETE',
      data: {
        emailAddress: data.emailAddress,
      },
    });
  }

  getUserPreferences() {
    cache.del('/Users/UserPreferencesSettings/11');
    return request('/Users/UserPreferencesSettings/11');
  }

  saveUserPreferences(data) {
    Logger.info(`saving user prefs ${data}`);
    const key = camelCase(data.key);
    const postData = {};
    postData[key] = data.value;

    return request(`/Admin/UserPreferencesSettings/${data.key}`, {
      method: 'PUT',
      data: postData,
    });
  }

  getUserSuggestions(data) {
    return request(`/Admin/Users/Suggestions?keyword=${data.search}`);
  }
}

const UserService = new UserServiceImpl();

export default UserService;
