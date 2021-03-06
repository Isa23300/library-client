const bcrypt = require('bcryptjs')
const pool = require('../../core/db')
const { ParameterException, NotFound, AuthFailed } = require('../../core/httpException')
const { prepareParm } = require('../../core/util')

/**
 * 验证用户是否存在
 * @param {*} id 学/工号
 */
const verifyUserId = async (id) => {
    const queryStr = `SELECT * FROM user WHERE id = ${id}`;
    const user = await pool.query(queryStr);
    if(!user.length) {
        return false;
    }else {
        return user;
    }
}

/**
 * 验证账号密码
 * @param {*} param {id, passwd}
 */
const verifyAccount = async (param) => {
    const user = await verifyUserId(param.id);
    if(!user) {
        throw new NotFound('账号不存在')
    }
    if(user[0].status !== 1) {
        throw new AuthFailed('该账号当前不可用')
    }
    const correct = bcrypt.compareSync(param.passwd, user[0].passwd)
    if (!correct) {
        throw new AuthFailed('密码不正确')
    }
    return user[0]
}

/**
 * 获取用户信息
 * @param {*} id
 */
const getUserInfo = async (id) => {
    const queryStr = 'CALL GET_USER_INFO_BY_ID(?)'
    const info = await pool.query(queryStr, [id])
    if(!info.length) {
        throw new AuthFailed('该账号当前不可用')
    }
    return info[0][0]
}

/**
 * 新增用户
 * @param {*} user 
 */
const addUser = async (user) => {
    // 0. 验证学号唯一，班级/学院编号存在
    if (await verifyUserId(user.id)) {
        throw new ParameterException('账号已存在');
    }
    const queryClass = `
                        SELECT *
                        FROM bm_college
                        LEFT JOIN bm_class
                        ON bm_college.id = bm_class.college_id
                        WHERE bm_class.id = ${user.class_id} AND bm_college.id = ${user.college_id}
                       `
    const group = await pool.query(queryClass);
    if(!group.length) {
        throw new ParameterException('所属班级/学院编码不存在');
    }

    // 1. 获取该类账号的有效期
    const queryStr = `SELECT default_valid_time AS time FROM identity WHERE id = ${user.identity_id}`;
    const period = await pool.query(queryStr);
    if(!period.length) {
        throw new ParameterException('该身份类型不存在');
    }

    // 2. 计算推得该账号的有效期
    const valid_start_date = new Date().toLocaleDateString();
    let valid_end_date = new Date()
    valid_end_date.setFullYear(new Date().getFullYear() + period[0].time);
    valid_end_date = valid_end_date.toLocaleDateString();

    // 3. 补充部分字段，用户默认为普通用户，激活状态，此处不添加
    user['valid_end_date'] = valid_end_date;
    user['valid_start_date'] = valid_start_date;

    // 4. 密码加密
    const salt = bcrypt.genSaltSync(10)
    user['passwd'] = bcrypt.hashSync(user.passwd, salt)

    // 5. 新建用户
    const fieldList = [];
    const valList = [];
    prepareParm(user, fieldList, valList, []);
    const insertStr = `insert into user (${fieldList.join(',')}) values(${valList.join(',')})`;
    await pool.query(insertStr);

    console.log(`成功创建用户：${user.id} ${user.name}`)
}

module.exports = {
    addUser,
    verifyAccount,
    getUserInfo
}