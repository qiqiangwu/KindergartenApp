import { makeAutoObservable } from 'mobx';
import { hydrateStore, makePersistable } from 'mobx-persist-store';

export type TopAd = {
    image: string;
}

export type Column = {
    icon?: string;
    name: string;
    id: number;
}

export type Article = {
    id: number;
    image: string;
    title: string;
    date: string;
}

export class HomeStore implements IStore {
    id = 1272;
    level = 5;

    loading = false;
    setLoading = (v: boolean): void => {
        this.loading = v;
    };

    error = '';
    setError = (v: string): void => {
        this.error = v;
    }

    topAds: TopAd[] = [];
    setTopAds(v: TopAd[]) {
        this.topAds = v;
    }

    entryColumns: Column[] = [];
    setEntryColumns(v: Column[]) {
        this.entryColumns = v;
    }

    notice: Column | null = null;
    setNotice(v: Column | null) {
        this.notice = v;
    }

    page: number | null = null;
    setPage(v: number | null) {
        this.page = v;
    }

    totalPage: number | null = null;
    setTotalPage(v: number) {
        this.totalPage = v;
    }

    list: Article[] = [];
    setList(v: Article[]) {
        if (v) {
            if (this.page === 1) {
                this.list = v;
            } else {
                this.list.push(...v);
            }
        }
    }

    listLoading = false;
    setListLoading(v: boolean) {
        this.listLoading = v;
    }

    listError?: string;
    setListError(v: string) {
        this.listError = v;
    }

    resetList() {
        this.listLoading = false;
        this.list = [];
        this.page = null;
        this.totalPage = null;
        this.listError = undefined;
    }

    get hasMore() {
        if (this.page === null || this.totalPage == null) {
            return true;
        }
        return this.page < this.totalPage;
    }

    constructor() {
        makeAutoObservable(this);

        makePersistable(this, {
            name: HomeStore.name,
            properties: ['topAds', 'entryColumns', 'notice', 'page', 'totalPage', 'list']
        })
    }

    hydrate = async (): PVoid => {
        await hydrateStore(this);
    };
}