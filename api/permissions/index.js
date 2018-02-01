import request from 'utils/request';

class PermissionServiceImpl {
  getAllSystemPermissions() {
    return request('/Admin/SystemPermissions');
  }

  getAllKnowledgePermissions() {
    return request('/Admin/KnowledgePermissions');
  }

  saveSystemPermissions(data) {
    return request('/Admin/SystemPermissions', {
      method: 'PUT',
      data: {
        rolePermissions: [...data],
      },
    });
  }

  saveKnowledgePermissions(data) {
    return request('/Admin/KnowledgePermissions', {
      method: 'PUT',
      data: {
        rolePermissions: [...data],
      },
    });
  }
}

const PermissionService = new PermissionServiceImpl();

export default PermissionService;
