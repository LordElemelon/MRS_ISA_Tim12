import pymongo
import requests
import json



def login_to_rental_admin(rental_num, admin_num):
    url = 'http://localhost:3000/api/myusers/login'
    headers = {'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json'}
    payload = {'username': 'rental' + rental_num + 'test' + admin_num, 'password': '123'}
    res = requests.post(url, data=payload, headers=headers)
    res_content = json.loads(res.text)
    ret_val = res_content['id']
    return ret_val

def add_price(admin_token, rental_id, priceA, priceB, priceC):
    url = 'http://localhost:3000/api/CarPrices?access_token=' + admin_token
    headers = {'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json'}
    payload = {'start': '2019-06-10T13:25:53.258Z', 'catAPrice': priceA, 'catBPrice': priceB, 'catCPrice': priceC, 'rentalServiceId': rental_id}
    res = requests.post(url, data=payload, headers=headers)


def add_cars(reg_range_low, reg_range_high, rental_id, admin_token):
    url = 'http://localhost:3000/api/cars?access_token=' + admin_token
    headers = {'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json'}
    seats = ['1', '2', '3', '4', '5']
    category = ['A', 'B', 'C']
    make = ['BMW', 'Volkswagen', 'Mercedes']
    for i in range(reg_range_low, reg_range_high):
        payload = {'make': make[i % len(make)], 'registration': 'reg' + str(i), 'seats': seats[i % len(seats)],
                   'category': category[i % len(category)], 'rentalServiceId': rental_id}
        res = requests.post(url, data=payload, headers=headers)




myclient = pymongo.MongoClient("mongodb://localhost")

mydb = myclient['travels']


myusers = mydb['myuser']

#Login to System admin and get his token
url = 'http://localhost:3000/api/myusers/login'
headers = {'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json'}
payload = {'username': 'Admin', 'password': 'password'}
res = requests.post(url, data=payload, headers=headers)
res_content = json.loads(res.text)
access_token = res_content['id']

#Add a few locations to the system
locations = mydb['location']
loc1_id = str(locations.insert_one({'country': 'Canada', 'city': 'Torronto'}).inserted_id)
loc2_id = str(locations.insert_one({'country': 'USA', 'city': 'Washington'}).inserted_id)
loc3_id = str(locations.insert_one({'country': 'Mexico', 'city': 'Mexico'}).inserted_id)
loc4_id = str(locations.insert_one({'country': 'Serbia', 'city': 'Vrbas'}).inserted_id)


#Add a rental service called Rental1 to the database
url = 'http://localhost:3000/api/rentalServices?access_token=' + access_token
headers = {'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json'}
payload = {'name': 'Rental1', 'address': 'Address 7', 'description': 'A very short description of rental1', 'locationId': loc1_id}
res = requests.post(url, data=payload, headers=headers)
res_content = json.loads(res.text)
rental1_id = res_content['id']

#Add a rental service called Rental2 to the database
url = 'http://localhost:3000/api/rentalServices?access_token=' + access_token
headers = {'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json'}
payload = {'name': 'Rental2', 'address': 'Address 10', 'description': 'A very short description of rental2', 'locationId': loc2_id}
res = requests.post(url, data=payload, headers=headers)
res_content = json.loads(res.text)
rental2_id = res_content['id']

#Add a rental service called Rental3 to the database
url = 'http://localhost:3000/api/rentalServices?access_token=' + access_token
headers = {'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json'}
payload = {'name': 'Rental3', 'address': 'Address 15', 'description': 'A very short description of rental3', 'locationId': loc3_id}
res = requests.post(url, data=payload, headers=headers)
res_content = json.loads(res.text)
rental3_id = res_content['id']


#Add a rental service called Rental4 to the database
url = 'http://localhost:3000/api/rentalServices?access_token=' + access_token
headers = {'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json'}
payload = {'name': 'Rental4', 'address': 'Address 20', 'description': 'A very short description of rental4', 'locationId': loc4_id}
res = requests.post(url, data=payload, headers=headers)
res_content = json.loads(res.text)
rental4_id = res_content['id']

#Add admin rental1test1 to Rental1
url = 'http://localhost:3000/api/myusers/registerAnAdmin?access_token=' + access_token
headers = {'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json'}
payload = {'username': 'rental1test1', 'password': '123', 'type': 'rentalServiceAdmin', 'email': 'rental1test1@gmail.com', 'emailVerified': 'true'}
res = requests.post(url, data=payload, headers=headers)
res_content = json.loads(res.text)
rental1test1id = res_content['retval']['id']

#connect using myuser method
url = 'http://localhost:3000/api/myusers/connectAdminToCompany?access_token=' + access_token
headers = {'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json'}
payload = {'userid': rental1test1id, 'companyid': rental1_id}
res = requests.post(url, data=payload, headers=headers)
res_content = json.loads(res.text)

