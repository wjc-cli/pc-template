<template>
    <div class="slider" v-loading="loading">
        <div
            v-for="(item, index) in navList"
            :key="item[menuId]"
            :class="[
                'nav',
                {
                    active: navPreviewIds === item[menuId],
                    rotate: item.actived,
                },
            ]"
            :style="{ padding: `0 ${10 * (level + 1)}px` }"
            :ref="`sliderNav${item[menuId]}`"
        >
            <div
                :class="[
                    'nav-item',
                    {
                        'assign-color': !item?.children?.length,
                        borColor: level > 0,
                    },
                ]"
                @click="showItem(item, index)"
            >
                <div class="names">
                    <img
                        class="icons"
                        v-if="!item.userIcon"
                        src="@/assets/app.svg"
                        alt=""
                    />
                    <component class="svg" :is="item.userIcon"></component>
                    <span>{{ item.title }}</span>
                </div>
                <span
                    v-if="item?.children?.length > 0"
                    class="iconfont icon-arrow-down arrow"
                ></span>
            </div>
            <template v-if="item?.children?.length > 0">
                <slider-bar :navList="item.children" :level="level + 1" />
            </template>
        </div>
    </div>
</template>
<script>
import {
    ref,
    defineComponent,
    getCurrentInstance,
    computed,
    reactive,
} from "vue";
import { useStore } from "vuex";
import { mkActive } from "@/function/navFilter";
import bus from "@/bus.js";
export default defineComponent({
    name: "SliderBar",
    props: {
        navList: Array,
        level: {
            type: Number,
            default: 0,
        },
        loading: Boolean,
        children: {
            type: String,
            default: "children",
        },
        menuId: {
            type: String,
            default: "menuId",
        },
        everyheight: {
            type: String,
            default: "42px",
        },
    },
    setup(prop) {
        let { ctx } = getCurrentInstance();
        let store = useStore();
        let navPreviewIds = computed(() => store.getters.getNavPreviewId);
        let prevIds = computed(() => store.getters.getBreadPrevId);
        const maxLevel = ref(3); // ??????????????????
        const initCellHeight = parseInt(prop.everyheight); // ????????????????????????????????????
        let prevObj = reactive({});

        //  ?????????????????????????????????
        const setHeight = (f, refCurrent) => {
            // ????????????dom????????????
            refCurrent.parentNode.style.height =
                initCellHeight * prop.navList.length + "px";
            if (f?.[prop.children]?.length > 0) {
                // ????????????dom????????????
                refCurrent.lastChild.style.height =
                    initCellHeight * f[prop.children].length + "px";
            }
        };

        // ??????????????????????????????  ????????????????????????
        const delHeight = arr => {
            const child = arr?.[prop.children] || [];
            Array.prototype.forEach.call([...child], d => {
                if (d.lastChild.className === "slider") {
                    d.lastChild.style.height = 0;
                    delHeight(d.lastChild);
                }
            });
        };

        // ?????????????????????????????????
        const setActiveFalse = arr => {
            arr.forEach(f => {
                f.actived = false;
                if (f?.[prop.children].length > 0)
                    setActiveFalse(f[prop.children]);
            });
        };

        // ????????????
        const closeAllTree = obj => {
            if (!obj?.lastChild?.style) return;
            obj.lastChild.style.height = 0;
            const child = [...obj.lastChild.children];
            if (child.length > 0) {
                child.forEach(f => {
                    if (f.lastChild.className === "slider")
                        f.lastChild.style.height = 0;
                });
            }
        };

        // ????????????
        const showItem = (f, index) => {
            // ????????????????????????
            if (!Object.keys(prevObj).length && prevObj.menuId !== f.menuId)
                prevObj = f;
            let currentNew = ctx._.refs; // ??????ref??????

            // ???????????????
            if (prop.level === 0 && prevIds.value !== f.menuId) {
                prevObj.actived = false;
                if (prevObj?.[prop.children].length > 0) {
                    setActiveFalse(prevObj[prop.children]);
                    closeAllTree(currentNew[`sliderNav${prevObj.menuId}`]);
                }
                store.commit("setBreadPrevId", f.menuId);
            } else if (prop.level === 1 && prevIds.value !== f.menuId) {
                // ???????????????
                // } else if(prop.level === 1 && f.children.length > 0 && prevIds.value !== f.menuId) {
                Object.keys(currentNew).forEach((u, i) => {
                    if (prevObj.actived && f.menuId !== prevObj.menuId) {
                        prevObj.actived = f.actived;
                        closeAllTree(currentNew[u]);
                    }
                });
            }
            f.actived = !f.actived;
            let refCurrent = currentNew[`sliderNav${f.menuId}`]; // ????????????ref
            if (!f.children.length) {
                bus.emit("changePath", f.href); // ??????path
                store.commit("setNavPreviewId", f.menuId);
                if (+f.parentId < 1) store.commit("delBreadListTemp");
                store.commit("setBreadList", { level: prop.level, value: f });
                // ???????????????????????????
                setHeight(f, refCurrent);
                return;
            } else {
                f.children = mkActive(f.children);
                store.commit("setBreadListTemp", {
                    level: prop.level,
                    value: f,
                });
            }
            if (maxLevel.value - 1 !== prop.level) {
                if (f.actived) {
                    if (prop.level > 0) {
                        // ?????????????????????
                        refCurrent.parentNode.style.height =
                            initCellHeight * prop.navList.length +
                            initCellHeight * f.children.length +
                            "px";
                        if (f?.children?.length) {
                            // ??????????????????????????????
                            refCurrent.lastChild.style.height =
                                initCellHeight * f.children.length + "px";
                        }
                    } else {
                        // ???????????????
                        if (f?.children.length) setHeight(f, refCurrent);
                    }
                } else {
                    refCurrent.lastChild.style.height = 0;
                    if (prop.level > 0) {
                        refCurrent.parentNode.style.height =
                            initCellHeight * prop.navList.length + "px";
                    } else {
                        // ????????????
                        delHeight(refCurrent.lastChild);
                    }
                }
            }
            prevObj = f;
        };

        return {
            // sliderNav,
            showItem,
            navPreviewIds,
        };
    },
});
</script>
<style lang="scss" scoped></style>
