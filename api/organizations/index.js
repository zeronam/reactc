
import request from 'utils/request';
import cache from 'utils/cache';

const ACTIVE = 11;
const ARCHIVED = 33;
const DELETED = 99;

class OrganizationServiceImpl {
  getOrganizations(data) {
    const query = data || {};
    const sort = (query.sort || []).join(',');
    const includedArchived = query.includedArchived;
    // const page = query.page;
    // const size = query.size;

    let queryString = [];
    if (sort && sort.length) {
      queryString.push(`sort=${sort}`);
    }
    if (includedArchived) {
      queryString.push(`includedArchived=${true}`);
    }
    // if (page) {
    //   queryString.push(`page=${page}`);
    // }
    // if (size) {
    //   queryString.push(`size=${size}`);
    // }

    if (queryString.length) {
      queryString = queryString.join('&');
    } else {
      queryString = '';
    }

    const url = `/Admin/OrganizationStructures${queryString ? (`?${queryString}`) : ''}`;
    cache.del(url);

    return request(url);
  }

  getOrganizationsTree(data) {
    return request(`/Admin/OrganizationStructures/${data.id}`);
  }

  getAllOrganizations(data) {
    const newData = Object.assign({}, data || {}, { includedArchived: true });
    return this.getOrganizations(newData);
  }

  createOrganization(data) {
    return request('/Admin/OrganizationStructures', {
      method: 'POST',
      data: {
        name: data.name,
        parentId: data.parentId,
      },
    });
  }

  deleteOrganization(data) {
    return request('/Admin/OrganizationStructures', {
      method: 'DELETE',
      data: {
        ids: data.ids,
      },
    });
  }

  editOrganization(data) {
    return request(`/Admin/OrganizationStructures/${data.id}`, {
      method: 'PUT',
      data: {
        name: data.name,
        parentId: data.parentId,
      },
    });
  }

  archiveOrganization(data) {
    return request('/Admin/OrganizationStructures/Status', {
      method: 'PUT',
      data: {
        ids: data.ids,
        statusId: ARCHIVED,
      },
    });
  }

  restoreOrganization(data) {
    return request('/Admin/OrganizationStructures/Status', {
      method: 'PUT',
      data: {
        ids: data.ids,
        statusId: ACTIVE,
      },
    });
  }

  mergeOrganization(data) {
    return request('/Admin/OrganizationStructures/', {
      method: 'PUT',
      data: {
        ids: data.ids,
      },
    });
  }
}

const OrganizationService = new OrganizationServiceImpl();

export default OrganizationService;
