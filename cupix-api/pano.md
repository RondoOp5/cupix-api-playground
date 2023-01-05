# Get Pano Information

`GET https://api.cupix.works/api/v1/panos OR https://api.cupix.works/api/v1/panos/${id}`

A pano's origin property tells you where this pano was created. If origin has video information, it was created from that video, and if origin is null, this pano is a still image, not a video.

| Attribute  | Type            | Required | Description                                                                                                                                                                                                                                                                   |
| :--------- | :-------------- | :------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| fields     | array of string | true     | id,**origin**,name,state,created_at,updated_at,published_at,capture,cluster,level,record,location,geo_coordinate,meta,thumbnail_urls,tile_size,tile_download_urls,mask_state,mask_url,pano_type,revision_type,enhanced_image_revision,use_georeference,georeference,constants |
| capture_id | integer         | false    | id to filter the video ids to upload by the workspace                                                                                                                                                                                                                         |
| order_by   | string          | false    | Field name to order                                                                                                                                                                                                                                                           |
| sort       | string          | false    | Sort direction                                                                                                                                                                                                                                                                |
| page       | integer         | false    | page index to search per page                                                                                                                                                                                                                                                 |
| per_page   | integer         | false    | Item count per page                                                                                                                                                                                                                                                           |

```js
request.get(`https://api.cupix.works/api/v1/panos`, {
    method:'GET',
    Accept: 'application/json',
    json: true,
    qs : {
            fields : 'id,origin',
			capture_id: 226700
    },
    headers: {
    'x-cupix-auth' : <your_access_token>
    }
})
```

### Example response

```js
...
  {
        "id": "11920979",
        "type": "pano",
        "attributes": {
          "id": 11920979,
          "origin": {
            "id": 93469,
            "name": "VID_20221027_153744_20221029001434-monostitch-5FPS.mp4",
            "type": "Video"
          }
        }
      },
      {
        "id": "11920839",
        "type": "pano",
        "attributes": {
          "id": 11920839,
          "origin": null
        }
      }
...
```
