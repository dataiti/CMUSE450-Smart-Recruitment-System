const parseArrayQueryParam = (paramName, query) =>
  query[paramName] && query[paramName] !== "[]"
    ? JSON.parse(query[paramName])
    : -1;

module.exports = { parseArrayQueryParam };
