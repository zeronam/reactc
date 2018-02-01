import request from 'utils/request';
import download from 'utils/download';
import cache from 'utils/cache';

class ArticleServiceImpl {
  getArticle(id) {
    const url = `/Admin/Articles/${id}`;
    cache.del(url);

    return request(url);
  }

  refreshArticle(id) {
    const url = `/Admin/Articles/${id}?mode=edit`;
    cache.del(url);

    return request(url);
  }

  getPdf(data) {
    const timezoneOffset = new Date().getTimezoneOffset() / 60;
    const url = `/Admin/Files/Articles/${data.id}?timezoneOffset=${timezoneOffset}${
      data.mode ? `&exportFormat=${data.mode}` : ''
    }`;
    // const url = 'http://localhost:3000/download';
    cache.del(url);

    return download(url);
  }

  exportExcel(d) {
    const data = d;
    data.timezoneOffset = new Date().getTimezoneOffset() / 60;
    return download('/Admin/Files/PivotTables/Export', {
      method: 'POST',
      data,
    });
  }

  getArticles(data) {
    const query = data || {};
    const sort = (query.sort || []).join(',');
    const { page, size, filter, useUserPreferences, includedArchived } = query;
    const search = query.search || '';

    let queryString = [];
    if (sort && sort.trim().length) {
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
    if (includedArchived !== undefined) {
      queryString.push(`includedArchived=${includedArchived}`);
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
    const url = `/Admin/Articles${queryString ? `?${queryString}` : ''}`;
    cache.del(url);

    return request(url);
  }

  exportArticlesToExcel(data) {
    const query = data || {};
    const sort = (query.sort || []).join(',');
    const search = query.search || '';
    const { filter, includedArchived } = query;
    const timezoneOffset = new Date().getTimezoneOffset() / 60;

    let queryString = [];
    if (sort && sort.trim().length) {
      queryString.push(`sort=${sort}`);
    }
    if (filter) {
      queryString.push(filter);
    }

    if (search) {
      queryString.push(`search=${encodeURIComponent(search.trim())}`);
    }

    if (includedArchived !== undefined) {
      queryString.push(`includedArchived=${includedArchived}`);
    }

    if (queryString.length) {
      queryString = queryString.join('&');
    } else {
      queryString = '';
    }

    const url = `/Admin/Files/Articles/Spreadsheet${
      queryString ? `?timezoneOffset=${timezoneOffset}&${queryString}` : ''
    }`;

    return download(url);
  }

  getPivotArticles(data) {
    const query = data || {};
    const { rowId, columnId, filter, includedArchived } = query;
    const search = query.search || '';

    let queryString = [];
    if (rowId) {
      queryString.push(`rowId=${rowId}`);
    }
    if (columnId) {
      queryString.push(`columnId=${columnId}`);
    }
    if (filter) {
      queryString.push(filter);
    }
    if (includedArchived !== undefined) {
      queryString.push(`includedArchived=${includedArchived}`);
    }

    if (search) {
      queryString.push(`search=${encodeURIComponent(search.trim())}`);
    }

    if (queryString.length) {
      queryString = queryString.join('&');
    } else {
      queryString = '';
    }
    const url = `/Admin/Reports/NumberOfArticlesPivot${queryString ? `?${queryString}` : ''}`;
    cache.del(url);

    return request(url);
  }

  createArticle(data) {
    return request('/Admin/Articles', {
      method: 'POST',
      data: {
        title: data.title,
        articleTypeId: data.articleTypeId,
        serviceId: data.serviceId,
      },
    });
  }

  changeArticleStatus(data) {
    return request(`/Admin/Articles/${data.id}/Status`, {
      method: 'PUT',
      data: {
        statusId: data.statusId,
      },
    });
  }

  archiveArticle(data) {
    return request(`/Admin/Articles/${data.id}/Status`, {
      method: 'PUT',
      data: {
        statusId: data.statusId,
      },
    });
  }

  restoreArticle(data) {
    return request(`/Admin/Articles/${data.id}/Status`, {
      method: 'PUT',
      data: {
        statusId: data.statusId,
      },
    });
  }

  deleteArticle(data) {
    return request('/Admin/Articles', {
      method: 'DELETE',
      data: {
        articleIds: data,
      },
    });
  }

  changeArticleAudience(data) {
    return request(`/Admin/Articles/${data.id}/Audiences`, {
      method: 'PUT',
      data: {
        audienceId: data.audienceId,
      },
    });
  }

  changeArticleType(data) {
    return request(`/Admin/Articles/${data.id}/ArticleTypes/${data.articleTypeId}`, {
      method: 'PUT',
    });
  }

  saveArticle(data) {
    let postData = {};
    if (data.title) {
      postData.title = data.title;
    }
    if (data.articleTypeId) {
      postData.articleTypeId = data.articleTypeId;
    }
    if (data.serviceId) {
      postData.serviceId = data.serviceId;
    }
    if (data.articleTagIds) {
      postData.articleTagIds = data.articleTagIds;
    }
    if (data.fcrId) {
      postData.fcrStatusId = data.fcrId;
    }
    if (data.priorityId !== undefined) {
      postData.slaPrioritySchemeId = data.priorityId;
    }
    if (data.ticketTypeId) {
      postData.ticketTypeId = data.ticketTypeId;
    }
    if (data.fields) {
      postData = { ...postData, ...data.fields };
    }

    return request(`/Admin/Articles/${data.id}`, {
      method: 'PUT',
      data: postData,
    });
  }

  getArticleTypes() {
    return request('/Admin/ArticleTypes');
  }

  getArticleComments(data) {
    return request(`/Admin/Articles/${data.articleId}/Fields/${data.fieldId}/Comments`);
  }

  getPopularArticles() {
    return request('/Portal/Articles/Popular');
  }

  addArticleComment(data) {
    return request(`/Admin/Articles/${data.articleId}/Fields/${data.fieldId}/Comments`, {
      method: 'POST',
      data: {
        content: data.content,
      },
    });
  }

  updateArticleComment(data) {
    return request(`/Admin/ArticleFieldComments/${data.id}`, {
      method: 'PUT',
      data: {
        content: data.content,
      },
    });
  }

  deleteArticleComment(data) {
    return request(`/Admin/ArticleFieldComments/${data.id}`, {
      method: 'DELETE',
    });
  }

  resolveArticleComment(data) {
    return request(`/Admin/ArticleFieldComments/${data.id}/Status`, {
      method: 'PUT',
      data: {
        rateConversionId: data.ratingId,
        resolvedComment: data.notes,
      },
    });
  }

  getRatingConversions() {
    return request('/Admin/RateConversions');
  }

  getArticleAudiences() {
    return request('/Admin/Audiences');
  }

  getArticleStatus() {
    return request('/Admin/Status');
  }

  searchArticlesAuthors(data) {
    const { search } = data;
    let queryString = [];

    if (search) {
      queryString.push(`search=${encodeURIComponent(search.trim())}`);
    }

    if (queryString.length) {
      queryString = queryString.join('&');
    } else {
      queryString = '';
    }

    const url = `/Admin/Articles/Authors${queryString ? `?${queryString}` : ''}`;
    cache.del(url);

    return request(url);
  }

  getPriorities(data, key = 'Admin') {
    return request(`/${key}/SLAPrioritySchemes`);
  }

  shareLinkViaEmail(data) {
    return request('/Admin/Articles/EmailLink', {
      method: 'POST',
      data: {
        articleId: data.articleId,
        to: data.to,
        subject: data.subject,
        note: data.note,
      },
    });
  }

  getArticleHistory(data) {
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

    const url = `/Admin/Articles/${data.id}/Revisions${queryString ? `?${queryString}` : ''}`;

    cache.del(url);
    return request(url);
  }

  getArticleMetadata(id) {
    const url = `/Admin/Articles/${id}/MetaData`;
    cache.del(url);
    return request(url);
  }

  getSlaPrioritySchemes(data) {
    return request(`/Admin/Services/${data.serviceId}/Metadata`);
  }

  useArticle(data) {
    return request(`/Admin/Articles/${data.articleId}/Uses`, {
      method: 'PUT',
      data: {
        note: data.note,
      },
    });
  }

  removeAttachments(data) {
    return request(`/Admin/ArticleFieldAttachments/${data.id}`, {
      method: 'DELETE',
    });
  }
}

const ArticleService = new ArticleServiceImpl();

export default ArticleService;
