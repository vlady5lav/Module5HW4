import SupportDTO from './SupportDTO';

export default interface ResponseDTO<T> {
    page: number,
    per_page: number,
    total: number,
    total_pages: number,
    data: T,
    suppport: SupportDTO,
}
