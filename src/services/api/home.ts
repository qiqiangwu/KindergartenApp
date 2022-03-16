import _ from 'lodash';
import { stores } from '../../stores'
import * as aums from '../aums'

export class HomeApi {
    static readonly TAG = HomeApi.name;

    async fetchColumns(): PVoid {
        const { home } = stores;

        home.setLoading(true);

        let homeData;
        try {
            const responseData = await aums.queryChildrenColumnById({
                cid: home.id,
                level: home.level
            }).then(response => response.data);

            homeData = responseData?.data?.children?.[0]?.children;
            if (!Array.isArray(homeData)) {
                // 数据未添加
                home.setError('栏目内容为空');
                console.warn(`${HomeApi.TAG} response data: ${JSON.stringify(responseData)}`);
            }
        } catch (err: any) {
            home.setError('获取栏目数据失败');

            console.error(`${HomeApi.TAG} error: ${err.message}`)
        }

        if (Array.isArray(homeData)) {
            // 头部广告
            const topAdImageList = homeData.find(
                (a: any) => a.columnName === '头部广告位',
            )?.imgList;
            const topAds = Array.isArray(topAdImageList)
                ? topAdImageList.map((item: any) => ({
                    image: `${aums.serverPath}${item.src}`,
                }))
                : [];
            home.setTopAds(topAds);

            // 主栏目
            const columns = homeData.find(
                (a: any) => a.columnName === '子栏目',
            )?.children;
            const nav = Array.isArray(columns)
                ? columns
                    .map(item => {
                        return {
                            icon: `${aums.serverPath}${item.icon.src}`,
                            name: item.columnName,
                            id: item.id,
                        };
                    })
                    .slice(0, 8)
                : [];
            home.setEntryColumns(nav);

            // 通知公告
            let notice = homeData.find(
                (a: any) => a.columnName === '通知公告',
            );
            if (notice) {
                notice = {
                    id: notice.id,
                    name: notice.columnName
                }
            }
            home.setNotice(notice);

            console.log(`${HomeApi.TAG} notice: ${JSON.stringify(notice)}`)
        }

        home.setLoading(false);
    }

    async fetchArticleList({
        cid,
        pageSize,
        pageIndex,
        columnName
    }: Required<aums.FetchArticleListParams>): PVoid {
        const { home } = stores;

        if (pageIndex === 1) {
            home.resetList();
        }

        home.setListLoading(true);

        let list;
        let totalPage;

        try {
            const response = await aums.getCMSarticleByCId({ cid, pageSize, pageIndex });
            list = response?.data?.data?.content;
            totalPage = response?.data?.data?.totalPage;

            if (!Array.isArray(list)) {
                // 数据未添加
                home.setListError(`${columnName}内容为空`);
                console.warn(`${HomeApi.TAG} response data: ${JSON.stringify(response.data)}`);
            }
        } catch (error: any) {
            home.setListError(`获取${columnName}数据失败`);

            console.error(`${HomeApi.TAG} error: ${error.message}`)
        }

        home.setPage(pageIndex);
        home.setList(_.map(list, item => ({
            id: item.id,
            image: `${aums.serverPath}${item.articleImage}`,
            title: item.text,
            date:
                item.fupdatetime === 'null' ? item.faddtime : item.fupdatetime,
        })))
        home.setTotalPage(totalPage);

        home.setListLoading(false);
    }
}