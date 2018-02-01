import request from 'utils/request';
import Logger from 'utils/logger';

class PortfolioServiceImpl {
  getPortfolios(data) {
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

    return request(`/Admin/ServicePortfolios${queryString ? `?${queryString}` : ''}`);
  }

  getPortfolio(data) {
    return request(`/Admin/ServicePortfolios/${data.id}`);
  }

  getPortfolioMetadata(id) {
    return request(`/Admin/ServicePortfolios/${id}/Properties`);
  }

  addPortfolio(data) {
    Logger.info(`add portfolio ${data}`);
    const sla = data.sla || {};
    const postData = { name: data.name };
    if (sla.name) {
      postData.sla = sla;
    }
    return request('/Admin/ServicePortfolios', {
      method: 'POST',
      data: postData,
    });
  }

  updatePortfolio(data) {
    Logger.info(`update portfolio ${data}`);
    const sla = data.sla || {};
    const postData = { name: data.name };
    if (sla.name) {
      postData.sla = sla;
    }
    return request(`/Admin/ServicePortfolios/${data.id}`, {
      method: 'PUT',
      data: postData,
    });
  }

  deletePortfolio(data) {
    Logger.info(`delete portfolio ${data}`);
    return request(`/Admin/ServicePortfolios/${data.id}`, {
      method: 'DELETE',
    });
  }

  getServices(data) {
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

    return request(`/Admin/Services${queryString ? `?${queryString}` : ''}`);
  }

  getServiceArticles(data) {
    const { page, size } = data;

    let queryString = [];
    if (page) {
      queryString.push(`page=${page}`);
    }
    if (size) {
      queryString.push(`size=${size}`);
    }

    if (queryString.length) {
      queryString = queryString.join('&');
    } else {
      queryString = '';
    }

    return request(`/Portal/Services${queryString ? `?${queryString}` : ''}`);
  }

  addService(data) {
    Logger.info(`add service ${data}`);
    return request('/Admin/Services', {
      method: 'POST',
      data: {
        name: data.name,
        description: data.description,
        servicePortfolioId: data.servicePortfolioId,
        statusId: data.statusId,
        ...data,
      },
    });
  }

  updateService(data) {
    Logger.info(`update service ${data}`);
    return request(`/Admin/Services/${data.id}`, {
      method: 'PUT',
      data: {
        id: data.id,
        name: data.name,
        description: data.description,
        servicePortfolioId: data.servicePortfolioId,
        statusId: data.statusId,
        ...data,
      },
    });
  }

  deleteService(data) {
    Logger.info(`delete service ${data}`);
    return request(`/Admin/Services/${data.id}`, {
      method: 'DELETE',
    });
  }

  getServiceArticle(data) {
    return request(`/Admin/Services/Details?articleId=${data.articleId}`);
  }

  getServiceTicket(data) {
    return request(`/Admin/Services/Details?ticketId=${data.ticketId}`);
  }

  getService(data) {
    return request(`/Admin/Services/${data.id}`);
  }

  getServiceMetadata() {
    return request('/Admin/Services/Metadata');
  }

  getServiceProperties(id) {
    return request(`/Admin/Services/${id}/Properties`);
  }

  getServiceStatus() {
    return request('/Admin/Services/Status');
  }

  getServicePortfolio() {
    return request('/Admin/ServicePortfolios/Metadata');
  }

  removeServiceLogo(data) {
    return request(`/Admin/Services/Icons/${data.id}`, {
      method: 'DELETE',
    });
  }

  getSlaStatus() {
    return request('/Admin/ServicePortfolios/SLAs/Status');
  }

  getDefaultSchemes() {
    return request('/Admin/ServicePortfolios/SLAs/SLAPrioritySchemes/Default');
  }
}

const PortfolioService = new PortfolioServiceImpl();

export default PortfolioService;
