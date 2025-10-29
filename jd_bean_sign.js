/**
 * JD 自动签到脚本（新版接口 + 自动重试）
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
    const maxRetry = 3; // 最大重试次数
    for (let attempt = 1; attempt <= maxRetry; attempt++) {
        try {
            console.log(`🚀 开始签到账号 ${index + 1}, 尝试 ${attempt}`);
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

            if (res.data.errorCode === 'DG-9999') {
                throw new Error('系统异常 DG-9999，准备重试...');
            }

            console.log('✅ 签到返回:', res.data);
            break; // 成功退出重试循环
        } catch (err) {
            console.log('❌ 签到失败:', err.message);
            if (attempt < maxRetry) {
                console.log('⏳ 等待 10 秒后重试...');
                await new Promise(r => setTimeout(r, 10000));
            } else {
                console.log('⚠️ 已达最大重试次数，跳过该账号');
            }
        }
    }
}

(async () => {
    console.log('📌 JD 自动签到开始...');
    for (let i = 0; i < cookies.length; i++) {
        await sign(cookies[i], i);
    }
    console.log('🎉 所有账号签到完成！');
})();
