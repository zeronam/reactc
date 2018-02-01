import request from 'utils/request';
import cache from 'utils/cache';

class TicketServiceImpl {
  getTickets(data) {
    const query = data || {};
    const sort = (query.sort || []).join(',');
    const search = query.search || '';
    const { page } = query;
    const { size } = query;
    const { filter } = query;
    // const { dependFilter } = query;

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

    if (search) {
      queryString.push(`search=${encodeURIComponent(search.trim())}`);
    }

    if (queryString.length) {
      queryString = queryString.join('&');
    } else {
      queryString = '';
    }

    const url = `/Admin/Tickets${queryString ? `?${queryString}` : ''}`;
    cache.del(url);

    return request(url);
  }

  getTicket(data) {
    return request(`/Admin/Tickets/${data.id}`);
  }

  getUserPreferences() {
    cache.del('/Admin/Logs/UserPreferencesSettings/33');
    return request('/Admin/Logs/UserPreferencesSettings/33');
  }

  getTicketTypes() {
    return request(`/Admin/TicketTypes`, {
      method: 'GET',
    });
  }

  getTicketStatus() {
    return request(`/Admin/Tickets/Status`, {
      method: 'GET',
    });
  }

  changeTicketStatus(data) {
    return request(`/Admin/Tickets/${data.id}/Status`, {
      method: 'PUT',
      data: {
        statusId: data.statusId,
      },
    });
  }

  scheduleTicket(data) {
    return request(`/Admin/Tickets/${data.id}`, {
      method: 'PUT',
      data: {
        statusId: data.statusId,
        scheduledStartDate: data.scheduledStartDate,
        explanatoryNote: data.scheduledExplanatoryNote,
      },
    });
  }

  resolveTicket(data) {
    return request(`/Admin/Tickets/${data.id}/Status`, {
      method: 'PUT',
      data: {
        statusId: data.statusId,
        workEffort: data.workEffort,
      },
    });
  }

  pendOrHoldTicket(data) {
    return request(`/Admin/Tickets/${data.id}/Status`, {
      method: 'PUT',
      data: {
        statusId: data.statusId,
        explanatoryNote: data.note,
      },
    });
  }

  getGroups() {
    return request(`/Admin/Tickets/AssignmentGroups`, {
      method: 'GET',
    });
  }

  getPriorities(data, key = 'Admin') {
    return request(`/${key}/SLAPrioritySchemes`);
  }

  createTicket(data) {
    const postData = { ...data };
    return request('/Admin/Tickets', {
      method: 'POST',
      data: postData,
    });
  }

  editTicket(data) {
    const postData = { ...data };
    return request(`/Admin/Tickets/${data.id}`, {
      method: 'PUT',
      data: postData,
    });
  }

  searchCustomers(data) {
    return request(`/Admin/Tickets/Customers/Suggestions?search=${encodeURIComponent(data.query.trim())}`);
  }

  searchReporters(data) {
    return request(`/Admin/Tickets/CustomerSnapshot/Suggestions?search=${encodeURIComponent(data.query.trim())}`);
  }

  removeAttachments(data) {
    return request(`/Admin/TicketFieldAttachments/${data.id}`, {
      method: 'DELETE',
    });
  }
}

const TicketService = new TicketServiceImpl();

export default TicketService;
