# Description
This SPA application. This is just a table in which there is a “customer” (CLASS: 5) and a “performer” (CLASS: 10) of the order. The customer creates orders, and only sees his orders. The contractor sees all orders, and changes statuses.

# Install

```
# git clone https://github.com/arhipovmn/table-tornado-react
...
# git status
# git reset --hard
# git pull
...
# python -m venv venv  
# venv\Scripts\activate  
# pip install tornado  
# pip install PyMySQL  
# npm install  
```

## Create databases in MySQL:
```sql
CREATE TABLE `master_orders` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `NUMBER` varchar(11) NOT NULL,
  `DESCRIPTION` text NOT NULL,
  `LINK` text NOT NULL,
  `USER_CREATED` int(11) NOT NULL,
  `DATE_CREATED` datetime NOT NULL,
  `DATE_APPLY` datetime DEFAULT NULL,
  `DATE_PROCESSED` datetime DEFAULT NULL,
  `DATE_COMPLETED` datetime DEFAULT NULL,
  `DELIVERY_METHOD` varchar(60) DEFAULT NULL,
  `TRACK_NUMBER` varchar(20) DEFAULT NULL,
  `STATUS` enum('new','apply','processed','completed') NOT NULL DEFAULT 'new',
  `ACTIVE` enum('Y','N') NOT NULL DEFAULT 'Y',
  PRIMARY KEY (`ID`),
  UNIQUE KEY `master_orders_id_uindex` (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=46 DEFAULT CHARSET=utf8;

CREATE TABLE `users` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `LOGIN` text NOT NULL,
  `PASSWORD` text NOT NULL,
  `CLASS` int(11) NOT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `users_id_uindex` (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8 AVG_ROW_LENGTH=4096;
```

## Config:  
in package.json, change "development" to "production":  
```json
"build": "webpack -p --config webpack.config.js --progress --mode production",
```
in webpack.config.js, change "development" to "production":  
```js
module.exports = {
    mode: 'development'
```
rename file from "setting.py.example" to "setting.py" and edit this file... 

## Start
```
# npm run build
```
... and start main.py