#Add admin rental1test2 to Rental1
url = 'http://localhost:3000/api/myusers/registerAnAdmin?access_token=' + access_token
headers = {'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json'}
payload = {'username': 'rental1test2', 'password': '123', 'type': 'rentalServiceAdmin', 'email': 'rental1test2@gmail.com', 'emailVerified': 'true'}
res = requests.post(url, data=payload, headers=headers)
res_content = json.loads(res.text)
rental1test2id = res_content['retval']['id']

#connect using myuser method
url = 'http://localhost:3000/api/myusers/connectAdminToCompany?access_token=' + access_token
headers = {'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json'}
payload = {'userid': rental1test2id, 'companyid': rental1_id}
res = requests.post(url, data=payload, headers=headers)
res_content = json.loads(res.text)


#Add admin rental2test1 to Rental2
url = 'http://localhost:3000/api/myusers/registerAnAdmin?access_token=' + access_token
headers = {'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json'}
payload = {'username': 'rental2test1', 'password': '123', 'type': 'rentalServiceAdmin', 'email': 'rental2test1@gmail.com', 'emailVerified': 'true'}
res = requests.post(url, data=payload, headers=headers)
res_content = json.loads(res.text)
rental2test1id = res_content['retval']['id']

#connect using myuser method
url = 'http://localhost:3000/api/myusers/connectAdminToCompany?access_token=' + access_token
headers = {'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json'}
payload = {'userid': rental2test1id, 'companyid': rental2_id}
res = requests.post(url, data=payload, headers=headers)
res_content = json.loads(res.text)

#Add admin rental2test2 to Rental2
url = 'http://localhost:3000/api/myusers/registerAnAdmin?access_token=' + access_token
headers = {'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json'}
payload = {'username': 'rental2test2', 'password': '123', 'type': 'rentalServiceAdmin', 'email': 'rental2test2@gmail.com', 'emailVerified': 'true'}
res = requests.post(url, data=payload, headers=headers)
res_content = json.loads(res.text)
rental2test2id = res_content['retval']['id']

#connect using myuser method
url = 'http://localhost:3000/api/myusers/connectAdminToCompany?access_token=' + access_token
headers = {'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json'}
payload = {'userid': rental2test2id, 'companyid': rental2_id}
res = requests.post(url, data=payload, headers=headers)
res_content = json.loads(res.text)

#Add admin rental3test1 to Rental3
url = 'http://localhost:3000/api/myusers/registerAnAdmin?access_token=' + access_token
headers = {'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json'}
payload = {'username': 'rental3test1', 'password': '123', 'type': 'rentalServiceAdmin', 'email': 'rental3test1@gmail.com', 'emailVerified': 'true'}
res = requests.post(url, data=payload, headers=headers)
res_content = json.loads(res.text)
rental3test1id = res_content['retval']['id']

#connect using myuser method
url = 'http://localhost:3000/api/myusers/connectAdminToCompany?access_token=' + access_token
headers = {'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json'}
payload = {'userid': rental3test1id, 'companyid': rental3_id}
res = requests.post(url, data=payload, headers=headers)
res_content = json.loads(res.text)


#Add admin rental4test1 to Rental4
url = 'http://localhost:3000/api/myusers/registerAnAdmin?access_token=' + access_token
headers = {'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json'}
payload = {'username': 'rental4test1', 'password': '123', 'type': 'rentalServiceAdmin', 'email': 'rental4test1@gmail.com', 'emailVerified': 'true'}
res = requests.post(url, data=payload, headers=headers)
res_content = json.loads(res.text)
rental4test1id = res_content['retval']['id']

#connect using myuser method
url = 'http://localhost:3000/api/myusers/connectAdminToCompany?access_token=' + access_token
headers = {'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json'}
payload = {'userid': rental4test1id, 'companyid': rental4_id}
res = requests.post(url, data=payload, headers=headers)
res_content = json.loads(res.text)



rental1test1_access_token = login_to_rental_admin('1', '1')
rental2test1_access_token = login_to_rental_admin('2', '1')
rental3test1_access_token = login_to_rental_admin('3', '1')
rental4test1_access_token = login_to_rental_admin('4', '1')

add_price(rental1test1_access_token, rental1_id, '100', '200', '300')
add_price(rental2test1_access_token, rental2_id, '50', '75', '100')
add_price(rental3test1_access_token, rental3_id, '150', '200', '300')
add_price(rental4test1_access_token, rental4_id, '50', '60', '70')

add_cars(1, 10, rental1_id, rental1test1_access_token)
add_cars(10, 20, rental2_id, rental2test1_access_token)
add_cars(20, 30, rental3_id, rental3test1_access_token)
add_cars(30, 40, rental4_id, rental4test1_access_token)

#register an ordinary user with username: username and password: password

url = 'http://localhost:3000/api/myusers'
headers = {'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json'}
payload = {'username': 'username', 'password': 'password', 'email': 'nikolanemzi@gmail.com', 'emailVerified': 'true'}
res = requests.post(url, data=payload, headers=headers)
res_content = json.loads(res.text)

myusers.update_one({'username': 'username'}, {'$set': {'emailVerified': True, 'bonusPoints': 600}})



