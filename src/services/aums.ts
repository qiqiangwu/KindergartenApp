import ajax from '../utils/ajax'

export interface FetchArticleListParams {
    cid: number;
    pageSize: number;
    pageIndex: number;
    columnName?: string;
}

export const serverPath = 'http://219.233.221.231:38080';

/**
     * 获取栏目
     * @param cid 栏目id
     * @param level 栏目级别
     */
export function queryChildrenColumnById({ cid, level }: { cid: number, level: number }): Promise<any> {
    return ajax(`${serverPath}/EMSP_CMS/queryChildrenColumnById`, {
        params: {
            cId: cid,
            level
        }
    });
}


/**
 * 获取栏目下文章列表
 * @param cid 栏目
 * @param pageSize 单页数量
 * @param pageIndex 当前页
 */
export function getCMSarticleByCId({
    cid,
    pageSize,
    pageIndex,
}: FetchArticleListParams): Promise<any> {
    return ajax(`${serverPath}/EMSP_CMS/getCMSarticleByCId`, {
        params: {
            cId: cid,
            pageSize,
            currentPage: pageIndex,
        }
    });
}