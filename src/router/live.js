
export default[
    //直播课
    {
        path:'/live',
        name:'liveCourse',
        component:resolve => require(['@/pages/live/Live'],resolve)
    },
    //直播课详情
    {
        path:'/live/detail/:id',
        name:'liveDetail',
        component:resolve => require(['@/pages/live/Details'],resolve)
    }
]