<script setup>
import { ref, onMounted, watch, reactive } from 'vue'
import AMapLoader from '@amap/amap-jsapi-loader'
import { getAlumniList } from '../../api/map'
import { defaultMarker, activeMarker, defaultLabel, activeLabel } from '../../utils/map'
import { debounce, fuzzyMatch } from '../../utils/util'
import schoolPoint from '../../assets/img/school.png'


defineProps({
    msg: String,
})

let amap = null;

let amapServer = null;

let amapInfoWindow = null;

let AMapClass = null;

let alumniList = []

let markersList = [];

const zoomLevel = ref(1);

const searchValue = ref('');

const searchList = ref([]);

const listLoading = ref(false);

const listFinished = ref(true);

const showBottomPopup = ref(false);

const chooseAlumni = ref(null);

const chooseAddress = ref('');

const showCenter = ref(false)

watch(() => zoomLevel.value, (newVal) => {
    zoomLevelChange(newVal)
})

watch(() => chooseAlumni.value, (newVal) => {
    if (!newVal) {
        showBottomPopup.value = false;
        chooseAddress.value = ''
    }
})

onMounted(() => {
    initAmap()
})

const initAmap = async () => {
    AMapClass = await AMapLoader.load(
        {
            key: '9e680dbc96b4e12f54660e8cfbf0bde7',
            version: '2.0',
            plugins: ['AMap.Geocoder']
        }
    );
    let mapStyle = localStorage.getItem('map-style');
    amap = new AMapClass.Map('container', {
        viewMode: "3D",
        zoom: 5,
        mapStyle: mapStyle ? mapStyle : "amap://styles/light",
        center: [118.362106, 30.928822]
    })

    amapServer = new AMapClass.Geocoder();

    amapInfoWindow = new AMapClass.InfoWindow({
        // content: '信息窗体',
        anchor: 'bottom-center',
        offset: [0, -55],
        autoMove: false
    });

    amap.on('zoomend', () => {
        mapZoomend(amap.getZoom())
    });
    createCenterMaker()
    getAlumniData()
}

const getAlumniData = () => {
    getAlumniList().then(res => {
        alumniList = res;
        createMakers(res)
    })
}

const createCenterMaker = () => {
    let marker = new AMapClass.Marker({
        position: new AMapClass.LngLat(118.362106, 30.928822),
        anchor: 'bottom-center',
        offset: [0, -10],
        zIndex: 999,
        content: `
        <div class="marker">
            <img class="frame" src="${schoolPoint}" alt="">

        </div>
        `
    });
    amap.add(marker);
}

const createMakers = (markers) => {
    markers.forEach(async item => {
        let content = defaultMarker(item);
        item.isSelect = false;
        let marker = null
        if (item.location && item.location.lng && item.location.lat) {
            marker = new AMapClass.Marker({
                position: new AMapClass.LngLat(item.location.lng, item.location.lat),
                content: content,
                anchor: 'bottom-center',
                label: defaultLabel(item, 1),
                extData: item
            });

        } else if (item.address) {
            let { info, geocodes } = await getLocByAdd(item.address);
            if (info == 'OK' && geocodes[0]) {
                let { location } = geocodes[0];
                marker = new AMapClass.Marker({
                    position: location,
                    content: content,
                    anchor: 'bottom-center',
                    label: defaultLabel(item, 1),
                    extData: item
                });

            }
        }

        markersList.push(marker);
        amap.add(marker);

        marker.on('mousedown', (e) => {
            chooseMarker(marker)

        })

    })
}

const getLocByAdd = (address) => {
    return new Promise((resolve, reject) => {
        amapServer.getLocation(address, (status, res) => {
            if (status === 'complete') {
                resolve(res)
            } else {
                reject(status)
            }
        })
    })
}

const mapZoomend = (zoom) => {
    let level = zoom <= 6 ? 1 : 6 < zoom && zoom <= 10 ? 2 : 3;
    zoomLevel.value = level;
}

const zoomLevelChange = (level) => {
    markersList.forEach(marker => {
        let info = marker.getExtData();
        if (info.isSelect) {

            if (level < 3) {
                info.isSelect = false;
                marker.setExtData(info);
                marker.setLabel(defaultLabel(info, level));
                marker.setContent(defaultMarker(info));
                chooseAlumni.value = null
            }

        } else {
            marker.setLabel(defaultLabel(info, level))
        }
    })
}

const chooseMarker = (marker) => {
    let info = marker.getExtData();

    let center = marker.getPosition();
    amap.setZoomAndCenter(14, center, false, 500);
    marker.setLabel(activeLabel(info, 3));
    marker.setContent(activeMarker(info));
    if (info.address) {
        chooseAddress.value = info.address
    } else {
        amapServer.getAddress(marker.getPosition(), (status, result) => {
            let { info, regeocode } = result;
            if (info == 'OK') {
                chooseAddress.value = regeocode.formattedAddress
            }

        })
    }


    markersList.forEach(markerItem => {
        let item = markerItem.getExtData();
        console.log('', markerItem.getzIndex())
        if (item.id === info.id) {
            item.isSelect = true;
            markerItem.setExtData(item);
        } else if (item.isSelect) {
            item.isSelect = false;
            markerItem.setLabel(defaultLabel(item, 3));
            markerItem.setContent(defaultMarker(item));
            markerItem.setExtData(item);
        }
    })

    showBottomPopup.value = true
    chooseAlumni.value = info;
}

const performSearch = () => {
    listLoading.value = true
    console.log('搜索关键词：', searchValue.value);
    searchList.value = [];

    if (searchValue.value === '') {
        return
    }
    alumniList.forEach(item => {
        let res = fuzzyMatch(searchValue.value, item.name);
        if (res) {
            searchList.value.push(item)
        }
    })

    console.log('搜索结果：', searchList.value);

    listLoading.value = false
    listFinished.value = true
}

