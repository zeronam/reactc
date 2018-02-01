import request from 'utils/request';
import cache from 'utils/cache';

class ReportServiceImpl {
  getLeaderBoard(data) {
    const filter = data.filter;
    let queryString = [];
    if (filter) {
      queryString.push(filter);
    }

    if (queryString.length) {
      queryString = queryString.join('&');
    } else {
      queryString = '';
    }

    const url = `/Admin/Reports/Leaderboard${queryString ? (`?${queryString}`) : ''}`;
    cache.del(url);

    return request(url);
  }
}

const ReportService = new ReportServiceImpl();

export default ReportService;
