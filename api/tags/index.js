
import request from 'utils/request';
import cache from 'utils/cache';

class TagServiceImpl {
  getTags(data) {
    const query = data || {};
    const sort = (query.sort || []).join(',');
    const page = query.page;
    const size = query.size;
    const search = (query.search || '');

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

    if (search) {
      queryString.push(`search=${encodeURIComponent(search.trim())}`);
    }

    if (queryString.length) {
      queryString = queryString.join('&');
    } else {
      queryString = '';
    }

    const url = `/Admin/ArticleTags${queryString ? (`?${queryString}`) : ''}`;
    cache.del(url);

    return request(url);
  }

  createTag(data) {
    return request('/Admin/ArticleTags', {
      method: 'POST',
      data: {
        name: data.name,
        customerDescription: data.customerDescription,
        internalDescription: data.internalDescription,
        notes: data.notes,
      },
    });
  }

  deleteTag(data) {
    return request('/Admin/ArticleTags', {
      method: 'DELETE',
      data: {
        articleTagIds: data,
      },
    });
  }

  editTag(data) {
    return request(`/Admin/ArticleTags/${data.id}`, {
      method: 'PUT',
      data: {
        name: data.name,
        customerDescription: data.customerDescription,
        internalDescription: data.internalDescription,
        notes: data.notes,
      },
    });
  }

  mergeTags(data) {
    return request(`/Admin/ArticleTags/${data.id}/Merge`, {
      method: 'PUT',
      data: {
        oldArticleTagIds: data.oldArticleTagIds,
      },
    });
  }

  searchTags(data, key = 'Admin') {
    return request(`/${key}/Articles/ArticleTags?search=${encodeURIComponent(data.query.trim())}`);
  }

  searchPortalTags(data) {
    return this.searchTags(data, 'Portal');
  }

  searchPublicTags(data) {
    return this.searchTags(data, 'Public');
  }
}

const TagService = new TagServiceImpl();

export default TagService;
