// 一参数 data 为    Object 或者 Array<Object>, 
// 二参为 fmts 保留字段及处理方式Array<[filed,cb]> 
// 三参为返回值形式  目前主要为两种  一种是[{key:value}...] 一种是[[val1,val2...]]
// 此函数功能为将过滤需要的字段 并进行处理。
export default function dataTransform(data, fmts, mode = 'kv', ifNull = '无') {
  if (data instanceof Array) {
    return arrTransform(data, fmts, mode, ifNull)
  } else {
    return oneTransform(data, fmts, mode, ifNull)
  }
}

function oneTransform(data, fmts, mode, ifNull) {
  let obj = objGenerator(mode)
  fmts.forEach(fmt => {
    if (fmt instanceof Array) {
      const field = fmt[0];
      const callback = fmt[1];
      if (data[field]) {
        const ele = callback ? callback(data[field]) : data[field]
        if (mode === 'kv') {
          obj[field] = ele
        } else if (mode === 'v') {
          obj.push(ele)
        }
      } else {
        if(mode === 'kv'){
          obj[field] = ifNull
        } else if (mode === 'v') {
          obj.push(ifNull)
        }
      }
    }
  })
  return obj
}

function arrTransform(data, fmts, mode, ifNull) {
  const store = []
  data = data.map(pieceData => {
    store.push(oneTransform(pieceData, fmts, mode, ifNull))
  })
  return store;
}

function objGenerator(mode) {
  if (mode === 'kv') {
    return {}
  } else if (mode === 'v') {
    return []
  }
}

