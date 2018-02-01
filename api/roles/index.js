import request from 'utils/request';
import Logger from 'utils/logger';

class RoleServiceImpl {
  systemRoles() {
    Logger.info('getting all systemRoles');
    return request('/Admin/SystemRoles');
  }

  knowledgeRoles() {
    Logger.info('getting all knowledgeRoles');
    return request('/Admin/KnowledgeRoles');
  }

  changeUserKnowledgeRole(data) {
    Logger.info(`change user knowledge role ${data}`);
    return request(`/Admin/${data.isInvitation ? 'UserInvitations' : 'Users'}/${data.id}/KnowledgeRole`, {
      method: 'PUT',
      data: {
        roleId: data.roleId,
      },
    });
  }

  changeUserSystemRole(data) {
    Logger.info(`change user system role ${data}`);
    return request(`/Admin/${data.isInvitation ? 'UserInvitations' : 'Users'}/${data.id}/SystemRole`, {
      method: 'PUT',
      data: {
        roleId: data.roleId,
      },
    });
  }

  assignUsers(data) {
    Logger.info(`assign users to role ${data}`);

    const params = {};
    if (data.activeAccountIds && data.activeAccountIds.length) {
      params.activeAccountIds = data.activeAccountIds;
    }
    if (data.pendingAccountIds && data.pendingAccountIds.length) {
      params.pendingAccountIds = data.pendingAccountIds;
    }

    return request(`/Admin/${data.isKnowledgeRole ? 'KnowledgeRoles' : 'SystemRoles'}/${data.role.id}/Accounts`, {
      method: 'POST',
      data: params,
    });
  }

  getUsers(data) {
    Logger.info(`getting users from role ${data}`);
    const query = data || {};
    const sort = (query.sort || []).join(',');
    const search = query.search || null;
    let queryString = [];

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

    return request(`/Admin/${data.isKnowledgeRole ? 'KnowledgeRoles' : 'SystemRoles'}${data.role ? `/${data.role.id}` : ''}/Users${queryString ? (`?${queryString}`) : ''}`);
  }
}

const RoleService = new RoleServiceImpl();

export default RoleService;
