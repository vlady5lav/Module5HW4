import ISupportDTO from './SupportDTO'

export default interface IResponseDTO<T> {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
    data: T;
    suppport: ISupportDTO;
}
