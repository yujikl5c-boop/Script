const axios = require('axios');

const JD_COOKIE = process.env.JD_COOKIE || '';
const USER_AGENT = process.env.JD_USER_AGENT || 'Mozilla/5.0';

async function sign() {
  if (!JD_COOKIE) {
    console.log('❌ JD_COOKIE 未配置，请在 Secrets 中添加');
    return;
  }

  console.log('开始签到...');
  const cookies = JD_COOKIE.split('&').map(c => c.trim());
  for (const cookie of cookies) {
    try {
      const res = await axios.get(
        'https://api.m.jd.com/client.action?functionId=signBeanIndex',
        { headers: { Cookie: cookie, 'User-Agent': USER_AGENT } }
      );
      console.log('签到返回:', res.data);
    } catch (err) {
      console.log('❌ 签到失败:', err.message);
    }
  }
  console.log('签到完成！');
}

sign();
