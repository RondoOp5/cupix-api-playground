# Facility

Facility is a term on the server and it means **Project** in CupixWorks.

You need to know the **facility key** of the Project to access captures. This key can also be found at {domain}.cupix.works/pj/{key} of the project center in address bar and is an immutable value.

If you don't change the project you want to upload captures to, you don't need to look up this key again every time, you can just hardcode it.

## Look up entire facilites in team

`GET https://api.cupix.works/api/v1/facilities`

| Attribute    | Type           | Required | Description                                   |
| :----------- | :------------- | :------- | :-------------------------------------------- |
| fields       | array of sting | true     | id,key,name,user,workspace,permission         |
| workspace_id | integer        | false    | ID of the specific workspace to search within |
| page         | integer        | false    | page index to search per page                 |
| per_page     | integer        | false    | Number of items to GET per page               |

### Sample request

```js
request.get(`https://api.cupix.works/api/v1/facilities`, {
    method:'GET',
    Accept: 'application/json',
    json: true,
    qs : {
        fields : 'id, name, key'
    },
    headers: {
    	'x-cupix-auth': <your_access_token>
    }
    }
)
```

### Example response

```js
Status Code 200 : {
  "result": {
    "data": [
      {
        "id": "8952",
        "type": "facility",
        "attributes": {
          "id": 7964,
          "name": "facility test",
          "key": "sqpa2d"
        }
      },
      {
        "id": "8953",
        "type": "facility",
        "attributes": {
          "id": 7959,
          "name": "test Project",
          "key": "zs123s"
        }
      },
      {
        "id": "8954",
        "type": "facility",
        "attributes": {
          "id": 7949,
          "name": "Wiley Project",
          "key": "hiho12"
        }
      }
    ],
    "pagination": {
      "total_entries": 100,
      "total_pages": 10,
    }
  },
  "session": null
}
```
