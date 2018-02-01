
import request from 'utils/request';
import cache from 'utils/cache';

const ACTIVE = 11;
const ARCHIVED = 44;
const DELETED = 99;

class LocationServiceImpl {
  getLocations(data) {
    const query = data || {};
    const sort = (query.sort || []).join(',');
    const includedArchived = query.includedArchived;
    // const page = query.page;
    // const size = query.size;

    let queryString = [];
    if (sort && sort.length) {
      queryString.push(`sort=${sort}`);
    }
    if (includedArchived) {
      queryString.push(`includedArchived=${true}`);
    }
    // if (page) {
    //   queryString.push(`page=${page}`);
    // }
    // if (size) {
    //   queryString.push(`size=${size}`);
    // }

    if (queryString.length) {
      queryString = queryString.join('&');
    } else {
      queryString = '';
    }

    const url = `/Admin/Locations${queryString ? (`?${queryString}`) : ''}`;
    cache.del(url);

    return request(url);
  }

  getAllLocations(data) {
    const newData = Object.assign({}, data || {}, { includedArchived: true });
    return this.getLocations(newData);
  }

  getCountries() {
    const url = '/Countries';
    cache.del(url);
    return request(url);
  }

  createLocation(data) {
    return request('/Admin/Locations', {
      method: 'POST',
      data: {
        name: data.name,
        description: data.description,
        address: data.address,
        city: data.city,
        state: data.state,
        countryId: data.countryId,
      },
    });
  }

  deleteLocation(data) {
    return request('/Admin/Locations/Status', {
      method: 'PUT',
      data: {
        ids: data.ids,
        statusId: DELETED,
      },
    });
  }

  editLocation(data) {
    return request(`/Admin/Locations/${data.id}`, {
      method: 'PUT',
      data: {
        name: data.name,
        description: data.description,
        address: data.address,
        city: data.city,
        state: data.state,
        countryId: data.countryId,
      },
    });
  }

  archiveLocation(data) {
    return request('/Admin/Locations/Status', {
      method: 'PUT',
      data: {
        ids: data.ids,
        statusId: ARCHIVED,
      },
    });
  }

  restoreLocation(data) {
    return request('/Admin/Locations/Status', {
      method: 'PUT',
      data: {
        ids: data.ids,
        statusId: ACTIVE,
      },
    });
  }

}

const LocationService = new LocationServiceImpl();

export default LocationService;
