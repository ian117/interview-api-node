/* Pagination Utils */
// I can improve this by erasing the validations after, (we got Pipes and DTO's) but it works for now
export const getPagination = (
  page: any,
  size: any,
  defaultSize: any = '10',
) => {
  const pageStr = page;
  const sizeStr = size;

  if (pageStr && isNaN(pageStr)) {
    throw new Error(`page is NaN: ${page}`);
  }

  if (sizeStr && isNaN(sizeStr)) {
    throw new Error(`size is NaN: ${size}`);
  }

  let offset;
  let limit = size ? +size : defaultSize;
  if (page == '0' || page == '1') {
    offset = 0;
  } else {
    offset = page ? --page * limit : '0';
  }

  if (size) {
    limit = limit.toString();
  }

  if (page) {
    offset = offset.toString();
  }

  return { limit, offset };
};

export const getPagingData = (data: any, page: any, limit: any) => {
  const { count, rows: results } = data;
  let currentPage = page ? +page : 0;
  if (currentPage <= 0) {
    currentPage = 1;
  }
  const totalPages = Math.ceil(count / limit);
  if (totalPages <= 0) {
    currentPage = 0;
  }
  return { count, totalPages, currentPage, results };
};
