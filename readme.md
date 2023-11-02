# node express 搭配 mySql 建立的 三層式API架構
## 簡介
- 使用固定格式response:根据開發需求自定義code,msg和data形式,並根據code進行不同回應
```js
response = {
    code:0001,
    msg:"成功",
    data
}
```
- [第一層( presentation_layer )](#第一層-presentation_layer) : 提供給前端API接口的server,參照白名單傳給第二層進行邏輯判斷
- 第二層( domin_layer ) : 根據商業需求進行撰寫的邏輯層server,參照白名單經第三層提供的微服務進行邏輯判斷
- 第三層( access_layer ) : 提供微服務,與資料庫進行溝通的server

## 第一層 presentation_layer
> 分別以**GET**,**POST**,**PUT**,**DELETE**等四種方法作為接口
- GET:根據query datas key值,取得複數筆資料
```js
method = "GET"
URL = "/api/user?datas=accountDatas,backpack"
```

- POST:根據body.action和body.datas執行動作,如註冊,查詢玩家資料etc...
```js
method = "POST"
URL = "/api/user"
body = {
    "action":"register",
    "datas":{
        "account":"",
        "password":""
    }
}
```
- PUT:根據body.target和body.datas進行資料的異動,如更改密碼,等級調整
```js
method = "PUT"
URL = "/api/user"
body = {
    "target":"password",
    "datas":{
        "password":"",
        "newPassword":""
    }
}
```
- DELETE:根據body.target和body.datas中ID進行資料的刪除
```js
method = "DELETE"
URL = "/api/user"
body = {
    "target":"account",
    "datas":{
        "uid":""
    }
}
```
---
### 取得使用者基本資料和所屬道具

`GET/api/user?datas=accountDatas,backpack`
#### query_keys
- accountDatas : 使用者基本資料 (需登入)
- backpack : 使用者背包 (需登入)


#### response_data
1. accountDatas ( object )
- uid : 使用者ID
- level : 使用者等級
- status : 使用者狀態
2. backpack ( array )
- uid : 使用者ID
- item_id : 道具ID
- item_name : 道具名稱
- category_id : 道具類別ID
- contents : 道具介紹
- item_amount : 持有道具數量
- status : 持有道具狀態

#### response_status
- 0001 : 成功
- 0002 : apikey錯誤
- 0003 : 請求參數驗證錯誤
- 1001 : 取得資料失敗
- 9998 : 系統錯誤
- 9999 : 未知錯誤

---

### 註冊
`POST/api/user`

- Content-Type : application/json
- action : `register`
- ckeck_login : fasle

#### required_datas
- uid : 使用者ID (必填) 字串
- password : 使用者密碼 (必填) 字串

#### response_data
- uid : 使用者ID

#### response_status
- 0001 : 成功
- 0002 : apikey錯誤
- 0003 : 請求參數驗證錯誤
- 2000 : 查無此帳號
- 2001 : 登入失敗
- 2002 : 密碼錯誤
- 1002 : 執行請求失敗
- 9998 : 系統錯誤
- 9999 : 未知錯誤
---
### 登入
`POST/api/user`

- Content-Type : application/json
- action : `login`
- ckeck_login : fasle

#### required_datas
- uid : 使用者ID (必填) 字串
- password : 使用者密碼 (必填) 字串

#### response_data
- uid : 使用者ID

#### response_status
- 0001 : 成功
- 0002 : apikey錯誤
- 0003 : 請求參數驗證錯誤
- 2007 : 帳號重複
- 2008 : 創建帳號失敗
- 1002 : 執行請求失敗
- 9998 : 系統錯誤
- 9999 : 未知錯誤
---

### 登出
`POST/api/user`

- action : `logout`
- ckeck_login : true

#### required_datas
- null

#### response_data
- null

#### response_status
- 0001 : 成功
- 0002 : apikey錯誤
- 0003 : 請求參數驗證錯誤
- 1000 : 未登入
- 9998 : 系統錯誤
- 9999 : 未知錯誤
---

### 創建道具類別
`POST/api/user`

- Content-Type : application/json
- action : `createItemCategory`
- ckeck_login : true

#### required_datas
- item_category_id : 道具類別名稱 (必填) 字串
- contents : 類別描述 (選填) 字串

#### response_data
- item_category_id : 道具類別名稱

#### response_status
- 0001 : 成功
- 0002 : apikey錯誤
- 0003 : 請求參數驗證錯誤
- 2101 : 創建道具類別失敗
- 2102 : 道具類別重複
- 1000 : 未登入
- 1002 : 執行請求失敗
- 9998 : 系統錯誤
- 9999 : 未知錯誤
---


### 創建道具
`POST/api/user`

- Content-Type : application/json
- action : `createItem`
- ckeck_login : true

#### required_datas
- item_category_id : 道具類別名稱 (必填) 字串
- item_name : 道具名稱 (必填) 字串
- contents : 道具描述 (選填) 字串

#### response_data
- item_id : 道具ID

#### response_status
- 0001 : 成功
- 0002 : apikey錯誤
- 0003 : 請求參數驗證錯誤
- 2103 : 查找道具類別失敗
- 2106 : 創建道具失敗
- 2108 : 道具名稱重複
- 1000 : 未登入
- 1002 : 執行請求失敗
- 9998 : 系統錯誤
- 9999 : 未知錯誤
---

### 創建使用者道具
`POST/api/user`

- Content-Type : application/json
- action : `createUserItem`
- ckeck_login : true

#### required_datas
- uid : 道具類別名稱 (必填) 字串
- item_id : 道具ID (必填) 數字

#### response_data
- uid : 使用者ID
- item_id : 道具ID

#### response_status
- 0001 : 成功
- 0002 : apikey錯誤
- 0003 : 請求參數驗證錯誤
- 2000 : 查無此帳號
- 2110 : 查找道具失敗
- 2111 : 創建玩家道具失敗
- 2112 : 玩家道具重複
- 1000 : 未登入
- 1002 : 執行請求失敗
- 9998 : 系統錯誤
- 9999 : 未知錯誤
---


### 查找道具類別
`POST/api/user`

- Content-Type : application/json
- action : `searchItemCategoryDatas`
- ckeck_login : true

#### required_datas
1.  columns : 查找項目 (必填) 字串,以`逗號 ( , )` 相連 EX : "item_category_id,contents"
- item_category_id : 道具類別名稱
- contents : 道具類別敘述
- create_time : 道具類別創建時間
- status : 道具類別狀態
2. wheres : 查找條件 ( 選填 ) 字串 EX : "id,1"
3. isFuzzy : 是否為模糊查詢 ( 選填 ) 0 ( 精準 ) || 1 ( 模糊 )
4. page : 頁數 (選填) 數字
5. pageSize : 筆數 (選填) 數字
6. orders : 排序條件 (選填) 字串 EX : "create_time/DESC"

#### response_data
- 根據columns提供的參數

#### response_status
- 0001 : 成功
- 0002 : apikey錯誤
- 0003 : 請求參數驗證錯誤
- 2103 : 查找道具類別失敗
- 1000 : 未登入
- 1002 : 執行請求失敗
- 9998 : 系統錯誤
- 9999 : 未知錯誤
---
### 修改使用者密碼
`PUT/api/user`

- Content-Type : application/json
- target : `password`
- ckeck_login : true

#### required_datas
- password : 舊密碼 ( 必填 ) 字串
- newPassword : 新密碼 ( 必填 ) 字串
#### response_data
- null

#### response_status
- 0001 : 成功
- 0002 : apikey錯誤
- 0003 : 請求參數驗證錯誤
- 2002 : 密碼錯誤
- 2003 : 更改密碼失敗
- 2004 : 新舊密碼相同
- 1000 : 未登入
- 1003 : 更新目標失敗
- 9998 : 系統錯誤
- 9999 : 未知錯誤
---

### 異動使用者道具數量
`PUT/api/user`

- Content-Type : application/json
- target : `userItemAmount`
- ckeck_login : true

#### required_datas
- uid : 使用者ID ( 必填 ) 字串
- item_id : 道具ID ( 必填 ) 字串
- offset : 異動值 ( 必填 ) 數字

#### response_data
- uid : 使用者ID
- item_id : 道具ID
- item_amount : 異動結餘

#### response_status
- 0001 : 成功
- 0002 : apikey錯誤
- 0003 : 請求參數驗證錯誤
- 2113 : 查找玩家道具失敗
- 2114 : 異動玩家道具結餘失敗
- 1000 : 未登入
- 1003 : 更新目標失敗
- 9998 : 系統錯誤
- 9999 : 未知錯誤
---


### 修改使用者等級
`PUT/api/user`

- Content-Type : application/json
- target : `level`
- ckeck_login : true

#### required_datas
- offset : 異動值 ( 必填 ) 數字

#### response_data
- level : 異動後等級

#### response_status
- 0001 : 成功
- 0002 : apikey錯誤
- 0003 : 請求參數驗證錯誤
- 2000 : 查無此帳號
- 2006 : 異動等級失敗
- 1000 : 未登入
- 1003 : 更新目標失敗
- 9998 : 系統錯誤
- 9999 : 未知錯誤
---


### 修改道具類別
`PUT/api/user`

- Content-Type : application/json
- target : `itemCategory`
- ckeck_login : true

#### required_datas
- item_category_id : 道具類別ID ( 必填 ) 字串
- contents : 道具類別敘述 ( 選填 ) 字串

#### response_data
- update_uid : 更改者ID
- item_category_id : 道具類別ID
- 更改項目

#### response_status
- 0001 : 成功
- 0002 : apikey錯誤
- 0003 : 請求參數驗證錯誤
- 2103 : 查找道具類別失敗
- 2104 : 更改道具類別失敗
- 1000 : 未登入
- 1003 : 更新目標失敗
- 9998 : 系統錯誤
- 9999 : 未知錯誤
---


### 修改道具
`PUT/api/user`

- Content-Type : application/json
- target : `item`
- ckeck_login : true

#### required_datas
- item_id : 道具ID ( 必填 ) 數字
- contents : 道具敘述 ( 選填 ) 字串

#### response_data
- update_uid : 更改者ID
- item_id : 道具ID
- 更改項目

#### response_status
- 0001 : 成功
- 0002 : apikey錯誤
- 0003 : 請求參數驗證錯誤
- 2109 : 更改道具失敗
- 2110 : 查找道具失敗
- 1000 : 未登入
- 1003 : 更新目標失敗
- 9998 : 系統錯誤
- 9999 : 未知錯誤
---


### 刪除使用者帳號
`DELETE/api/user`

- Content-Type : application/json
- target : `account`
- ckeck_login : true

#### required_datas
- uid : 欲刪除之使用者ID ( 必填 ) 字串

#### response_data
- null
#### response_status
- 0001 : 成功
- 0002 : apikey錯誤
- 0003 : 請求參數驗證錯誤
- 2005 : 刪除帳號失敗
- 1000 : 未登入
- 1004 : 刪除目標失敗
- 9998 : 系統錯誤
- 9999 : 未知錯誤
---

### 刪除道具類別
`DELETE/api/user`

- Content-Type : application/json
- target : `itemCategory`
- ckeck_login : true

#### required_datas
- item_category_id : 欲刪除之道具類別ID ( 必填 ) 字串

#### response_data
- null
#### response_status
- 0001 : 成功
- 0002 : apikey錯誤
- 0003 : 請求參數驗證錯誤
- 2105 : 刪除道具類別失敗
- 1000 : 未登入
- 1004 : 刪除目標失敗
- 9998 : 系統錯誤
- 9999 : 未知錯誤

### 刪除道具
`DELETE/api/user`

- Content-Type : application/json
- target : `item`
- ckeck_login : true

#### required_datas
- item_id : 欲刪除之道具ID ( 必填 ) 數字

#### response_data
- null
#### response_status
- 0001 : 成功
- 0002 : apikey錯誤
- 0003 : 請求參數驗證錯誤
- 2107 : 刪除道具失敗
- 1000 : 未登入
- 1004 : 刪除目標失敗
- 9998 : 系統錯誤
- 9999 : 未知錯誤
---


### 刪除使用者道具
`DELETE/api/user`

- Content-Type : application/json
- target : `userItem`
- ckeck_login : true

#### required_datas
- uid : 欲刪除的玩家ID ( 必填 ) 字串
- item_id : 欲刪除之道具ID ( 必填 ) 數字

#### response_data
- null
#### response_status
- 0001 : 成功
- 0002 : apikey錯誤
- 0003 : 請求參數驗證錯誤
- 2100 : 刪除玩家道具失敗
- 1000 : 未登入
- 1004 : 刪除目標失敗
- 9998 : 系統錯誤
- 9999 : 未知錯誤
---