const debouncedSearch = debounce(performSearch, 500) //_.debounce(performSearch, 500);

const handleSearch = () => {
    debouncedSearch();
};

const clickSearchList = (id) => {
    let marker = markersList.find(m => {
        let item = m.getExtData();
        return item.id === id
    })
    if (marker) {
        chooseMarker(marker)

        searchList.value = []
    }
}

const focusSearch = () => {
    if (searchValue.value == '') return
    performSearch()
}

const changeStyle = () => {
    let mapStyle = localStorage.getItem('map-style');
    if (mapStyle === 'amap://styles/light') {
        amap.setMapStyle('amap://styles/dark')
        localStorage.setItem('map-style', 'amap://styles/dark')
    } else {
        amap.setMapStyle('amap://styles/light')
        localStorage.setItem('map-style', 'amap://styles/light')
    }

}

const openMedia = () => {
    showCenter.value = true
}
</script>
<template>
    <div class="search-main">
        <van-search class="search-input" v-model="searchValue" shape="round" autocomplete="off"
            :background="searchList.length > 0 ? '#fff' : 'transparent'" placeholder="请输入搜索关键词"
            @update:model-value="handleSearch" @focus="focusSearch" />
        <van-list v-if="searchValue != ''" v-model:loading="listLoading" :finished="listFinished" finished-text="没有更多了">
            <van-cell icon="location-o" v-for="item in searchList" :key="item.id" :title="item.name"
                @click="clickSearchList(item.id)" />
        </van-list>

        <van-button round plain icon="points" class="switch-btn" type="primary" @click="changeStyle">

        </van-button>
    </div>

    <div id="container" class="main-warp">
    </div>

    <van-popup v-model:show="showBottomPopup" position="bottom" round :overlay="false" :style="{ height: '35%' }"
        closeable>
        <div class="alumni-card" v-if="chooseAlumni">
            <div class="avatar">
                <img :src="`/img/${chooseAlumni.alumnisrc}`" />
                <div v-if="chooseAlumni.media" class="media-play" @click="openMedia">
                    <van-icon name="play-circle-o" />
                </div>
            </div>
            <div class="alumni-name">{{ chooseAlumni.name }}</div>
            <div class="alumni-info-items">
                <div class="alumni-info-item phone">
                    <van-icon name="phone-o" />
                    <span>{{ chooseAlumni.phone }}</span>
                </div>
                <div class="alumni-info-item signature">
                    <van-icon name="location-o" />
                    <span>{{ chooseAddress }}</span>
                </div>
                <div class="alumni-info-item signature">
                    <van-icon name="chat-o" />
                    <span>{{ chooseAlumni.signature }}</span>
                </div>
            </div>
        </div>
    </van-popup>

    <van-popup v-model:show="showCenter" round closeable :style="{ padding: '60px 10px 10px 10px' }">
        <video v-if="showCenter" class="media-warp" :src="`/media/${chooseAlumni.media.name}`" controls></video>
    </van-popup>

</template>

<style scoped lang="scss">
.main-warp {
    height: 100vh;

}

.search-main {
    position: absolute;
    z-index: 1;
    width: 100%;
}

.search-input {

    // position: absolute;
    // z-index: 1;
    // width: 100%;
}

.alumni-card {
    position: fixed;
    height: 35%;
    width: 100%;
    padding: 50px 25px 10px;

    .avatar {
        position: absolute;
        top: -38px;
        left: 25px;
        height: 80px;
        width: 80px;
        border-radius: 50%;
        overflow: hidden;
        background-color: #fff;

        img {
            height: 100%;
            width: 100%;
            padding: 5px;
            border-radius: 50%;
        }
    }


    .alumni-name {
        font-size: 25px;
        height: 35px;
    }

    .alumni-info-items {
        height: calc(100% - 35px);
        overflow-y: auto
    }

    .alumni-info-item {
        font-size: 18px;
        display: flex;
        padding: 7px 0 0;

        i {
            margin: 1% 5px 0 0
        }
    }

    .alumni-phone {
        display: flex;
    }

    .alumni-signature {
        display: flex
    }
}

.media-play {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 40px;
}

.media-warp {
    width: 100%;
}
</style>

<style lang="scss">
.marker {
    display: block;
    width: 40px;
    height: 40px;

    img {
        width: 100%;
        height: 100%;
    }

    .avatar {
        border-radius: 50%;
    }

    .frame {
        position: absolute;
        left: -5%;
        bottom: -2%;
        width: 120%;
        height: 120%;
    }
}

.amap-marker-label {
    background: transparent;
    border-color: transparent;

    .alumni-info {
        font-size: 14px;
        font-weight: 400;
        color: #ffaa00;
        position: relative;
        z-index: 0;
        line-height: 16px;
        width: 140px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;

        &::after {
            content: attr(data-content);
            -webkit-text-stroke: 1.5px #fff;
            position: absolute;
            left: 0;
            top: 0;
            z-index: -1;
            width: 100%;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
    }

    .active {
        text-align: center;
    }

}


.play_drop {
    width: 50px;
    height: 50px;
    -webkit-animation: shake 1s infinite;
    will-change: transform;
    animation: shake 1s infinite;
}

.switch-btn {
    position: absolute !important;
    right: 1rem;
}

@keyframes shake {

    0%,
    100% {
        transform: translateX(0) rotate(0deg);
    }

    25% {
        transform: translateX(-5px) rotate(-5deg);
    }

    50% {
        transform: translateX(5px) rotate(5deg);
    }

    75% {
        transform: translateX(-5px) rotate(-5deg);
    }
}
</style>
