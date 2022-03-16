import { observer } from 'mobx-react';
import React, { FunctionComponent, useCallback, useEffect, useState } from 'react';
import { Carousel, Colors, GridView, Image, Spacings, Text, TouchableOpacity, Typography, View } from 'react-native-ui-lib';
import { ScreenComponent } from 'rnn-screens';
import { useServices } from '../services';
import { useStores } from '../stores';
import _ from 'lodash'
import { useConstants } from '../utils/constants';
import { ActivityIndicator, Alert, FlatList, StyleSheet } from 'react-native';
import { Article, Column } from '../stores/home';

const entryColumnsOffset = 30;

const TAG = 'HomeScreen'

const initNoticeList = async (fetchArticleList: any, notice: Column | null) => {
    if (notice === null) {
        return;
    }
    await fetchArticleList({
        cid: notice.id,
        pageIndex: 1,
        pageSize: 10,
        columnName: notice.name
    });
}

export const Home: ScreenComponent = observer(({ componentId }) => {
    console.log(`${TAG} HomeScreen render`)

    const { api } = useServices();
    const { home: homeStore } = useStores();
    const [refresh, setRefresh] = useState(false);

    const { dim } = useConstants();
    const { width } = dim;

    const carousel = React.createRef<typeof Carousel>();
    const { topAds, entryColumns, notice, page, hasMore, listLoading } = homeStore;
    const { fetchColumns, fetchArticleList } = api.home;

    useEffect(() => {
        fetchColumns()
    }, [componentId])

    useEffect(() => {
        // 初始化通知公告列表
        if (page === null && !refresh) {
            initNoticeList(fetchArticleList, notice);
        }
    }, [notice]);


    const onPagePress = (index: number) => {
        if (carousel && carousel.current) {
            carousel.current.goToPage(index, true);
        }
    };

    const renderListHeader = useCallback(() => {
        return (
            <>
                <Carousel
                    ref={carousel}
                    autoplay={true}
                    loop
                    pageWidth={width}
                    containerStyle={{ height: width * 3 / 5 }}
                    containerMarginHorizontal={0}
                    itemSpacings={0}
                    pageControlPosition={Carousel.pageControlPositions.OVER}
                    pageControlProps={{ onPagePress: onPagePress, enlargeActive: true, containerStyle: { bottom: entryColumnsOffset + 10 } }}
                    allowAccessibleLayout
                >
                    {
                        _.map(topAds, (item, index) => {
                            return (
                                <Image
                                    key={index}
                                    source={{
                                        uri: item.image,
                                        width: width,
                                        height: width * 3 / 5
                                    }} />
                            )
                        })
                    }
                </Carousel>
                <View center style={styles.entryColumns}>
                    <GridView
                        numColumns={4}
                        items={_.map(entryColumns, (item) => ({
                            renderCustomItem: () => (
                                <TouchableOpacity onPress={() => Alert.alert(item.name)}>
                                    <View center>
                                        <Image source={{ uri: item.icon, width: 48, height: 48 }} />
                                        <Text>{item.name}</Text>
                                    </View>
                                </TouchableOpacity>
                            )
                        }))}
                        viewWidth={width - 2 * Spacings.s3 - 2 * Spacings.s2}
                    />
                </View>
                {
                    notice?.name && (
                        <View paddingL-s4 paddingT-s6 paddingB-s4>
                            <Text style={{ ...Typography.text60BL }} grey10>{notice.name}</Text>
                        </View>
                    )
                }
            </>
        )
    }, [width, topAds, entryColumns, notice])

    const refreshHandler = useCallback((refreshing) => setRefresh(refreshing), []);

    return (
        <View flex bg-bgColor useSafeArea>
            <MainFlatList
                data={homeStore.list}
                renderListHeader={renderListHeader}
                notice={notice}
                loading={listLoading}
                hasMore={hasMore}
                page={page}
                refresh={refresh}
                refreshHandler={refreshHandler}
            />
        </View>
    )
})

