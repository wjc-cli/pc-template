<template>
    <div
        :class="['ls-calendar', { shadow: !range, border: range }]"
        :style="{ width: width + 'px' }"
    >
        <CalendarHandler
            @prev="prev"
            @prevDouble="prevDouble"
            @next="next"
            @nextDouble="nextDouble"
            >{{ year }}年{{
                month > 9 ? month : "0" + month
            }}月</CalendarHandler
        >
        <div class="ls-calendar-header">
            <span
                v-for="(item, index) in dayList"
                :key="item"
                :style="{ width: w, height: w, 'line-height': w }"
                :class="['ls-calendar-day', { r: index === 0 || index === 6 }]"
            >
                {{ item }}
            </span>
        </div>
        <div class="ls-calendar-body">
            <span
                v-for="(itemD, indexD) in dateList.list"
                :key="indexD"
                :style="{ width: w, height: w, 'line-height': w }"
                :class="[
                    'ls-calendar-date',
                    {
                        'not-current-m': !itemD.isCurrent,
                        active: itemD.active || itemD.vrc,
                        'is-today': itemD.isToday,
                        round,
                        status: itemD.hasStatus,
                        't-active':
                            range &&
                            ((chooseCurrentDate <
                                getDateTime(
                                    itemD.year,
                                    itemD.month,
                                    itemD.date
                                ) &&
                                getDateTime(
                                    itemD.year,
                                    itemD.month,
                                    itemD.date
                                ) < chooseCurrentDateVr) ||
                                (chooseCurrentDate >
                                    getDateTime(
                                        itemD.year,
                                        itemD.month,
                                        itemD.date
                                    ) &&
                                    getDateTime(
                                        itemD.year,
                                        itemD.month,
                                        itemD.date
                                    ) > chooseCurrentDateVr)),
                    },
                ]"
                @click="chooseIt(itemD)"
                @mouseover="vrChoose(itemD)"
                @mouseout="vrChooseO(itemD)"
            >
                {{ itemD.date }}
            </span>
        </div>
    </div>
</template>
<script>
import { defineComponent, computed, reactive, ref, onMounted } from "vue";
import CalendarHandler from "./calendar-handler";
import { getCurrentTime, getDateTime } from "./calendar";
export default defineComponent({
    name: "LsCalendar",
    components: {
        CalendarHandler,
    },
    props: {
        range: Boolean,
        width: {
            type: Number,
            default: 265,
        },
        round: Boolean,
        // 是否需要按钮
        needBtn: {
            type: Boolean,
            default: false,
        },
        /* 
            有事件的日期 日期下出现绿点 
            status="[
                '2021-12-14',
                '2021-12-16',
                '2021-12-20',
                '2021-12-21',
                '2021-12-23',
            ]"
        */
        status: Array, //
        modelValue: [Number, String],
    },
    setup(prop, { emit }) {
        const dayList = ["日", "一", "二", "三", "四", "五", "六"];
        const w = computed(() => (prop.width - 75) / 7 + "px");
        let dateList = reactive({ list: [] });
        let val = "";
        let timePart = "00:00:00";
        if (prop.modelValue) {
            const o = prop.modelValue.split(" ");
            val = prop.modelValue;
            if (!o[1]) val = prop.modelValue + " 00:00:00";
            else timePart = o[1];
        } else {
            val = Date.now();
        }
        const current = new Date(val);
        let year = ref(current.getFullYear());
        let month = ref(current.getMonth() + 1);
        let date = ref(0);
        let chooseCurrentDate = ref(0);
        let chooseCurrentDateVr = ref(0);
        if (prop.modelValue) {
            date.value = current.getDate();
            chooseCurrentDate.value = current.getTime();
        }
        let day = ref(current.getDay());
        let chooseDate = reactive(null);
        let prevChooseDate = reactive(null);
        let t = ref(0);
        const setValue = ()=> {
            chooseCurrentDate.value = getDateTime(
                year.value,
                month.value,
                date.value,
                timePart
            );
        }
        const getList = () => {
            if (t) clearTimeout(t);
            t = setTimeout(() => {
                dateList.list = getCurrentTime(
                    year.value,
                    month.value,
                    prop.status,
                    chooseCurrentDate.value
                );
            }, 200);
        };
        const prev = v => {
            --month.value;
            if (month.value === 0) {
                month.value = 12;
                --year.value;
            }
            setValue()
            getList();
        };
        const prevDouble = v => {
            --year.value;
            getList();
        };
        const next = v => {
            ++month.value;
            if (month.value === 13) {
                month.value = 1;
                ++year.value;
            }
            setValue()
            getList();
        };
        const nextDouble = v => {
            ++year.value;
            getList();
        };
        const chooseIt = v => {
            v.active = !v.active;
            v.vrc = false;
            if (prevChooseDate) {
                prevChooseDate.active = false;
            }
            date.value = v.date;
            prevChooseDate = v;
            if (v.active) chooseDate = v;
            else chooseDate = null;
            if (!v.isCurrent) {
                if (v.date < 15) {
                    next();
                } else {
                    prev();
                }
            } else {
                setValue()
            }
            emit("change", chooseDate);
        };
        const vrChoose = val => {
            if (!prop.range) return;
            val.vrc = true;
            chooseCurrentDateVr.value = getDateTime(
                val.year,
                val.month,
                val.date,
                timePart
            );
        };
        const vrChooseO = val => {
            if (
                !prop.range ||
                chooseCurrentDate.value === chooseCurrentDateVr.value
            )
                return;
            val.vrc = false;
        };
        onMounted(() => {
            getList();
            if (prop.modelValue) {
                setTimeout(() => {
                    prevChooseDate = dateList.list.find(ff => ff.active);
                }, 500);
            }
        });
        return {
            dayList,
            dateList,
            w,
            year,
            date,
            month,
            day,
            chooseIt,
            prev,
            prevDouble,
            next,
            nextDouble,
            vrChoose,
            vrChooseO,
            chooseCurrentDate,
            chooseCurrentDateVr,
            getDateTime,
        };
    },
});
</script>
<style lang="scss" scoped>
@import "../theme-style/calendar";
</style>
