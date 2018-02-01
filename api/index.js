import users from './users';
import customers from './customers';
import logs from './mailLogs';
import tickets from './tickets';
import roles from './roles';
import services from './services';
import groups from './groups';
import permissions from './permissions';
import articles from './articles';
import tags from './tags';
import locations from './locations';
import organizations from './organizations';
import portal from './portal';
import report from './report';
import settings from './settings';

const api = {
  users,
  customers,
  roles,
  permissions,
  services,
  groups,
  articles,
  tags,
  locations,
  organizations,
  portal,
  report,
  settings,
  logs,
  tickets,
};

export default api;
