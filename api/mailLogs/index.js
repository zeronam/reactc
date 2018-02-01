import request from 'utils/request';
import cache from 'utils/cache';

class LogServiceImpl {
  getMailLogs(data) {
    const query = data || {};
    const sort = (query.sort || []).join(',');
    const search = query.search || '';
    const { page } = query;
    const { size } = query;
    const { filter } = query;

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

    const url = `/Admin/Logs${queryString ? `?${queryString}` : ''}`;
    cache.del(url);

    return request(url);
  }

  getUserPreferences() {
    cache.del('/Admin/Logs/UserPreferencesSettings/33');
    return request('/Admin/Logs/UserPreferencesSettings/33');
  }

  getMailLogTypes() {
    return request(`/Admin/Logs/Types`, {
      method: 'GET',
    });
  }
}

const LogService = new LogServiceImpl();

export default LogService;
