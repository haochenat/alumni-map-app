import { get } from '../utils/request';

export const getAlumniList = () => {
    return get('/data/alumni-list.json');
}