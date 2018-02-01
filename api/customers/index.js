import request from 'utils/request';
import cache from 'utils/cache';

class CustomerServiceImpl {
  getCustomer(id) {
    return request(`/Admin/Customers/${id}`);
  }

  getCustomers(data) {
    const query = data || {};
    const sort = (query.sort || []).join(',');
    const { includedInactive } = query;
    const search = query.search || '';
    const { page } = query;
    const { size } = query;
    const { filter } = query;
    const { useUserPreferences } = query;

    let queryString = [];
    if (sort && sort.length) {
      queryString.push(`sort=${sort}`);
    }
    if (page) {
      queryString.push(`page=${page}`);
    }
    if (size) {
      queryString.push(`size=${size}`);
    }
    if (filter) {
      queryString.push(filter);
    }
    if (includedInactive !== undefined) {
      queryString.push(`includedInactive=${includedInactive}`);
    }

    if (useUserPreferences !== undefined) {
      queryString.push(`useUserPreferences=${useUserPreferences}`);
    }

    if (search) {
      queryString.push(`search=${encodeURIComponent(search.trim())}`);
    }

    if (queryString.length) {
      queryString = queryString.join('&');
    } else {
      queryString = '';
    }

    const url = `/Admin/Customers${queryString ? `?${queryString}` : ''}`;
    cache.del(url);

    return request(url);
  }

  getMyProfile() {
    return request('/Customers/Identity');
  }

  updateMyProfile(data) {
    const postData = Object.assign({}, data);
    return request('/Customers/Profiles', {
      method: 'PUT',
      data: postData,
    });
  }

  removeProfilePicture() {
    return request('/Customers/ProfilePictures', {
      method: 'DELETE',
    });
  }

  createCustomer(data) {
    const postData = Object.assign({}, data);
    delete postData.id;

    return request('/Admin/Customers', {
      method: 'POST',
      data: postData,
    });
  }

  editCustomer(data) {
    const postData = Object.assign({}, data);
    return request(`/Admin/Customers/${data.id}`, {
      method: 'PUT',
      data: postData,
    });
  }

  getCustomerInfo(id) {
    return request(`/Admin/Customers/${id}`, {
      method: 'GET',
    });
  }

  getCustomerLocations() {
    return request('/Locations');
  }

  getCountries() {
    return request('/Countries');
  }

  getCustomerOrganizations(data) {
    return request(`/OrganizationStructures${data && data.includedArchived ? '?includedArchived=true' : ''}`);
  }

  getCustomerPreferences() {
    cache.del('/Users/UserPreferencesSettings/22');
    return request('/Users/UserPreferencesSettings/22');
  }

  acceptCustomerInvite(data) {
    const info = {
      password: data.password,
      verifiedPassword: data.verifiedPassword,
      guidString: data.token,
    };

    if (data.lastName && data.firstName) {
      return request(`/CustomerInvitations/${data.token}`, {
        method: 'PUT',
        data: {
          ...info,
          firstName: data.firstName,
          lastName: data.lastName,
        },
      });
    }

    return request(`/CustomerInvitations/${data.token}`, {
      method: 'PUT',
      data: info,
    });
  }

  inviteCustomers(data) {
    return request('/Admin/Customers/Bulk', {
      method: 'POST',
      data: {
        emailAddresses: data.emailAddresses,
      },
    });
  }

  inviteCustomer(data) {
    return request(`/Admin/Customers/${data.id}/Invitations`, {
      method: 'POST',
      data: {
        emailAddress: data.emailAddress,
      },
    });
  }

  resendInvite(data) {
    return request('/Admin/Customers/Reminders', {
      method: 'POST',
      data: {
        emailAddress: data.emailAddress,
      },
    });
  }

  deactivateCustomer(data) {
    return request(`/Admin/Customers/${data.id}/Status`, {
      method: 'PUT',
      data: {
        statusId: data.statusId,
      },
    });
  }

  reactivateCustomer(data) {
    return request(`/Admin/Customers/${data.id}/Status`, {
      method: 'PUT',
      data: {
        statusId: data.statusId,
      },
    });
  }

  requestResetPassword(data) {
    return request('/Admin/Customers/ResetPasswords', {
      method: 'POST',
      data: {
        emailAddress: data.emailAddress,
      },
    });
  }

  resetCustomerPassword(data) {
    const postData = {
      password: data.password,
      verifiedPassword: data.verifiedPassword,
    };

    return request(`/Customers/Passwords/${data.token}`, {
      method: 'PUT',
      data: postData,
    });
  }

  deleteCustomer(data) {
    return request(`/Admin/Customers/${data.id}`, {
      method: 'DELETE',
    });
  }

  deletePendingInvite(data) {
    return request('/Admin/CustomerInvitations', {
      method: 'DELETE',
      data: {
        emailAddress: data.emailAddress,
      },
    });
  }
}

const CustomerService = new CustomerServiceImpl();

export default CustomerService;
