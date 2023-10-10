declare interface PageParam {
  pageSize?: number;
  pageNo?: number;
}

declare interface PageResult<T = any> {
  list: T[];
  total: number;
}
