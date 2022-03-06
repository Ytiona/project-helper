/*
 * @Author: LiYu
 * @Date: 2022-03-05 22:08:07
 * @LastEditors: LiYu
 * @LastEditTime: 2022-03-06 22:16:53
 * @Description: 表单校验类
 */

/**
 * @description: 
 * @param {Object} rules 必填 校验规则
 * @param {Object} form 必填 校验对象
 * @param {Array} fieldOrder 选填 校验字段顺序
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
    tel: /^(\(\d{3,4}-)|\d{3.4}-)?\d{7,8}$/,
    // 汉字
    chinese: /^[\u4e00-\u9fa5]{0,}$/,
    // 身份证号(15位、18位数字)，最后一位是校验位，可能为数字或字符X
    idCard: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
    // IPv4地址
    ip: /((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}/,
    // 中国邮政编码
    postalCode: /[1-9]\d{5}(?!\d)/
  };

  static types = ['string', 'number', 'boolean', 'function', 'float', 'integer', 'array', 'object', 'date', 'regexp'];

  constructor(rules, form, fieldOrder) {
    if (!Validator.isObject(rules)) {
      throw new Error('Rules must be an object');
    }
    this.bindForm(form);
    this.bindFieldOrder(fieldOrder);

    this.rules = {};
    Object.keys(rules).forEach(name => {
      const item = rules[name];
      this.rules[name] = Array.isArray(item) ? item : [item];
    });

  }

  set rules() {
    throw new Error('Rules is redonly');
  }

  set form() {
    throw new Error('To set the value of form, use bindForm function');
  }

  set fieldOrder() {
    throw new Error('To set the value of fieldOrder, use bindFieldOrder function');
  }

  /**
   * @description: 校验所有rules中字段
   * @return {Promise}
   */  
  validate() {
    return new Promise((resolve, reject) => {
      const errors = [];
      const { rules, form, fieldOrder } = this;
      
      fieldOrder.forEach(async field => {
        const currentRules = rules[field];
        let ruleIdx = 0;
        const len = currentRules.length
        while(ruleIdx < (len - 1)) {
          const rule = currentRules[ruleIdx];
          const { required, type, pattern } = rule;
          const { oneOf, isEmpty, capitalize, isRegexp, isFunction } = Validator;

          // 验证器集合
          const validators = [
            required ? value => !isEmpty(value) : null,
            oneOf(type, Validator.types) ? value => {
              return Validator[`is${capitalize(type)}`](value);
            } : null,
            isRegexp(pattern) ? pattern.test : null,
            isFunction(rule.validator) ? rule.validator : null
          ].filter(item => item);

          for(const validator of validators) {
            const result = await validator(form[field]);
            if(!result) {
              errors[field] = rule;
              return;
            }
          }
          ruleIdx ++;
        }
      })
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
   * @description: 绑定form
   * @param {*} form
   * @return {Object}
   */  
  bindForm(form) {
    if(!Validator.isObject(form)) {
      throw new Error('Form must be an object');
    }
    return this.form = form;
  }

  /**
   * @description: 绑定fieldOrder
   * @param {*} fieldOrder
   * @return {Array}
   */  
  bindFieldOrder(fieldOrder) {
    if(typeof fieldOrder !== 'undefined' && !Validator.isArray(fieldOrder)) {
      throw new Error('FieldOrder must be an array when passed in');
    }
    return this.fieldOrder = fieldOrder || Object.keys(rules);
  }
  
  /**
   * @description: 首字符转大写
   * @param {String} str
   * @return {String}
   */  
  static capitalize(str) {
    if(!Validator.isString(str)) {
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
  static oneOf (value, validList) {
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
    try {
      return !!new RegExp(value);
    } catch (e) {
      return false;
    }
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
    return typeof value === 'object' && !Validator.array(value);
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

const form = {
  name: 'xxx',
  phone: '',
  email: 'xx',
  sex: '',
}

const rules = {
  name: { required: true, message: '请输入姓名' },
  phone: [
    { required: true, message: '请输入电话' },
    { validator: Validator.isPhone, message: '请输入正确的电话' }
  ],
  email: [
    { required: true, message: '请输入邮箱' },
    { 
      validator() {
        return true;
        return false;
        return Promise.resolve();
        return Promise.reject();
      }, 
      message: '请输入正确的邮箱' 
    }
  ],
  sex: [
    { required: true, message: '请选择性别' },
    { enum: ['男', '女'], message: '性别只能为男、女' }
  ],
  abc: { pattern: Validator.pattern.phone, message: '请输入电话' }
}

const validator = new Validator(form, rules);

validator.validate()
  .then(() => {

  })
  .catch(errors => {
    errors = [
      { field: 'name', require: true, message: '请输入姓名' }
    ]
  })


/**
 * @description: 
 * @param {Enum} type string\number\boolean\function\float\integer\array\object\date\regexp\any
 * @param {Boolean} required
 * @param {String} message
 * @param {Function} validator
 * @param {Regexp} pattern
 * @return {*}
 */


/**
 * 执行顺序：
 * 1.required
 * 2.type
 * 3.pattern
 * 4.validator
 */

