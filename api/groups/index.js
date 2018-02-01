import request from 'utils/request';
import Logger from 'utils/logger';

class AssignmentGroupImpl {
  getGroups(data) {
    const query = data || {};
    const sort = (query.sort || []).join(',');

    let queryString = [];
    if (sort && sort.length) {
      queryString.push(`sort=${sort}`);
    }

    if (queryString.length) {
      queryString = queryString.join('&');
    } else {
      queryString = '';
    }

    return request(`/Admin/AssignmentGroups${queryString ? `?${queryString}` : ''}`);
  }

  getGroup(data) {
    return request(`/Admin/AssignmentGroups/${data.id}`);
  }

  addGroup(data) {
    Logger.info(`add assignment group ${data}`);
    const postData = {
      name: data.name,
      description: data.description,
      emailAddresses: data.emailAddresses,
    };

    return request('/Admin/AssignmentGroups', {
      method: 'POST',
      data: postData,
    });
  }

  updateGroup(data) {
    Logger.info(`update assignment group ${data}`);
    const postData = {
      name: data.name,
      description: data.description,
      emailAddresses: data.emailAddresses,
    };

    return request(`/Admin/AssignmentGroups/${data.id}`, {
      method: 'PUT',
      data: postData,
    });
  }

  deleteGroup(data) {
    Logger.info(`delete assignment group ${data}`);
    return request(`/Admin/AssignmentGroups/${data.id}`, {
      method: 'DELETE',
    });
  }

  getGroupProperties(id) {
    return request(`/Admin/AssignmentGroups/${id}/Properties`);
  }

  getOwnerSuggestions(data) {
    return request(`/Admin/AssignmentGroups/${data.id}/Members?search=${data.search}`);
  }
}

const AssignmentGroup = new AssignmentGroupImpl();

export default AssignmentGroup;
