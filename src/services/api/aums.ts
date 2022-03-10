import zlFetch from 'zl-fetch';

export interface FetchArticleListParams {
    cid: number;
    pageSize: number;
    pageIndex: number;
}

export class AumsApi {
    serverPath: string;

    constructor(serverPath: string) {
        this.serverPath = serverPath;
    }
    /**
     * 获取栏目
     * @param cid 栏目id
     * @param level 栏目级别
     */
    queryChildrenColumnById({ cid, level }: { cid: number, level: number }): Promise<any> {
        return zlFetch(`${this.serverPath}/EMSP_CMS/queryChildrenColumnById`, {
            queries: {
                cid,
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
    getCMSarticleByCId({
        cid,
        pageSize,
        pageIndex,
    }: FetchArticleListParams): Promise<any> {
        return zlFetch(`${this.serverPath}/EMSP_CMS/getCMSarticleByCId`, {
            queries: {
                cId: cid,
                pageSize,
                currentPage: pageIndex,
            }
        });
    }
}