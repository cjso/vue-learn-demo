import request from '@/utils/request'

export function getList(params) {
  return request({
    url: 'http://localhost:9000/project/getUserInfoList',
    method: 'get',
    params: params
  })
}


export function formatTime(daterc) {
  if(daterc!=null){
    const dateee = new Date(daterc).toJSON();
    return new Date(+new Date(dateee) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '');
  }
}

export function getUserInfo(params) {
  return request({
    url: 'http://localhost:9000/project/getUserInfo',
    method: 'get',
    params: params
  })
}

export function saveUser(data) {
  return request({
    url: 'http://localhost:9000/project/saveUser',
    method: 'post',
    data: data
  })
}

export function delUser(params) {
  return request({
    url: 'http://localhost:9000/project/delUser',
    method: 'post',
    params: params
  })
}
