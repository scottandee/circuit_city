function selfUrlGenerator(req) {
  return req.protocol + '://' + req.get('host') + req.originalUrl;
}

function urlGenerator(req, path, id) {
  return req.protocol + '://' + req.get('host') + path + id;
}

function paginationUrlGen(req, page) {
  return `${req.protocol}://${req.get('host')}${req.originalUrl}?page=${page}`;
}

module.exports = { selfUrlGenerator, urlGenerator, paginationUrlGen };