/**
 * JD 自动签到脚本（新版接口）
 * 支持多账号 & GitHub Actions
 */

const axios = require('axios');

const JD_COOKIE = process.env.JD_COOKIE || '';
const USER_AGENT = process.env.JD_USER_AGENT || 'Mozilla/5.0';

if (!JD_COOKIE) {
    console.log('❌ JD_COOKIE 未配置，请在仓库 Secrets 中添加');
    process.exit(1);
}

const cookies = JD_COOKIE.split('&').map(c => c.trim());

async function sign(cookie, index) {
    try {
        console.log(`🚀 开始签到账号 ${index + 1}`);
        const res = await axios.get('https://api.m.jd.com/client.action', {
            params: {
                functionId: 'signBeanIndex',
                appid: 'ld',
                client: 'ld'
            },
            headers: {
                'Cookie': cookie,
                'User-Agent': USER_AGENT
            },
            timeout: 15000
        });
        console.log('签到返回:', res.data);
    } catch (err) {
        console.log('❌ 签到失败:', err.message);
    }
}

(async () => {
    for (let i = 0; i < cookies.length; i++) {
        await sign(cookies[i], i);
    }
    console.log('🎉 所有账号签到完成！');
})();
