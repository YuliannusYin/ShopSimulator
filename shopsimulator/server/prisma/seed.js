import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {

  await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: '$2a$10$Vn2RhkFqi6QcPxUpP1LqR.gFNxHwUC5/JyZCZhjTtJ9xyRweY3zeC',
      role: 'admin',
      balance: 999999,
    },
  })
  await prisma.user.upsert({
    where: { username: 'buyer01' },
    update: {},
    create: {
      username: 'buyer01',
      password: '$2a$10$I.A9kvVTJAyoEqPVnqDqH.TFx5gC75zqPP6jJoGlSSlZzHkYF71/y',
      role: 'user',
      balance: 144767999,
    },
  })
  await prisma.user.upsert({
    where: { username: 'merchant01' },
    update: {},
    create: {
      username: 'merchant01',
      password: '$2a$10$0KW.2eiL3n4n3OmxkO8gXukDG8EUuRsMX2BcuKAKF1aoH5NuAKnXK',
      role: 'merchant',
      balance: 42952000,
    },
  })
  await prisma.user.upsert({
    where: { username: 'merchant02' },
    update: {},
    create: {
      username: 'merchant02',
      password: '$2a$10$eCM8kF6leClCZ3hVuRCPFeQvjXWtNe0AVOYn7rHEgApg1cJ9Wq4Pm',
      role: 'merchant',
      balance: 88280000,
    },
  })
  await prisma.user.upsert({
    where: { username: 'merchant03' },
    update: {},
    create: {
      username: 'merchant03',
      password: '$2a$10$rghQoGREqU6/A2InskzNs.W8p13G/noBpO.S6VcMAM.f2eXOddG9.',
      role: 'merchant',
      balance: 35000000,
    },
  })

  await prisma.shop.upsert({
    where: { id: 1 },
    update: {},
    create: {
      merchantId: 1001,
      shopName: '法拉利（ferrari）旗舰店',
      description: '承袭意大利百年超跑造车匠心，汇聚兰博基尼全系主流旗舰、性能猛兽与全球限量典藏车型。专注超跑美学展示、品牌文化传播、高端车型定制咨询、线下实车品鉴预约服务。以硬核机械设计诠释速度美学，以手工精工演绎奢华格调，为超跑爱好者、收藏玩家、高端车迷打造专属交流鉴赏殿堂，提供车型深度解读、私人品鉴对接、限量款资讯同步等专属权益，邂逅每一台承载传奇底蕴的兰博基尼臻品座驾。\n官网：https://www.ferrari.com',
      createdAt: new Date('2026-05-07T01:46:25.646Z'),
    },
  })

  await prisma.shop.upsert({
    where: { id: 2 },
    update: {},
    create: {
      merchantId: 1002,
      shopName: '兰博基尼 (Lamborghini)旗舰店',
      description: '承袭意大利百年超跑造车匠心，汇聚兰博基尼全系主流旗舰、性能猛兽与全球限量典藏车型。专注超跑美学展示、品牌文化传播、高端车型定制咨询、线下实车品鉴预约服务。以硬核机械设计诠释速度美学，以手工精工演绎奢华格调，为超跑爱好者、收藏玩家、高端车迷打造专属交流鉴赏殿堂，提供车型深度解读、私人品鉴对接、限量款资讯同步等专属权益，邂逅每一台承载传奇底蕴的兰博基尼臻品座驾。\n官网：https://www.lamborghini.com/',
      createdAt: new Date('2026-05-07T06:57:56.168Z'),
    },
  })

  await prisma.shop.upsert({
    where: { id: 3 },
    update: {},
    create: {
      merchantId: 1003,
      shopName: '劳斯莱斯（Rolls-Royce）旗舰店',
      description: '承袭英国百年超豪华汽车匠心，汇聚劳斯莱斯全系顶级座驾、限量典藏车型与定制臻品。以 “至臻完美” 为品牌理念，专注超豪华汽车文化传播、专属定制咨询、高端尊享服务与线下品鉴预约。从幻影的极致奢华到闪灵的未来科技，每一台座驾均由工匠手工打造，诠释 “轮上宫殿” 的传世格调。为社会精英、藏家与品牌拥趸提供专属品鉴对接、定制方案解读、限量款资讯同步等专属权益，邂逅每一台承载英伦贵族底蕴的劳斯莱斯臻品座驾。',
      createdAt: new Date('2026-05-07T07:26:07.973Z'),
    },
  })

  await prisma.product.upsert({
    where: { id: 1 },
    update: {},
    create: {
      shopId: 1,
      productName: '法拉利 Purosangue',
      description: '跃马品牌首款突破传统的 FUV（法拉利多功能跑车），以 “纯种马” 为名，搭载 6.5L V12 自吸引擎，725 马力 + 3.3 秒破百。对开门设计兼顾超跑性能与四座实用性，是稀缺收藏级的全能跃马。',
      price: 4988000,
      imageUrl: 'https://carconfigurator.ferrari.cn/rt-assets/data/cars/purosangue/ui/splashpage.jpg',
      status: 'active',
      createdAt: new Date('2026-05-07T01:46:25.722Z'),
    },
  })

  await prisma.product.upsert({
    where: { id: 2 },
    update: {},
    create: {
      shopId: 1,
      productName: '法拉利 Amalfi',
      description: '以阿马尔菲海岸为名的意式 GT 跑车，作为 Roma 的继任车型，搭载 3.9T V8 双涡轮引擎，640 马力 + 3.3 秒破百。极简设计语言兼顾性能与日常实用性，是跃马品牌的轻奢入门之选。',
      price: 2598500,
      imageUrl: 'https://carconfigurator.ferrari.cn/rt-assets/data/cars/amalfi/ui/splashpage.jpg',
      status: 'active',
      createdAt: new Date('2026-05-07T01:46:25.753Z'),
    },
  })

  await prisma.product.upsert({
    where: { id: 3 },
    update: {},
    create: {
      shopId: 1,
      productName: '法拉利 Roma Spider',
      description: '时隔 54 年回归的软顶敞篷 GT，以 1960 年代意式优雅为灵感，搭载 3.9T V8 双涡轮引擎，620 马力 + 3.4 秒破百。软顶敞篷 13 秒即可开闭，兼顾优雅格调与日常实用性，是入门级敞篷跃马的经典之选。',
      price: 2762000,
      imageUrl: 'https://carconfigurator.ferrari.cn/rt-assets/data/cars/romaspider/ui/splashpage.jpg',
      status: 'active',
      createdAt: new Date('2026-05-07T01:46:25.777Z'),
    },
  })

  await prisma.product.upsert({
    where: { id: 4 },
    update: {},
    create: {
      shopId: 1,
      productName: '法拉利 296 Speciale',
      description: '296 系列的赛道硬顶旗舰，以 “Speciale” 之名诠释极致性能。在 GTB 基础上大幅减重、强化底盘与空力套件，动力输出优化，专为赛道驾驶而生，是跃马混动时代的赛道利器。',
      price: 3988800,
      imageUrl: 'https://carconfigurator.ferrari.cn/rt-assets/data/cars/296speciale/ui/splashpage.jpg',
      status: 'active',
      createdAt: new Date('2026-05-07T01:46:25.803Z'),
    },
  })

  await prisma.product.upsert({
    where: { id: 5 },
    update: {},
    create: {
      shopId: 1,
      productName: '法拉利 296 Speciale A',
      description: '296 系列的终极赛道敞篷版（Speciale A），在 296 GTS 基础上打造，减重 60kg 并强化空气动力学套件，动力输出优化，兼具敞篷自由与赛道级性能，专为追求极致驾驶乐趣的玩家设计。',
      price: 4398800,
      imageUrl: 'https://carconfigurator.ferrari.cn/rt-assets/data/cars/296speciale-a/ui/splashpage.jpg',
      status: 'active',
      createdAt: new Date('2026-05-07T01:46:25.829Z'),
    },
  })

  await prisma.product.upsert({
    where: { id: 6 },
    update: {},
    create: {
      shopId: 1,
      productName: '法拉利 F80',
      description: '跃马品牌 80 周年纪念限量旗舰，接替 LaFerrari 的顶级超跑。搭载 3.0T V6 混动系统，综合 1200 马力，是史上最强公路跃马，全球限量 799 台，为顶级藏家打造的终极收藏目标。',
      price: 25980000,
      imageUrl: 'https://carconfigurator.ferrari.cn/rt-assets/data/cars/f80/ui/splashpage.jpg',
      status: 'active',
      createdAt: new Date('2026-05-07T13:11:44.711Z'),
    },
  })

  await prisma.product.upsert({
    where: { id: 7 },
    update: {},
    create: {
      shopId: 1,
      productName: '法拉利 12 Cilindri Spider',
      description: 'V12 自吸绝唱的敞篷篇章，延续硬顶版 830 马力纯燃油性能，搭配可折叠敞篷系统，让高亢的 V12 声浪毫无阻隔传入座舱，是燃油时代最后的敞篷收藏级作品。',
      price: 6586800,
      imageUrl: 'https://carconfigurator.ferrari.cn/rt-assets/data/cars/12cilindrispider/ui/splashpage.jpg',
      status: 'active',
      createdAt: new Date('2026-05-08T00:09:44.257Z'),
    },
  })

  await prisma.product.upsert({
    where: { id: 8 },
    update: {},
    create: {
      shopId: 1,
      productName: '法拉利 12 Cilindri',
      description: '跃马纯燃油 V12 时代的终极礼赞，前置中置 6.5L V12 自然吸气引擎，830 马力 + 9500 转红线，无电气化干预的纯粹机械之美。硬顶 Berlinetta 设计，为懂车藏家打造的收藏级 GT 跑车。',
      price: 5988000,
      imageUrl: 'https://carconfigurator.ferrari.cn/rt-assets/data/cars/12cilindri/ui/splashpage.jpg',
      status: 'active',
      createdAt: new Date('2026-05-08T00:10:36.053Z'),
    },
  })

  await prisma.product.upsert({
    where: { id: 9 },
    update: {},
    create: {
      shopId: 1,
      productName: '法拉利 296 GTS',
      description: '296 系列的敞篷力作，继承 GTB 的 829 马力混动性能，搭配电动折叠硬顶敞篷（12 秒开闭），让赛道级性能与露天驾驶的意式浪漫完美融合，适合追求个性与性能平衡的玩家。',
      price: 3488000,
      imageUrl: 'https://carconfigurator.ferrari.cn/rt-assets/data/cars/296gts/ui/splashpage.jpg',
      status: 'active',
      createdAt: new Date('2026-05-08T00:11:27.476Z'),
    },
  })

  await prisma.product.upsert({
    where: { id: 10 },
    update: {},
    create: {
      shopId: 1,
      productName: '法拉利 296 GTB',
      description: '跃马品牌首款 V6 混动超跑硬顶版，搭载 2.9T V6 双涡轮 + 电机混动系统，综合 829 马力，零百加速 2.9 秒。作为混动时代的性能标杆，兼顾赛道激情与日常驾驶实用性，是入门级超跑的理想选择。',
      price: 2988000,
      imageUrl: 'https://carconfigurator.ferrari.cn/rt-assets/data/cars/296gtb/ui/splashpage.jpg',
      status: 'active',
      createdAt: new Date('2026-05-08T00:12:02.920Z'),
    },
  })

  await prisma.product.upsert({
    where: { id: 11 },
    update: {},
    create: {
      shopId: 1,
      productName: '法拉利 849 Testarossa Spider',
      description: '849 Testarossa 的敞篷篇章，延续硬顶版 1050 马力混动猛兽内核，搭配电动折叠硬顶敞篷（12 秒开闭），让经典性能与露天驾驶的自由感无缝衔接，专为顶级收藏玩家打造的敞篷旗舰。',
      price: 5688000,
      imageUrl: 'https://carconfigurator.ferrari.cn/rt-assets/data/cars/849testarossaspider/ui/splashpage.jpg',
      status: 'active',
      createdAt: new Date('2026-05-08T00:13:49.542Z'),
    },
  })

  await prisma.product.upsert({
    where: { id: 12 },
    update: {},
    create: {
      shopId: 1,
      productName: '法拉利 849 Testarossa',
      description: '致敬 80 年代传奇 Testarossa 的旗舰混动超跑，以 “红头引擎” 之名续写性能神话。搭载 V8 双涡轮 + 三电机混动系统，综合 1050 马力，经典侧进气口与现代空气动力学完美融合，是跃马对经典传承与未来科技的极致演绎。',
      price: 5168000,
      imageUrl: 'https://carconfigurator.ferrari.cn/rt-assets/data/cars/849testarossa/ui/splashpage.jpg',
      status: 'active',
      createdAt: new Date('2026-05-08T00:14:20.287Z'),
    },
  })

  await prisma.product.upsert({
    where: { id: 13 },
    update: {},
    create: {
      shopId: 1,
      productName: '法拉利 Amalfi Spider',
      description: '以阿马尔菲海岸为名的意式敞篷 GT，作为 Roma 继任者的敞篷力作，搭载 3.9T V8 双涡轮引擎，640 马力迸发 3.3 秒破百性能。软顶敞篷 14 秒即可开闭，兼顾南意海岸的浪漫格调与跃马性能基因，是轻奢入门级敞篷超跑的首选。',
      price: 2988000,
      imageUrl: 'https://carconfigurator.ferrari.cn/rt-assets/data/cars/amalfispider/ui/splashpage.jpg',
      status: 'active',
      createdAt: new Date('2026-05-08T00:15:34.451Z'),
    },
  })

  await prisma.product.upsert({
    where: { id: 14 },
    update: {},
    create: {
      shopId: 2,
      productName: '兰博基尼 Revuelto',
      description: '品牌新一代 V12 混动旗舰，接替 Aventador 的里程碑车型。搭载 6.5L V12 + 三电机混动系统，综合 1015 马力，零百加速 2.5 秒，是兰博基尼 V12 时代的电气化终极演绎，也是品牌量产超跑的性能新标杆。',
      price: 6980000,
      imageUrl: 'https://www.lamborghini.com/sites/it-en/files/DAM/lamborghini/0_facelift_2025/model_details_new/revuelto_2/27_03_2026/Revuelto_02-Exterior-H_Chapter-Main_Still-B_Config-Alt-C-last-optim.jpg',
      status: 'active',
      createdAt: new Date('2026-05-07T07:17:16.061Z'),
    },
  })

  await prisma.product.upsert({
    where: { id: 15 },
    update: {},
    create: {
      shopId: 2,
      productName: '兰博基尼 Urus SE',
      description: '品牌首款插电混动 SUV，搭载 V8 + 电机混动系统，综合马力超 800 匹，兼顾更强动力与更低油耗。保留 Urus 的运动基因，以电气化升级开启兰博基尼 SUV 的新时代，是兼顾性能与环保的全能座驾',
      price: 3580000,
      imageUrl: 'https://www.lamborghini.com/sites/it-en/files/DAM/lamborghini/0_facelift_2025/model_details_new/urus_se_2/27_03_2026/Urus_02-Exterior-H_Chapter-Main_Still-B_Config-Alt-B-last-optim.jpg',
      status: 'active',
      createdAt: new Date('2026-05-07T07:18:10.995Z'),
    },
  })

  await prisma.product.upsert({
    where: { id: 16 },
    update: {},
    create: {
      shopId: 2,
      productName: '兰博基尼 Urus Performante',
      description: '品牌高性能运动 SUV 旗舰，搭载 4.0T V8 双涡轮引擎，666 马力，零百加速 3.3 秒。强化运动化底盘与空气动力学套件，兼具超跑级操控与 SUV 实用性，是高性能豪华 SUV 领域的性能猛兽。',
      price: 3980000,
      imageUrl: 'https://w.wallhaven.cc/full/5w/wallhaven-5w2e65.jpg',
      status: 'active',
      createdAt: new Date('2026-05-07T07:19:32.246Z'),
    },
  })

  await prisma.product.upsert({
    where: { id: 17 },
    update: {},
    create: {
      shopId: 2,
      productName: '兰博基尼 Huracán Tecnica​',
      description: '介于 EVO 与 STO 之间的公路性能版 Huracán，搭载 5.2L V10 自然吸气引擎，640 马力，零百加速 3.2 秒。兼顾赛道性能与日常驾驶实用性，以均衡的操控表现成为 V10 自吸时代的标杆级公路超跑。',
      price: 3180000,
      imageUrl: 'https://w.wallhaven.cc/full/wy/wallhaven-wy1zqq.jpg',
      status: 'active',
      createdAt: new Date('2026-05-07T07:21:02.893Z'),
    },
  })

  await prisma.product.upsert({
    where: { id: 18 },
    update: {},
    create: {
      shopId: 2,
      productName: '兰博基尼 Temerar​io',
      description: '品牌全新混动 V8 超跑，作为 Huracán 的继任车型，搭载 4.0T V8 双涡轮 + 混动系统，综合马力超 900 匹，以轻量化设计与赛道级操控，开启兰博基尼混动时代的新篇章，是兼顾性能与日常的新生代超跑。',
      price: 4580000,
      imageUrl: 'https://www.lamborghini.com/sites/it-en/files/DAM/lamborghini/0_facelift_2025/model_details/temerario/2025/07_29_refresh/gallery4-desktop.jpg',
      status: 'active',
      createdAt: new Date('2026-05-07T07:15:43.780Z'),
    },
  })

  await prisma.product.upsert({
    where: { id: 19 },
    update: {},
    create: {
      shopId: 2,
      productName: '兰博基尼 Fenomeno​',
      description: '品牌全新概念旗舰超跑，以 “现象级” 性能定义未来超跑标准，搭载品牌最新混动系统，综合马力突破千匹，采用激进空气动力学设计与未来感座舱，是兰博基尼对下一代超跑的前瞻性演绎。',
      price: 8980000,
      imageUrl: 'https://th.wallhaven.cc/small/d8/d8pdxg.jpg',
      status: 'active',
      createdAt: new Date('2026-05-08T01:04:23.536Z'),
    },
  })

  await prisma.product.upsert({
    where: { id: 20 },
    update: {},
    create: {
      shopId: 2,
      productName: '兰博基尼 Countach LPI​ ​800-​4',
      description: '致敬经典 Countach 的限量复刻超跑，全球仅 112 台，搭载 V12+48V 轻混系统，综合 814 马力，零百加速 2.8 秒。复刻楔形车身设计，以现代科技重现 70 年代传奇超跑的锋芒，是情怀与性能兼具的收藏之作。',
      price: 9800000,
      imageUrl: 'https://www.lamborghini.com/sites/it-en/files/DAM/lamborghini/0_facelift_2025/model_details/countach-lpi-800-4/gallery1-desktop.jpg',
      status: 'active',
      createdAt: new Date('2026-05-08T01:24:36.001Z'),
    },
  })

  await prisma.product.upsert({
    where: { id: 21 },
    update: {},
    create: {
      shopId: 2,
      productName: '兰博基尼 Sián Roadster',
      description: 'Sián 的敞篷限量版，全球仅 19 台，延续硬顶版 V12 + 超级电容混动系统的 819 马力性能，搭配可开启敞篷设计，让混动猛兽的声浪与露天驾驶的极致体验完美结合，是稀缺收藏级敞篷混动超跑。',
      price: 23800000,
      imageUrl: 'https://www.lamborghini.com/sites/it-en/files/DAM/lamborghini/0_facelift_2025/model_details/sian_roadster/gallery1-desktop.jpg',
      status: 'active',
      createdAt: new Date('2026-05-08T01:30:03.669Z'),
    },
  })

  await prisma.product.upsert({
    where: { id: 22 },
    update: {},
    create: {
      shopId: 2,
      productName: '兰博基尼 Sián F​KP ​37',
      description: '品牌首款混动限量超跑，致敬大众集团前董事长费迪南德・皮耶希，全球仅 63 台。搭载 V12 + 超级电容混动系统，综合 819 马力，零百加速 2.8 秒，是兰博基尼向电气化转型的里程碑式作品。',
      price: 20800000,
      imageUrl: 'https://www.lamborghini.com/sites/it-en/files/DAM/lamborghini/0_facelift_2025/model_details/sian-fkp-37/gallery5-desktop.jpg',
      status: 'active',
      createdAt: new Date('2026-05-08T01:31:24.074Z'),
    },
  })

  await prisma.product.upsert({
    where: { id: 23 },
    update: {},
    create: {
      shopId: 2,
      productName: '兰博基尼 Sesto Elemen​to​',
      description: '以第六元素为名的赛道级限量超跑，全球仅 20 台，全车 90% 以上采用碳纤维打造，车重不足 1 吨。搭载 5.2L V10 引擎，570 马力，零百加速仅 2.5 秒，是专为赛道而生的纯机械性能猛兽，收藏价值无可估量。',
      price: 28000000,
      imageUrl: 'https://w.wallhaven.cc/full/72/wallhaven-72my2y.jpg',
      status: 'active',
      createdAt: new Date('2026-05-08T01:45:04.588Z'),
    },
  })

  await prisma.product.upsert({
    where: { id: 24 },
    update: {},
    create: {
      shopId: 2,
      productName: '兰博基尼 Centenar​io',
      description: '百年纪念硬顶限量版，全球仅 20 台，是品牌致敬创始人的巅峰之作。搭载 770 马力 V12 引擎，零百加速 2.8 秒，以极致轻量化与赛道级性能，成为收藏市场中不可复制的传奇硬顶超跑。',
      price: 19800000,
      imageUrl: 'https://w.wallhaven.cc/full/ym/wallhaven-ymgmjx.jpg',
      status: 'active',
      createdAt: new Date('2026-05-08T01:51:27.093Z'),
    },
  })

  await prisma.product.upsert({
    where: { id: 25 },
    update: {},
    create: {
      shopId: 2,
      productName: '兰博基尼 Centenario Roadster',
      description: '兰博基尼为纪念品牌创始人费鲁吉欧・兰博基尼诞辰 100 周年打造的敞篷限量旗舰，全球仅 20 台。搭载 6.5L V12 自然吸气引擎，770 马力迸发 2.9 秒破百性能，全碳车身设计与激进空气动力学，是收藏级敞篷超跑的巅峰之作。',
      price: 21800000,
      imageUrl: 'https://w.wallhaven.cc/full/z8/wallhaven-z8jloo.jpg',
      status: 'active',
      createdAt: new Date('2026-05-08T01:52:44.880Z'),
    },
  })

  await prisma.product.upsert({
    where: { id: 26 },
    update: {},
    create: {
      shopId: 2,
      productName: '兰博基尼 Veneno',
      description: '兰博基尼品牌50 周年纪念硬顶限量旗舰，全球仅 3 台，是品牌限量系列的巅峰硬顶之作。基于 Aventador 平台打造，搭载 6.5L V12 自然吸气引擎，750 马力迸发 2.8 秒破百性能，最高时速 355km/h。以战斗机为灵感的激进空气动力学设计、全碳纤维车身与赛道级调校，让它成为超跑收藏界的 “天花板” 级硬顶臻品，稀缺性与收藏价值无可估量。',
      price: 36800000,
      imageUrl: 'https://w.wallhaven.cc/full/yj/wallhaven-yj71j7.jpg',
      status: 'active',
      createdAt: new Date('2026-05-08T02:42:30.645Z'),
    },
  })

  await prisma.product.upsert({
    where: { id: 27 },
    update: {},
    create: {
      shopId: 2,
      productName: '兰博基尼 Veneno Roadster',
      description: '为纪念品牌 50 周年打造的敞篷限量超跑，全球仅 9 台，是兰博基尼限量系列的 “天花板” 之作。搭载 6.5L V12 自然吸气引擎，750 马力迸发 2.8 秒破百性能，无顶敞篷设计搭配全碳空气动力学套件，以极致轻量化与赛道级性能，成为超跑收藏界的传奇臻品。',
      price: 29800000,
      imageUrl: 'https://w.wallhaven.cc/full/4l/wallhaven-4lqkdy.jpg',
      status: 'active',
      createdAt: new Date('2026-05-08T02:43:29.466Z'),
    },
  })

  await prisma.product.upsert({
    where: { id: 28 },
    update: {},
    create: {
      shopId: 2,
      productName: '兰博基尼 Reventon',
      description: '兰博基尼限量系列的开山之作，硬顶版全球仅 20 台，设计灵感源自 F-22 战斗机。搭载 6.5L V12 引擎，650 马力 + 3.4 秒破百性能，以全碳车身与激进空气动力学，成为品牌限量收藏文化的起点，是超跑收藏市场中不可复制的里程碑车型。',
      price: 14800000,
      imageUrl: 'https://www.lamborghini.com/sites/it-en/files/DAM/lamborghini/masterpieces/reventon/reventon-HEADER.jpg',
      status: 'active',
      createdAt: new Date('2026-05-08T02:56:13.190Z'),
    },
  })

  await prisma.product.upsert({
    where: { id: 29 },
    update: {},
    create: {
      shopId: 2,
      productName: '兰博基尼 Reventon Roadster',
      description: '战斗机设计语言的敞篷限量超跑，全球仅 15 台，是 Reventon 系列的终极敞篷篇章。搭载 6.5L V12 自然吸气引擎，670 马力迸发 3.4 秒破百性能，全碳车身与航空级座舱设计，是兰博基尼限量收藏系列的传奇敞篷之作。',
      price: 16800000,
      imageUrl: 'https://www.lamborghini.com/sites/it-en/files/DAM/lamborghini/masterpieces/reventon-roadster/reventon-roadster.jpg',
      status: 'active',
      createdAt: new Date('2026-05-08T02:59:13.881Z'),
    },
  })

  await prisma.product.upsert({
    where: { id: 30 },
    update: {},
    create: {
      shopId: 2,
      productName: 'TERZO MILLENNIO（兰博基尼）',
      description: '兰博基尼与麻省理工学院（MIT）联合研发的未来电动超跑概念车，以 “第三千年” 为名，探索下一代超跑技术。搭载四轮独立电机 + 超级电容系统，采用碳纤维自愈材料，以颠覆性设计与前瞻性科技，定义电动超跑的未来形态，是品牌面向千禧年的里程碑式概念作品。',
      price: 8880000,
      imageUrl: 'https://www.lamborghini.com/sites/it-en/files/DAM/lamborghini/0_facelift_2025/model_details/concept/terzo_millennio/hero/hero1-desktop.jpg',
      status: 'active',
      createdAt: new Date('2026-05-08T03:02:34.891Z'),
    },
  })

  await prisma.product.upsert({
    where: { id: 31 },
    update: {},
    create: {
      shopId: 2,
      productName: '兰博基尼 Estoque​',
      description: '2008 年巴黎车展首发的四门超跑概念车，也是兰博基尼历史上唯一一款四门 GT 超跑原型。以斗牛士佩剑 “Estoque” 命名，搭载 V10 引擎，融合品牌超跑性能基因与四门轿车的实用性，是兰博基尼对多元化生活方式的先锋探索，也是收藏市场中极具稀缺性的未量产概念臻品。',
      price: 3280000,
      imageUrl: 'https://w.wallhaven.cc/full/47/wallhaven-47xkzy.jpg',
      status: 'active',
      createdAt: new Date('2026-05-08T03:08:30.390Z'),
    },
  })

  await prisma.product.upsert({
    where: { id: 32 },
    update: {},
    create: {
      shopId: 3,
      productName: '劳斯莱斯 黑标版',
      description: 'Rolls-Royce Black Badge：劳斯莱斯 Black Badge 暗黑定制系列，专为追求个性与性能的客户打造。覆盖全系车型的黑化外观、专属定制内饰与强化调校的动力系统，以暗夜风格诠释品牌的另一面，兼具奢华格调与运动性能，是超豪华汽车领域的个性臻选。',
      price: 7800000,
      imageUrl: 'https://www.rolls-roycemotorcars.com.cn/content/dam/rrmc/marketUK/rollsroycemotorcars_com/3-7-black-badge/components/bbspectre-discover-components/D-F-TRACK-3-4-BB-DISCOVER.jpg/jcr:content/renditions/cq5dam.web.2880.webp',
      status: 'active',
      createdAt: new Date('2026-05-08T04:09:41.055Z'),
    },
  })

  await prisma.product.upsert({
    where: { id: 33 },
    update: {},
    create: {
      shopId: 3,
      productName: '劳斯莱斯 库里南',
      description: 'Rolls-Royce Cullinan：劳斯莱斯品牌首款全地形超豪华 SUV，以 “库里南钻石” 为名。搭载 6.75L V12 双涡轮增压引擎，571 马力，配备全时四驱系统，兼具顶级奢华与全地形通过能力，是可以征服任何路况的 “移动城堡”，也是社会精英的全能座驾之选。',
      price: 6910000,
      imageUrl: 'https://gsat.jp/wp-content/uploads/2024/09/Cullinan-Model-Year-20247.jpg',
      status: 'active',
      createdAt: new Date('2026-05-08T04:23:12.070Z'),
    },
  })

  await prisma.product.upsert({
    where: { id: 34 },
    update: {},
    create: {
      shopId: 3,
      productName: '劳斯莱斯 古斯特 EX',
      description: 'Rolls-Royce Ghost Extended：古斯特加长轴距版本，轴距加长 170mm，打造更宽敞的后排尊享空间。延续标准版的 V12 引擎与奢华配置，搭配加长车身与专属后排行政级设计，平衡驾驶体验与商务尊享，是兼顾日常与商务场景的超豪华座驾。',
      price: 5700000,
      imageUrl: 'https://www.europeanprestige.co.uk/blobs/stock/547/images/1695b8d3-ffbe-4f64-b669-de012126d528/hi4a7681.jpg?width=2000&height=1333',
      status: 'active',
      createdAt: new Date('2026-05-08T04:26:13.951Z'),
    },
  })

  await prisma.product.upsert({
    where: { id: 35 },
    update: {},
    create: {
      shopId: 3,
      productName: '劳斯莱斯 古斯特',
      description: 'Rolls-Royce Ghost：品牌入门级超豪华轿车，专为年轻精英打造。搭载 6.75L V12 双涡轮增压引擎，571 马力，在传承品牌奢华基因的同时，兼顾更灵动的驾驶体验与更年轻化的设计语言，是踏入劳斯莱斯世界的理想之选。',
      price: 5000000,
      imageUrl: 'https://www.rolls-roycemotorcars.com.cn/content/dam/rrmc/marketUK/rollsroycemotorcars_com/bb-ghost-sii/page-properties/TILE-BBGSII-INDETAIL-SINGLE-1_1.jpg/jcr:content/renditions/cq5dam.web.1920.webp',
      status: 'active',
      createdAt: new Date('2026-05-08T04:33:46.328Z'),
    },
  })

  await prisma.product.upsert({
    where: { id: 36 },
    update: {},
    create: {
      shopId: 3,
      productName: '劳斯莱斯 闪灵',
      description: 'Rolls-Royce Spectre：劳斯莱斯品牌首款纯电动超豪华轿跑，开启品牌电气化时代。搭载双电机四驱系统，综合功率 430kW，零百加速 4.5 秒，延续品牌标志性的静谧性与手工奢华，以电动科技诠释英伦奢华的未来形态，是新时代超豪华电动座驾的标杆。',
      price: 5750000,
      imageUrl: 'https://www.rolls-roycemotorcars.com.cn/content/dam/rrmc/marketUK/rollsroycemotorcars_com/spectre-discover/page-components/comp-update-dec-24/D-HERO-SPECTRE-DISCOVER%20(1).jpg/jcr:content/renditions/cq5dam.web.2880.webp',
      status: 'active',
      createdAt: new Date('2026-05-08T04:38:47.971Z'),
    },
  })

  await prisma.product.upsert({
    where: { id: 37 },
    update: {},
    create: {
      shopId: 3,
      productName: '劳斯莱斯 幻影 EX',
      description: 'Rolls-Royce Phantom Extended：幻影加长轴距版本，轴距较标准版加长 200mm，打造媲美私人飞机的后排尊享空间。延续幻影的 V12 引擎与殿堂级奢华配置，搭配专属后排行政套件与星空顶，专为顶级客户定制，重新定义超豪华轿车的尊享体验。',
      price: 9200000,
      imageUrl: 'https://www.rolls-roycemotorcars.com.cn/content/dam/rrmc/marketUK/rollsroycemotorcars_com/phantom-100/page-components/phantom-ext/phantom-ext-discover/D-HERO-01-PEXT100-DISC.jpg/jcr:content/renditions/cq5dam.web.2880.webp',
      status: 'active',
      createdAt: new Date('2026-05-08T04:53:16.394Z'),
    },
  })

  await prisma.product.upsert({
    where: { id: 38 },
    update: {},
    create: {
      shopId: 3,
      productName: '劳斯莱斯 幻影',
      description: 'Rolls-Royce Phantom：劳斯莱斯品牌旗舰超豪华轿车，被誉为 “轮上的宫殿”。搭载 6.75L V12 双涡轮增压引擎，571 马力迸发极致平顺动力，以手工打造的殿堂级内饰、近乎零噪音的静谧性与专属定制服务，诠释英伦顶级奢华的巅峰标准，是政商名流的终极座驾之选。',
      price: 7900000,
      imageUrl: 'https://th.wallhaven.cc/small/0j/0jkxm4.jpg',
      status: 'active',
      createdAt: new Date('2026-05-08T04:53:58.184Z'),
    },
  })

  console.log('Seed data imported successfully')
  console.log('Users: 5')
  console.log('Shops: 3')
  console.log('Products: 38')
  console.log('Orders: 0')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
