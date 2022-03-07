/*
* @Author: LiYu
* @Date: 2022-03-05 22:08:07
 * @LastEditors: LiYu
 * @LastEditTime: 2022-03-07 20:44:23
* @Description: 表单校验类
*/

/**
 * @description: 
 * @param {Object} rules 必填 校验规则
 * @param {Object} form 必填 校验对象
 * @return {*}
 */
export default class Validator {
  static pattern = {
    // Email地址
    email: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
    // 手机号码
    phone: /^(13[0-9]|14[5|7]|15[0|1|2|3|4|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/,
    // InternetURL
    url: /[a-zA-z]+:\/\/[^\s]*/,
    // 电话号码("XXX-XXXXXXX"、"XXXX-XXXXXXXX"、"XXX-XXXXXXX"、"XXX-XXXXXXXX"、"XXXXXXX"和"XXXXXXXX)
    tel: /^((\d{3,4}-)|\d{3.4}-)?\d{7,8}$/,
    // 汉字
    chinese: /^[\u4e00-\u9fa5]{0,}$/,
    // 身份证号(15位、18位数字)，最后一位是校验位，可能为数字或字符X
    idCard: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
    // IPv4地址
    ip: /((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}/,
    // 中国邮政编码
    postalCode: /[1-9]\d{5}(?!\d)/
  };

  // type取值
  static types = ['string', 'number', 'boolean', 'function', 'float', 'integer', 'array', 'object', 'date', 'regexp'];

  rules = {};
  form = {};

  constructor(rules, form) {
    if (!Validator.isObject(rules)) {
      throw new Error('Rules must be an object');
    }
    if (!Validator.isObject(form)) {
      throw new Error('Form must be an object');
    }
    this.rules = rules;
    this.form = form;
    Object.keys(rules).forEach(name => {
      const item = rules[name];
      this.rules[name] = Array.isArray(item) ? item : [item];
    });
  }


  /**
   * @description: 校验所有rules中字段
   * @return {Promise}
   */
  validate() {
    const { rules, form } = this;
    const tasks = Object.keys(rules).map(field => {
      return new Promise(async (resolve, reject) => {
        const currentRules = rules[field];
        for (let i = 0, len = currentRules.length; i < len; i++) {
          const rule = currentRules[i];
          const { required, type, pattern } = rule;
          const { oneOf, isEmpty, capitalize, isRegexp, isFunction } = Validator;
          // 验证器集合
          const validators = [
            required ? value => !isEmpty(value) : null,
            oneOf(type, Validator.types) ? value => {
              return Validator[`is${capitalize(type)}`](value);
            } : null,
            isRegexp(pattern) ? value => pattern.test(value) : null,
            isFunction(rule.validator) ? rule.validator : null
          ].filter(item => item);

          for (const validator of validators) {
            try {
              const result = await validator(form[field]);
              if (!result) {
                return reject({ field, rule });
              }
            } catch (errMsg) {
              return reject({
                field,
                rule: {
                  ...rule,
                  message: errMsg || rule.message
                },
              });
            }
          }
        }
        return resolve();
      })
    })
    return new Promise(async (resolve, reject) => {
      const validateResult = await Promise.allSettled(tasks);
      const errors = validateResult.filter(item => item.status === 'rejected');
      if (errors.length) {
        const errorsMap = {};
        errors.forEach(err => {
          errorsMap[err.reason.field] = err.reason.rule;
        })
        reject(errorsMap);
      } else {
        resolve();
      }
    })
  }

  /**
   * @description: 校验指定字段
   * @param {String} filed 要校验的字段
   * @return {Promise}
   */
  validateFields(filed) {

  }


  /**
   * @description: 首字符转大写
   * @param {String} str
   * @return {String}
   */
  static capitalize(str) {
    if (!Validator.isString(str)) {
      throw new Error('Parameter must be of string type');
    }
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  /**
   * @description: 
   * @param {*} value
   * @param {*} validList
   * @return {*}
   */
  static oneOf(value, validList) {
    for (let i = 0; i < validList.length; i++) {
      if (value === validList[i]) {
        return true;
      }
    }
    return false;
  }

  /**
   * @description: 是否为空
   * @param {*} value
   * @return {Boolean}
   */
  static isEmpty(value) {
    return value === '' || value === null || value === undefined;
  }

  /**
   * @description: 是否字符串
   * @param {*} value
   * @return {Boolean}
   */
  static isString(value) {
    return typeof value === 'string';
  }

  /**
   * @description: 是否数字（NaN除外，但不排除Infinity）
   * @param {*} value
   * @return {Boolean}
   */
  static isNumber(value) {
    return typeof value === 'number' && !isNaN(value);
  }

  /**
   * @description: 是否布尔
   * @param {*} value
   * @return {Boolean}
   */
  static isBoolean(value) {
    return typeof value === 'boolean';
  }

  /**
   * @description: 是否函数
   * @param {*} value
   * @return {Boolean}
   */
  static isFunction(value) {
    return typeof value === 'function';
  }

  /**
   * @description: 是否正则
   * @param {*} value
   * @return {Boolean}
   */
  static isRegexp(value) {
    if (value instanceof RegExp) {
      return true;
    }
    return false;
  }

  /**
   * @description: 是否整数
   * @param {*} value
   * @return {Boolean}
   */
  static isInteger(value) {
    return Validator.number(value) && parseInt(value, 10) === value;
  }

  /**
   * @description: 是否浮点小数
   * @param {*} value
   * @return {Boolean}
   */
  static isFloat(value) {
    return Validator.number(value) && !Validator.integer(value);
  }

  /**
   * @description: 是否数组
   * @param {*} value
   * @return {Boolean}
   */
  static isArray(value) {
    return Array.isArray(value);
  }

  /**
   * @description: 是否对象
   * @param {*} value
   * @return {Boolean}
   */
  static isObject(value) {
    return typeof value === 'object' && !Validator.isArray(value);
  }

  /**
   * @description: 是否日期对象
   * @param {*} value
   * @return {Boolean}
   */
  static isDate(value) {
    return (
      typeof value.getTime === 'function' &&
      typeof value.getMonth === 'function' &&
      typeof value.getYear === 'function' &&
      !isNaN(value.getTime())
    );
  }

  /**
   * @description: 是否有效的日期字符串
   * @param {*} value
   * @return {Boolean}
   */
  static isValidDate(value) {
    return isNaN(value) && !isNaN(Date.parse(value));
  }

  /**
   * @description: 是否URL
   * @param {*} value
   * @return {Boolean}
   */
  static isUrl(value) {
    return (
      typeof value === 'string' &&
      value.length <= 2048 &&
      Validator.pattern.url.test(value)
    );
  }

  /**
   * @description: 是否手机号码
   * @param {*} value
   * @return {Boolean}
   */
  static isPhone(value) {
    return Validator.pattern.phone.test(value);
  }

  /**
   * @description: 是否电话号码
   * @param {*} value
   * @return {Boolean}
   */
  static isTel(value) {
    return Validator.pattern.tel.test(value);
  }

  /**
   * @description: 是否邮箱
   * @param {*} value
   * @return {Boolean}
   */
  static isEmail(value) {
    return Validator.pattern.email.test(value);
  }

  /**
   * @description: 是否汉字
   * @param {*} value
   * @return {Boolean}
   */
  static isChinese(value) {
    return Validator.pattern.chinese.test(value);
  }

  /**
   * @description: 是否身份证
   * @param {*} value
   * @return {Boolean}
   */
  static isIdCard(value) {
    return Validator.pattern.idCard.test(value);
  }

  /**
   * @description: 是否IPv4
   * @param {*} value
   * @return {Boolean}
   */
  static isIp(value) {
    return Validator.pattern.ip.test(value);
  }

  /**
   * @description: 是否邮政编码
   * @param {*} value
   * @return {Boolean}
   */
  static isPostalCode(value) {
    return Validator.pattern.postalCode.test(value);
  }

}