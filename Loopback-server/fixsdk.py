import os

def apply_fixes(fixes):
    for fix in fixes:
        print("------------------------------------------------------------")
        lines = []
        try:
            with open(fix['filePath']) as f:
                lines = f.readlines()
        except:
            print(fix['fixName'] + ' FAILED\nReason: file does not exist')
            continue
        conditions_met = True
        for condition in fix['Conditions']:
            if lines[condition['line']].strip() != condition['toMatch'].strip():
                conditions_met = False
                break
        if not conditions_met:
            print(fix['fixName'] + ' FAILED\nReason: conditions not met')
            continue
        for replace in fix['Replaces']:
            lines[replace['line']] = replace['toReplace']
        with open(fix['filePath'], 'w') as f:
            f.writelines(lines)
        print(fix['fixName'] + ' PASSED')


"""
    FixObject
        fixName: string
        filePath: path
        Conditions: []
        Replaces: []
    Condition:
        line: number
        toMatch: string
    Replace:
        line: number
        toReplace: string
"""

def main():
    relative_path = os.path.join('..', 'DasTravelSite', 'src', 'app', 'shared', 'sdk', 'services', 'custom')
    fixes = []
    fixes.append({
        'fixName': 'CarReservation fix',
        'filePath': os.path.join(relative_path, 'CarReservation.ts'),
        'Conditions': [
            {
                'line': 154,
                'toMatch':   'public cancel(id: any, customHeaders?: Function): Observable<any> {\n'
            },
            {
              'line': 188,
              'toMatch': 'public rateServiceAndCar(id: any, carRate: any, rentalRate: any, customHeaders?: Function): Observable<any> {\n'
            }
        ],
        'Replaces': [
            {
                'line':  159,
                'toReplace': '\n'
            },
            {
                'line': 162,
                'toReplace': '\tlet _urlParams: any = { id: id };\n'
            },
            {
              'line': 193,
              'toReplace': '\n'
            },
            {
              'line': 196,
              'toReplace': '\tlet _urlParams: any = { id: id };\n'
            }
        ]
    })
    fixes.append({
        'fixName': 'FindAvailableRooms fix',
        'filePath': os.path.join(relative_path, 'Room.ts'),
        'Conditions': [
            {
                'line': 567,
                'toMatch': 'public findAvailableRooms(start: any, end: any, location: any = {}, price: any = {}, beds: any, customHeaders?: Function): Observable<room[]> {\n'
            }
        ],
        'Replaces': [
            {
                'line': 567,
                'toReplace': '  public findAvailableRooms(start: any, end: any, location: any = {}, price: any = {}, beds: any, customHeaders?: Function): Observable<any> {\n'
            },
            {
                'line': 580,
                'toReplace': '\treturn result;'
            },
            {
                'line': 581,
                'toReplace': ''
            },
            {
                'line': 582,
                'toReplace': '\n'
            }
        ]
    })
    fixes.append({
        'fixName': 'Flight.ts fix',
        'filePath': os.path.join(relative_path, 'Flight.ts'),
        'Conditions': [
            {
                'line': 353,
                'toMatch': '  public findAvailableFlights(origin: any, destination: any, takeoffDate: any, customHeaders?: Function): Observable<flight[]> {\n'
            },
            {
                'line': 384,
                'toMatch': '  public findAvailableSeats(flightId: any, customHeaders?: Function): Observable<flight[]> {\n'
            }
        ],
        'Replaces': [
            {
                'line': 353,
                'toReplace': '  public findAvailableFlights(origin: any, destination: any, takeoffDate: any, customHeaders?: Function): Observable<any> {\n'
            },
            {
                'line': 364,
                'toReplace': '\treturn result;'
            },
            {
                'line': 365,
                'toReplace': ''
            },
            {
                'line': 366,
                'toReplace': '\n'
            },
            {
                'line': 384,
                'toReplace': '  public findAvailableSeats(flightId: any, customHeaders?: Function): Observable<any> {\n'
            },
            {
                'line': 393,
                'toReplace': '\treturn result;'
            },
            {
                'line': 394,
                'toReplace': ''
            },
            {
                'line': 395,
                'toReplace': '\n'
            }
        ]
    })
    fixes.append({
        'fixName': 'RoomReservation cancellation id and empty params fix',
        'filePath': os.path.join(relative_path, 'RoomReservation.ts'),
        'Conditions': [
            {
                'line': 122,
                'toMatch': 'public makeReservation(startDate: any, endDate: any, roomId: any, userId: any = {}, price: any, hotelDiscountId: any = {}, hotelId: any, customHeaders?: Function): Observable<any> {\n'
            },
            {
                'line': 192,
                'toMatch': 'public cancel(id: any, customHeaders?: Function): Observable<any> {\n'
            },
            {
                'line': 226,
                'toMatch': 'public rateHotelAndRoom(id: any, roomRate: any, hotelRate: any, customHeaders?: Function): Observable<any> {\n'
            }
        ],
        'Replaces': [
            {
                'line': 122,
                'toReplace': 'public makeReservation(startDate: any, endDate: any, roomId: any, userId: any = \'\', price: any, hotelDiscountId: any = \'\', hotelId: any, customHeaders?: Function): Observable<any> {\n'
            },
            {
                'line': 197,
                'toReplace': '\n'
            },
            {
                'line': 200,
                'toReplace': '\t\tlet _urlParams: any = { id: id};\n'
            },
            {
                'line': 231,
                'toReplace': '\n'
            },
            {
                'line': 234,
                'toReplace': '\tlet _urlParams: any = { id: id };\n'
            }
        ]
    })
    apply_fixes(fixes)


if __name__ == '__main__':
    main()
