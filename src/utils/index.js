/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (typeof time === 'string' && /^[0-9]+$/.test(time)) {
      time = parseInt(time)
    }
    if (typeof time === 'number' && time.toString().length === 10) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value]
    }
    return value.toString().padStart(2, '0')
  })
  return time_str
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse(
    '{"' +
      decodeURIComponent(search)
        .replace(/"/g, '\\"')
        .replace(/&/g, '","')
        .replace(/=/g, '":"')
        .replace(/\+/g, ' ') +
      '"}'
  )
}

/**
 * 获取地址栏参数
 * @param param
 */
export const getParamByURL = param => {
  // 获取地址栏上的参数
  if (!window.location.search && !window.location.hash) return ''
  const urlParams = window.location.search
    ? window.location.search.split('?')[1]
    : window.location.hash.split('?')[1]
  if (!urlParams) return ''
  const reg = new RegExp('(^|&)' + param + '=([^&]*)(&|$)')
  const r = urlParams.match(reg)
  if (r != null) return r[2].replace(`?${param}=`, '')
  return ''
}

export const getSchemeHostPortByURL = () => {
  return window.location.protocol + window.location.host + window.location.port
}

/**
 * 防抖
 * @param fn
 * @param wait
 * @returns {function(): void}
 */
export const debounce = function(fn, wait) {
  let timeout = null
  return function() {
    if (timeout !== null) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(fn, wait)
  }
}

/**
 * 节流
 */
export const throttle = function(fun, delay) {
  let last, deferTimer
  return function() {
    const that = this
    const _args = arguments
    const now = +new Date()
    if (last && now < last + delay) {
      clearTimeout(deferTimer)
      deferTimer = setTimeout(function() {
        last = now
        fun.apply(that, _args)
      }, delay)
    } else {
      last = now
      fun.apply(that, _args)
    }
  }
}

/**
 * 级联结构的深层查找(递归)
 * 目前只支持 value 为基础类型
 * @param {array} arr
 * @param {string} key
 * @param {*} value
 */
export function findDeep(arr, key, value) {
  if (!key || !value) {
    return false
  }
  let result = false
  if (arr && Array.isArray(arr) && arr.length > 0) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i][key] === value) {
        result = arr[i]
        break
      }
      result = findDeep(arr[i].children, key, value)
      if (result) {
        break
      }
    }
  }
  return result
}

/**
 * 级联结构的深层过滤(递归)
 * 当前只支持 value 为字符串
 * @param {array} arr
 * @param {string} key
 * @param {string} value
 */
export function filterDeep(arr, key, value) {
  if (!key || !value) {
    return arr
  }
  if (arr && Array.isArray(arr) && arr.length > 0) {
    const array = []
    arr.forEach(item => {
      const children = filterDeep(item.children, key, value)
      if (children.length > 0 || (item[key] && item[key].indexOf(value) > -1)) {
        array.push({ ...item, children })
      }
    })
    return array
  }
  return []
}

/**
 * 更新表单控件选项数组
 * 需要将 this 指向组件实例
 * @param {array} target 配置数组
 * @param {string} key 参数名
 * @param {array} options 选项
 */
export function updateDict(target, key, options) {
  const index = target.findIndex(item => item.key === key)
  if (index > -1) {
    this.$set(target[index], 'options', options)
  }
}

/**
 * 更新关联表单控件的选项数组(递归)
 * 支持深层嵌套
 * 目前只支持 value 为基础类型
 * @param {array} target 配置数组
 * @param {string} key 要更新选项数组的表单控件的 key
 * @param {*} value 触发变更的表单控件的值 value
 * @param {array} arr 关联数组
 * @param {{ id: string, children: string }} props 参数名称
 */
export function getChildrenDict(
  target,
  key,
  value,
  arr,
  props = { id: 'id', children: 'children' }
) {
  let result = false
  if (arr && Array.isArray(arr) && arr.length > 0) {
    for (let i = 0; i < arr.length; i++) {
      // if (
      //   arr[i][props.id] === value &&
      //   arr[i][props.children] &&
      //   Array.isArray(arr[i][props.children])
      // ) {
      //   updateDict.call(this, target, key, arr[i][props.children])
      //   result = true
      //   break
      // }

      if (arr[i][props.id] === value) {
        // Note: 防止匹配成功时，遇到 children 不是数组的情况，导致方法继续执行
        if (arr[i][props.children] && Array.isArray(arr[i][props.children])) {
          updateDict.call(this, target, key, arr[i][props.children])
        }
        result = true
        break
      }

      result = getChildrenDict.call(
        this,
        target,
        key,
        value,
        arr[i][props.children],
        props
      )
      if (result) {
        break
      }
    }
  }
  return result
}
/**
 *
 * @param {表单结构} formSchema
 * @param {表单数据模型} formData
 * eg
 * initFormData.call(this,formSchema,formData)
 */
export function initFormData(formSchema = [], formData) {
  formSchema.forEach(item => {
    switch (item.type) {
      case 'checkbox':
        this.$set(formData, item.key, [])
        break
      case 'inputNumber':
        this.$set(formData, item.key, 0)
        break
      default:
        this.$set(formData, item.key, '')
    }
  })
}
/**
 *
 * @param {*} formSchema
 * @returns
 */
export function getFormInitData(formSchema = []) {
  let initData = {}
  formSchema.forEach(item => {
    switch (item.type) {
      case 'checkbox':
      case 'upload':
        initData[item.key] = []
        break
      case 'timePicker':
        if (item['is-range']) {
          initData[item.key] = [new Date(), new Date()]
        } else {
          initData[item.key] = ''
        }
        break
      case 'inputNumber':
        initData[item.key] = undefined
        break
      default:
        initData[item.key] = ''
    }
  })
  return initData
}

/**
 * 字符串拼接
 * @param {*} row
 * @param {string[]} keys
 * @param {string} separators
 */
export function stringConcatenation(row, keys, separators = '-') {
  const result = []
  keys.forEach(key => {
    if (row[key]) {
      result.push(row[key])
    }
  })
  if (result.length > 0) {
    return result.join(separators)
  } else {
    return '--'
  }
}
