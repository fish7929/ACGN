// 文件名称: linkConfig.js
// 创 建 人: zhao
// 创建日期: 2016/7/7
// 描    述: 有

var gili_config = {};

/***
 * 颜表情
 * @type {string[]}
 */
gili_config.FaceList = [
    "（'∀`）σ",
    "( ´ ▽ ` )ﾉ",
    "ヽ（ゝω•）",
    "*,:.☆\(￣▽￣)/$*.°★",
    "o((≧ω≦ ))o",
    "｡◕‿◕｡",
    "\(￣︶￣*\)",
    "(づ￣ 3￣)づ",
    "୧(๑•̀ᴗ•́๑)୨",
    "(´∀｀)♡",
    "(´ ▽｀).。ｏ♡",
    "╰(￣ω￣ｏ)",
    "（o'Д`O）",
    "┗(｀o′)┓",
    "(*￣︿￣)",
    "(╯‵□′)╯︵┻━┻",
    "∠( ﾟдﾟ)/",
    "(﹁〃﹁)",
    "凸（⊙▂⊙✖）",
    "→)╥﹏╥)",
    "（ ｀o′）{  •••－＝≡))",
    "(╯‵□′)╯炸弹！•••*～●",
    "〒_〒 ‵ｏ′-一┳═┻︻▄",
    "ヽ(*’(OO)’)ﾉ",
    "_(:3」∠)_",
    "ψ（`∇'）ψ",
    "@(*^ｪ^)@",
    "（= ^•ェ•^ =）",
    "（*ΦωΦ*）",
    "o(=·ェ·=)m",
    "☆⌒(≥。≪)",
    "...( ＿ ＿)ノ壁",
    "┗( T﹏T )┛",
    "\（-___________-;) /",
    "（O'（I）`O）",
    "(+(工)+╬)",
    "（¯（エ）¯）ノ",
    "( ゜- ゜)つロ",
    "～(￣▽￣～)(～￣▽￣)～",
    "(〃￣︶￣)人(￣︶￣〃)",
    "♡(*´∀｀*)人(*´∀｀*)♡",
    "( ｡･_･｡)人(｡･_･｡ )",
    "ヽ（○'∀`）ノ♪",
    "ヽ(´▽｀；)/♪",
    "(´┏ω┓｀)/",
    "(´┏･┓｀)",
    "(￣┏Д┓￣°*)",
    "（O'∀`O）",
    "（o'ω`O）",
    "(。_。)",
    "(￣∠ ￣ )ﾉ",
    "（•ω•`='•ω•）",
    "-______-〃",
    "(;° ロ°)",
    "o (´^｀)o",
    "（￣へ￣）",
    "(^人^)[叁张月票]",
    "Σ( ° △ °|||)︴",
    "Σ(っ °Д °;)っ",
    "ヽ(ﾟДﾟ)ﾉ",
    "((((；゜Д゜)))",
    "(¦3[______]",
    "(#｀・ω・´)",
    "▼_,▼",
    "(눈_눈)",
    "p(●｀□´●)q",
    "(´・ω・｀)",
    "(▰˘◡˘▰)",
    "(ノへ￣、)",
    "｡：ﾟ(｡ﾉω＼｡)ﾟ･｡",
    "ヽ(●ﾟ´Д｀ﾟ●)ﾉﾟ",
    "( ≥﹏≤。)",
    ",,Ծ‸Ծ,,",
    "（πーπ）",
    "(｡◕ˇ_ˇ◕｡)",
    "(○’ω’○)",
    "\(〃▔□▔)/",
    "(☍﹏≤)",
    "╯﹏╰",
    "（¯﹃¯）",
    "(・∀・)ノｼ卍卍卍卍卍卍卍",
    ",,Ծ‸Ծ,,",
    "〒▽〒",
    "٩(ŏ﹏ŏ、)۶.",
    "ヾ(。>д<)シ",
    "ヽ(◍´∀`◍)ﾉ"
];

/**
 * 提示内容
 */
gili_config.Tip = {
    NOLOGIN : "请先登录",
    UNDEVELOPED : "敬请期待!",
    PUBLISHTOPICTITLE : "发布话题",
    PUBLISHILLTITLE : "发布插画",
    PUBLISH_ERROR_1 : "请填写话题内容！",
    PUBLISH_ERROR_2 :"请上传插画！",
    PUBLISH_SUCCESS : "发布成功",
    PUBLISH_FAIL : "发布失败:",
    NOT_ATTENTION : "取消关注",
    ATTENTIONED : "关注",
    COMMENT_ERROR : "请输入评论内容！",
    COMMENT_SUCCESS : "评论发布成功",
    COMMENT_FAIL :"评论发布失败:",
    ACTIVITY_LIKED :"已点赞",
    ACTIVITY_LIKE :"点赞"
};


/**
 * 友情链接
 */
gili_config.Link = [
    {src : "./images/link/link2.png", link : "http://www.bearead.com"},
    {src : "./images/link/link1.png", link : "http://www.buhua.la"},
    {src : "./images/link/link3.png", link : "http://www.comicdd.com"},
    {src : "./images/link/link4.png", link : "http://www.xianyuwen.com"},
    {src : "./images/link/link5.jpg", link : "http://www.nomo.cn"},
    {src : "./images/link/link6.jpg", link : "http://www.yimoe.cc"},
    {src : "./images/link/link7.jpg", link : "http://cosplay.la"},
    {src : "./images/link/link8.png", link : "http://www.kankelu.com"},
    {src : "./images/link/link9.jpg", link : "http://www.moeyinshe.com"},
    {src : "./images/link/link10.jpg", link : "http://www.kicokico.com"}
]

gili_config.Activity = {
    "少女前线" : {
                                    title : "#格里芬全面行动#",
                                    desc : "@userName@指挥官正在Gili爱参加少女前线同人支援计划，快来为喜爱的指挥官投出宝贵的食粮，为指挥官支援。听说投食还有机会免费拿本子和精美周边！~投食地址：@url@",
                                    pic : "http://www.gilieye.com/images/activity/snqx/snqx-share.jpg"
                                },
    "欧美同人" : {
                                    title : "快来参加欧美同人比赛啦",
                                    desc : "@userName@太太，正在@Gili爱 参加LET's GILI SLASH 欧美同人比赛，快来为喜爱的太太投出宝贵的一票，为太太支援。听说投票还有机会免费拿精美周边！~投票地址：@url@",
                                    pic : "http://www.gilieye.com/images/activity/omtr/omtr-share.jpg"
                                }
}

window.giliConfig = gili_config;