const styles = StyleSheet.create({
    entryColumns: {
        position: 'relative',
        marginHorizontal: Spacings.s3,
        marginTop: -entryColumnsOffset,
        backgroundColor: Colors.white,
        paddingHorizontal: Spacings.s2,
        paddingVertical: Spacings.s3,
        borderRadius: 20
    }
})

type MainFlatListProps = {
    data: Article[]
    renderListHeader: React.JSXElementConstructor<any>
    notice: Column | null
    loading: boolean
    hasMore: boolean
    page: number | null
    refresh: boolean
    refreshHandler: (value: boolean) => void
}

const MainFlatList: FunctionComponent<MainFlatListProps> = ({
    data,
    renderListHeader,
    notice,
    loading,
    hasMore,
    page,
    refresh,
    refreshHandler
}) => {
    console.log(`${MainFlatList.name} render`)

    const print = (type: string) => {
        console.log(`${MainFlatList.name} ${type} changed.`)
    }

    useEffect(() => {
        print('data');
    }, [data]);
    useEffect(() => {
        print('renderListHeader');
    }, [renderListHeader]);
    useEffect(() => {
        print('notice');
    }, [notice]);
    useEffect(() => {
        print('loading');
    }, [loading]);
    useEffect(() => {
        print('hasMore');
    }, [hasMore]);
    useEffect(() => {
        print('page');
    }, [page]);

    const { dim: { width } } = useConstants();
    const { api } = useServices();
    const { fetchColumns, fetchArticleList } = api.home;

    const renderListItem = useCallback(({ item }: { item: Article }) => {
        return (
            <TouchableOpacity key={item.id.toString()}>
                <View
                    row
                    paddingH-s4
                    paddingV-s1
                    spread
                >
                    <View flex paddingR-s3>
                        <Text style={{ ...Typography.text70L }} grey10 numberOfLines={2}>{item.title}</Text>
                    </View>
                    <Image source={{ uri: item.image, width: 100, height: 60 }} br-4 borderRadius={5} />
                </View>
            </TouchableOpacity>
        )
    }, [])

    const ListFooterComponent = useCallback(() => {
        if (loading) {
            return (<ActivityIndicator />)
        } else {
            if (hasMore) {
                return null;
            } else {
                return (
                    <View center padding-s2>
                        <Text grey40>没有更多数据</Text>
                    </View>
                )
            }
        }
    }, [loading, hasMore])

    const ItemSeparatorComponent = useCallback(() => {
        return (
            <View
                style={{
                    height: 1,
                    width: width - Spacings.s3 * 2,
                    backgroundColor: Colors.grey60,
                    opacity: 0.5,
                    margin: Spacings.s2,
                }}
            />
        );
    }, [width])

    const onLoadMore = useCallback(async ({ distanceFromEnd }) => {
        console.log(`${MainFlatList.name} onLoadMore()`)
        console.log(`${MainFlatList.name} page: ${page}`)
        console.log(`${MainFlatList.name} loading: ${loading}`)
        console.log(`${MainFlatList.name} distanceFromEnd: ${distanceFromEnd}`)

        if (!notice) {
            return;
        }
        if (!hasMore) {
            return;
        }
        if (loading) {
            return;
        }

        await fetchArticleList({
            cid: notice.id,
            pageIndex: (page ?? 0) + 1,
            pageSize: 10,
            columnName: notice.name
        });
    }, [notice, hasMore, loading, page])

    const onRefresh = useCallback(async () => {
        refreshHandler(true);
        await fetchColumns()
        await initNoticeList(fetchArticleList, notice)

        refreshHandler(false);
    }, [notice])

    return (
        <FlatList
            data={data}
            keyExtractor={item => item.id.toString()}
            renderItem={renderListItem}
            ListHeaderComponent={renderListHeader}
            ListFooterComponent={ListFooterComponent}
            ItemSeparatorComponent={ItemSeparatorComponent}
            onEndReachedThreshold={0.4}
            onEndReached={onLoadMore}
            refreshing={refresh}
            onRefresh={onRefresh}
        />
    )
}