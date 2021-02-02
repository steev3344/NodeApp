
// error response
exports.error= function (res, err, next) {
  res.json({ status: 'error', code: 401, data: err.message})
}
// simple response format
exports.success = async function (res, dat, next) {
{
  res.json({ status: 'success', code: 200, data: dat})
}
}
// filtered paginated response format with metadata 
exports.filtersuccess = async function (res, dat, next) {
{
  res.json({ status: 'success', code: 200, meta:dat.meta,data:dat.data})
}
}

// filtering
exports.paginate = async function (req,res,model,populate,next) {
  var limit  = req.query.limit;
  var page = req.query.page;
  const { filter } = req.query;
  const { sort } = req.query;
  page = parseInt(page),
  limit = parseInt(limit)
try {
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const results = {};
  results.meta = {};
  const total = await model.countDocuments().exec();
  results.meta.Total_Data_in_database = total;
  if (endIndex < total) {
    results.meta.next = {
      page: page + 1,
      limit: limit,
    };
  }
  if (startIndex > 0) {
    results.meta.previous = {
      page: page - 1,
      limit: limit,
    };
  }
  // ** partial search
  if (filter) {
    samp = [filter];
    // const searchterms = Object.entries(samp);
    // const query = searchterms.map(function(parti) {
    //   const reg = new RegExp(parti[1], 'i');
    //   return { [parti[0]]: reg };
    // });
    partial = { $and: samp };
  }
  if (!filter) partial = filter;
  // ***
  results.data = await model
    .find(partial).populate(populate)
    .sort(sort)
    .limit(limit)
    .skip(startIndex)
    .exec();
  return results;
} catch (e) {
  res.json({ message: e.message });
}
}
//partial search
exports.partialsearch = async function (req,res,model,populate,next) {
var limit  = req.query.limit;
var page = req.query.page;
const { search } = req.query;
const { sort } = req.query;
page = parseInt(page),
limit = parseInt(limit)
try {
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const results = {};
  results.meta = {};
  const total = await model.countDocuments().exec();
  results.meta.Total_Data_in_database = total;
  if (endIndex < total) {
    results.meta.next = {
      page: page + 1,
      limit: limit,
    };
  }
  if (startIndex > 0) {
    results.meta.previous = {
      page: page - 1,
      limit: limit,
    };
  }
  // ** partial search
  if (search) {
    samp = search;
    const searchterms = Object.entries(samp);
    const query = searchterms.map(function(parti) {
      const reg = new RegExp(parti[1], 'i');
      return { [parti[0]]: reg };
    });
    partial = { $and: query };
    console.log('parti',partial)
  }
  if (!search) partial = search;
  // ***
  results.data = await model
    .find(partial).populate(populate)
    .sort(sort)
    .limit(limit)
    .skip(startIndex)
    .exec();
  return results;
} catch (e) {
  res.status(400).json({ message: e.message });
}
};