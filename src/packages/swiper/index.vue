<template>
    <swiper
        :slidesPerView="option.slidesPerView"
        :spaceBetween="option.spaceBetween"
        :loop="true"
        :pagination="{
            clickable: option.pagination.clickable,
        }"
        :centeredSlides="option.centeredSlides"
        :autoplay="{
            delay: option.delay,
        }"
        :navigation="option.navigation"
        :modules="modules"
        class="mySwiper"
        @swiper="onSwiper"
        @slideChange="onSlideChange"
    >
        <swiper-slide v-for="(item, index) in swiperlist" :key="index">
            <div
                :style="{ width: option.width, height: option.height }"
                class="flex"
            >
                <img style="width: 100%; height: 100%" :src="item.src" />
            </div>
        </swiper-slide>
    </swiper>
</template>
<script setup>
import { ref, reactive, onActivated, onMounted, defineProps } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue/swiper-vue.js"; // swiper所需组件
// 这是分页器和对应方法，swiper好像在6的时候就已经分离了分页器和一些其他工具
import { Autoplay, Navigation, Pagination, A11y } from "swiper";
// 引入swiper样式，对应css 如果使用less或者css只需要把scss改为对应的即可
import "swiper/swiper.min.css";
import "swiper/modules/navigation/navigation.min.css";
import "swiper/modules/pagination/pagination.min.css";
import "swiper/modules/scrollbar/scrollbar.min.css";
const modules = [Autoplay, Pagination, Navigation, A11y];
const prop = defineProps({
    swiperlist: Array,
    option: Object,
});
const onSwiper = swiper => {
    console.log(swiper);
};
const onSlideChange = () => {
    console.log("slide change");
};

// const swiper = {
//     ranks: {
//         option: {
//             width: "290px",
//             height: "180px",
//             slidesPerView: 4,
//             spaceBetween: 20,
//             navigation: true,
//             delay: 3000,
//             centeredSlides: false,
//             pagination: {
//                 clickable: false,
//             },
//         },
//         list: [
//             {
//                 link: "",
//                 id: 1,
//                 src: require("@/assets/images/ranks/pic-1.png"),
//             },
//             {
//                 link: "",
//                 id: 2,
//                 src: require("@/assets/images/ranks/pic-2.png"),
//             },
//             {
//                 link: "",
//                 id: 3,
//                 src: require("@/assets/images/ranks/pic-3.png"),
//             },
//             {
//                 link: "",
//                 id: 4,
//                 src: require("@/assets/images/ranks/pic-4.png"),
//             },
//         ],
//     },
// };
</script>
<style lang="sass" scoped></style>
