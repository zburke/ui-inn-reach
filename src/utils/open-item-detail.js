export const openItemDetail = ({
  history,
  path,
  location,
  id
}) => history.push({
  pathname: `${path}/${id}/view`,
  search: location.search,
  state: location.state,
});
