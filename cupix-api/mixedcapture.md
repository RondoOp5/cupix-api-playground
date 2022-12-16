# Upload mixed capture
This document outlines mixed-capture uploads.



The overall flow is like this.
1. Create a new capture with material: "video-pano"
2. Add "pts_unit": ms when creating video
3. Add timestamp property when creating pano
4. Upload video and pano(still image) file data in the same way as the existing method
5. check_uploading for each video and pano
6. "upload_done" the created capture

## Create video-pano type capture

`POST https://api.cupix.works/api/v1/captures`

First, create capture as video-pano type. 

Put video-pano in the material property.

| Attribute | Type   | Required | Description     |
|:----------|:----------|:----------|:----------|
| fields    | array of string    | true   | id, name, level, material, record	    |
| creation_platform    | string   | true   | web   |
| material    | string    | true   | video, pano, **video-pano**  |
| level_id   | int   | true   |  level id to upload  |
| record_id    | string   | true   | record id to upload    |
| name    | string    | true    | capture name   |

### Sample request 
```
request.post(`https://api.cupix.works/api/v1/captures`, {
    method: 'POST',
    Accept: 'application/json',
    json: true,
    qs: {
        fields: 'id, name',
        creation_platform: "web",
        material: 'video-pano',
        level_id: <level id to upload>,
        record_id: <record id to upload>,
        name: <capture name>
    },
    headers: {
        'x-cupix-auth': <your access_token>
    }
})
```


### Sample response
```
Status Code 200 : {
  "result": {
    "data": {
      "id": "71118",
      "type": "capture",
      "attributes": {
        "id": 71118,
        "name": "videopanotest"
      }
    }
  },
  "session": null
}
``` 

## Create a video model on the server

`POST https://api.cupix.works/api/v1/videos`

If capture was created with video-pano, put something called **pts_unit** when creating a video.


**pts_unit** specifies the format in which the still image timestamp is received.
Currently only supported in milliseconds

| Attribute | Type   | Required | Description     |
|:----------|:----------|:----------|:----------|
| fields    | array of string    | true   | id,name,state,resource_state,upload_url,**pts_unit**  |
| name    | string   | true    | video file name    |
| capture_id   | int   | true   | ID of the capture to which the video belongs   |
|  **pts_unit**  | string   | false   | **ms** |

### Sample request 
```
request.post(`https://api.cupix.works/api/v1/videos`, {
        method: 'POST',
        Accept: 'application/json',
        json: true,
        qs : { 
            fields: 'id,name,state,resource_state,upload_url,capture_id,pts_unit'
            },
        body : {
            name: <video file name>,
            capture_id: <ID of the capture to which the video belongs>,
			pts_unit: 'ms'
        },
        headers: {
            'x-cupix-auth': <your access_token>
        }
    })
```

### Sample response
```
Status Code 200 : {
  "result": {
    "data": {
      "id": "35032",
      "type": "video",
      "attributes": {
        "id": 35032,
        "name": "testvideo.mp4",
        "state": "created"
      }
    }
  },
  "session": null
}
``` 

## Create a pano model on the server

`POST https://api.cupix.works/api/v1/videos`

We now need to tell which timestamp on the video the image to embed exists.

**timestamp** is play time, not recording time. 

If you want to play a video recorded at 5fps at 30fps and insert a pano at 30 seconds based on the recording time, **timestamp** should exceed 5000ms.

| Attribute | Type   | Required | Description     |
|:----------|:----------|:----------|:----------|
| fields    | array of string    | true   | id,name,state,resource_state,**timestamp**  |
| name    | string   | true    | image file name    |
| capture_id   | int   | true   | ID of the capture to which the pano belongs   |
|  **timestamp** | int   | false   | *The timestamp of the video where the image exists (in units of pts_unit)*    |

### Sample request 
```
request.post(`https://api.cupix.works/api/v1/panos`, {
        method: 'POST',
        Accept: 'application/json',
        json: true,
        qs : { 
            fields: 'id,name,state,resource_state,timestamp'
            },
        body : {
            name: <image file name>,
            capture_id: <ID of the capture to which the image belongs>,
	    timestamp: 3000
        },
        headers: {
            'x-cupix-auth': <your access_token>
        }
    })
```

### Sample response
```

Status Code 200 : {
  "result": {
    "data": {
      "id": "2065697",
      "type": "pano",
      "attributes": {
        "id": 2065697,
        "name": "stillimage.jpg",
        "state": "created",
        "resource_state": "created",
        "timestamp": 3000
      }
    }
  },
  "session": null
}

``` 


