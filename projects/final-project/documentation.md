
# Support Local Restaurants by Ordering In during Quarantine

---

Name: Cameron Reed

Date: April 17, 2020

Project Topic: Restaurant Take-out Options

URL: http://localhost:3000

---


### 1. Data Format and Storage

Data point fields:
- `Field 1`:    Name      `Type: String`
- `Field 2`:    Open      `Type: String`
- `Field 3`:    Close     `Type: String`
- `Field 4`:    Time      `Type: Number`
- `Field 5`:    Menu      `Type: Array`
- `Field 6`:    Platforms `Type: Array`

Schema:
```javascript
{
   name: String,
   open: String,
   close: String,
   time: Number,
   menu: [String],
   platforms: [String]
}
```

### 2. Add New Data

HTML form route: `/addRestaurant`

POST endpoint route: `/api/addRestaurant`

Example Node.js POST request to endpoint:
```javascript
var request = require("request");

var options = {
    method: 'POST',
    url: 'http://localhost:3000/api/addRestaurant',
    headers: {
        'content-type': 'application/x-www-form-urlencoded'
    },
    form: {
      name: "Cheescake Factory",
      open: "10:00 AM",
      close: "11:00 PM",
      time: 28,
      menu: ["cheesecake", "chicken marsala", "salmon", iced tea, "lemonade"],
      platforms: ["Postmates", "DoorDash", "Uber Eats"]
    }
};

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
});
```

### 3. View Data

GET endpoint route: `/api/getRestaurants`

### 4. Search Data

Search Field: name

### 5. Navigation Pages

Navigation Filters
1. Featured on GrubHub -> `/grubhub`
2. Open by 9AM -> `/9AM`
3. Restaurants with milkshakes -> `/milkshakes`
4. Open to Midnight or Later -> `/midnight`
5. Sort by shortest delivery time -> `/deliveryTime`
