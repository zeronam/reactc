import request from 'utils/request';

class SettingServiceImpl {
  saveSettings(data) {
    return request('/Admin/SiteSettings', {
      method: 'PUT',
      data,
    });
  }

  getSettings() {
    return request('/Admin/SiteSettings');
  }

  changeContactInfo(data) {
    return request('/Admin/SiteSettings/ContactUs', {
      method: 'PUT',
      data,
    });
  }

  removeSiteLogo() {
    return request('/Admin/SiteBrandings/Logos', {
      method: 'DELETE',
    });
  }

  removeSearchBackground() {
    return request('/Admin/SiteBrandings/PortalCoverImages', {
      method: 'DELETE',
    });
  }

  switchArticleType(data) {
    return request(`/Admin/ArticleTypeSettings/${data.id}`, {
      method: 'PUT',
      data: {
        enable: data.enable,
      },
    });
  }

  getHelpLocations() {
    return request('/Public/HelpLocations');
  }

  getTimezone() {
    return request('/Admin/SiteSettings/TimeZones');
  }

  getOperationHours() {
    return request('/Admin/Calendars/Operations');
  }

  updateOperationHours(data) {
    const timezoneOffset = new Date().getTimezoneOffset() / 60;
    return request('/Admin/Calendars/Operations', {
      method: 'PUT',
      data: {
        businessHours: data.businessHours,
        closedDates: data.closedDates,
        dateTimeOffset: timezoneOffset,
        timeZoneId: data.timeZoneId,
      },
    });
  }
}

const SettingService = new SettingServiceImpl();

export default SettingService;
