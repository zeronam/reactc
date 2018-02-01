import request from 'utils/request';
import download from 'utils/download';
import cache from 'utils/cache';
import { guid } from 'utils';
import { authStore as store } from 'utils/store';

class PortalServiceImpl {
  constructor() {
    if (store.get('ut')) {
      this.ut = guid();
    } else {
      this.ut = guid();
      store.set('ut', this.ut);
    }
  }

  getServicesPortal() {
    return request('/Portal/Services/KnowledgeBase');
  }

  getPublicServicesPortal() {
    return request('/Public/Services/KnowledgeBase');
  }

  getServiceArticles(data, isPublic) {
    const query = data || {};
    const sort = (query.sort || []).join(',');
    const page = query.page;
    const size = query.size;
    const search = (query.search || '');
    const filter = query.filter;

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

    const url = `/${isPublic ? 'Public' : 'Portal'}${data.serviceId ? `/Services/${data.serviceId}` : ''}/Articles${queryString ? (`?${queryString}`) : ''}`;
    cache.del(url);

    return request(url);
  }

  getPublicServiceArticles(data) {
    return this.getServiceArticles(data, true);
  }

  getPopularArticles() {
    return request('/Portal/Articles/Popular');
  }

  getPublicPopularArticles() {
    return request('/Public/Articles/Popular');
  }

  getPortalArticle(id) {
    const url = `/Portal/Articles/${id}`;
    cache.del(url);

    return request(url);
  }

  getPublicArticle(id) {
    const url = `/Public/Articles/${id}?key=${this.ut}`;
    cache.del(url);

    return request(url);
  }

  refreshArticle(id) {
    const url = `/Portal/Articles/${id}?mode=edit`;
    cache.del(url);

    return request(url);
  }

  refreshPublicArticle(id) {
    const url = `/Public/Articles/${id}?mode=edit&key=${this.ut}`;
    cache.del(url);

    return request(url);
  }

  updateArticleVote(data) {
    return request(`/Portal/Articles/${data.id}/Votes`, {
      method: 'PUT',
      data: {
        vote: data.vote,
      },
    });
  }

  updatePublicVote(data) {
    return request(`/Public/Articles/${data.id}/Votes`, {
      method: 'PUT',
      data: {
        vote: data.vote,
        userTracking: this.ut,
      },
    });
  }

  searchArticles(data, isPublic) {
    const query = data || {};
    const page = query.page;
    const size = query.size;
    const search = (query.search || '');
    const filter = data.filter;
    const useUserPreferences = data.useUserPreferences;

    let queryString = [];
    if (page) {
      queryString.push(`page=${page}`);
    }
    if (size) {
      queryString.push(`size=${size}`);
    }
    if (filter) {
      queryString.push(filter);
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

    const url = `/${isPublic ? 'Public' : 'Portal'}/Articles${queryString ? (`?${queryString}`) : ''}`;
    cache.del(url);

    return request(url);
  }

  searchPublicArticles(data) {
    return this.searchArticles(data, true);
  }

  getKbServiceArticle(data) {
    return request(`/Portal/Services/Details?articleId=${data.articleId}`);
  }

  getPublicServiceArticle(data) {
    return request(`/Public/Services/Details?articleId=${data.articleId}`);
  }

  getKbPdf(id) {
    const timezoneOffset = (new Date()).getTimezoneOffset() / 60;
    const url = `/Portal/Files/Articles/${id}?timezoneOffset=${timezoneOffset}`;
    cache.del(url);

    return download(url);
  }

  getPublicPdf(id) {
    const timezoneOffset = (new Date()).getTimezoneOffset() / 60;
    const url = `/Public/Files/Articles/${id}?timezoneOffset=${timezoneOffset}`;
    cache.del(url);

    return download(url);
  }

  shareKbLinkViaEmail(data, isPublic) {
    return request(`/${isPublic ? 'Public' : 'Portal'}/Articles/EmailLink`, {
      method: 'POST',
      data: {
        articleId: data.articleId,
        to: data.to,
        subject: data.subject,
        note: data.note,
      },
    });
  }

  sharePublicLinkViaEmail(data) {
    return this.shareKbLinkViaEmail(data, true);
  }

  removeAttachments(data) {
    return request(`/Public/ContactUs/Attachments/${data.id}`, {
      method: 'DELETE',
    });
  }

  sendContactMessage(data) {
    const postData = {
      userName: data.userName,
      emailAddress: data.emailAddress,
      subject: data.subject,
      message: data.message,
      attachments: data.attachments,
    };

    if (data.articleUrl) {
      postData.articleUrl = data.articleUrl;
    }

    return request('/Public/ContactUs', {
      method: 'POST',
      data: postData,
    });
  }
}

const PortalService = new PortalServiceImpl();

export default PortalService;
