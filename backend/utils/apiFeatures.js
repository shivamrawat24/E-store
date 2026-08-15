/**
 * Wraps a Mongoose Query and progressively applies filtering, search,
 * sorting, field-limiting, and pagination based on req.query.
 * Chainable: new ApiFeatures(Model.find(), req.query).filter().search().sort().paginate()
 */
class ApiFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  /**
   * Supports exact-match filters plus range operators via query suffixes:
   * ?category=abc&price[gte]=100&price[lte]=500&status=active
   */
  filter() {
    const excludedFields = ['page', 'sort', 'limit', 'fields', 'search', 'keyword'];
    const queryObj = { ...this.queryString };
    excludedFields.forEach((field) => delete queryObj[field]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  /**
   * Full-text search across indexed fields using MongoDB's $text operator,
   * falling back gracefully if no `search`/`keyword` param is present.
   */
  search(fields = []) {
    const term = this.queryString.search || this.queryString.keyword;
    if (term) {
      if (fields.length > 0) {
        const regex = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
        this.query = this.query.find({ $or: fields.map((field) => ({ [field]: regex })) });
      } else {
        this.query = this.query.find({ $text: { $search: term } });
      }
    }
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  paginate() {
    const page = Math.max(parseInt(this.queryString.page, 10) || 1, 1);
    const limit = Math.min(parseInt(this.queryString.limit, 10) || 12, 100);
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    this.pagination = { page, limit };
    return this;
  }
}

module.exports = ApiFeatures;
