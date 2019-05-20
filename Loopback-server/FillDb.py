import pymongo

myclient = pymongo.MongoClient("mongodb://localhost:27017/")
mydb = myclient["travels"]

myusers = mydb['myuser']
rentalservices = mydb['rentalService']
cars = mydb['car']
reservations = mydb['carReservation']

rentalservices.delete_many({})
cars.delete_many({})
reservations.delete_many({})

rentaladmin = myusers.find_one({'username': 'rentaladmin'})

rentalservices.insert_one({"address": "Address1", "name": "Rental1", "description": "Description of rental1",
                           'myuserId': rentaladmin['_id']})
rentalservices.insert_one({"address": "Address2", "name": "Rental2", "description": "Description of rental2",
                           'myuserId': rentaladmin['_id']})
rentalservices.insert_one({"address": "Address3", "name": "Rental3", "description": "Description of rental3",
                           'myuserId': rentaladmin['_id']})

rental1 = rentalservices.find_one({'name': 'Rental1'})
rental2 = rentalservices.find_one({'name': 'Rental2'})


cars.insert_one({'make': 'make1', 'registration': 'reg01', 'seats': 3, 'category': 'B',
                 'rentalServiceId': rental1['_id']})
cars.insert_one({'make': 'make1', 'registration': 'reg02', 'seats': 3, 'category': 'C',
                 'rentalServiceId': rental1['_id']})
cars.insert_one({'make': 'make2', 'registration': 'reg03', 'seats': 4, 'category': 'B',
                 'rentalServiceId': rental1['_id']})
cars.insert_one({'make': 'make1', 'registration': 'reg04', 'seats': 4, 'category': 'C',
                 'rentalServiceId': rental2['_id']})
cars.insert_one({'make': 'make1', 'registration': 'reg05', 'seats': 3, 'category': 'B',
                 'rentalServiceId': rental2['_id']})



