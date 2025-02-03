export interface ResponseDto<T> {
  data: T[],
  page: number,
  pageSize: number,
  total: number,
  totalPages: number
}