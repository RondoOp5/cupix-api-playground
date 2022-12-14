(async () => {

    const resData = f => _.pipe(
        ({result :{data}}) => data,
        f
    );

    const fetchApi = _.go(
        $.get(`./assets/cupix-api.json`, {}, {}),
        resJSON
    );

    const requestBodies = await _.go(
        fetchApi,
        ({components : { requestBodies }}) => requestBodies      
    );

    const schemas = await _.go(
        fetchApi,
        ({components : { schemas }}) => schemas      
    );

    const pathsByGroup = await _.go(
        fetchApi,
        hi,
        ({paths}) => paths,
        L.entries,
        _.groupBy(([k, v]) => _.go(
            v,
            _.values,
            L.map(({tags}) => tags),
            _.take(1)
        )),
        hi
    );

    
    const createTagdropdown = () => _.go(
        pathsByGroup,
        L.entries,
        L.map(([tag, _]) => $.el(`<option value="${tag}">${tag}</option>`)),
        _.map($.appendTo($('.tagdropdown'))),
    );


    const createPathdropdown = () => _.go(
        $('.path'),
        $.delegate('change', '.tagdropdown', e => _.go(
            _.map($.remove, L.reject(el => $.hasClass("default", el), $.all(`.pathdropdown option`))),
            () => _.map($.remove, L.reject(el => $.hasClass("default", el), $.all(`.methoddropdown option`))),
            _ => $('.paramsitem') ? $.remove($('.paramsitem')) : null,
            () => $('select.tagdropdown'),
            $.val,
            tag => pathsByGroup[tag],
            arr => _.go(
                arr,
                L.map(([pathName, _]) => $.el(`<option value="${pathName}">${pathName}</option>`)),
                _.map($.appendTo($('.pathdropdown'))),
            )
        ))
    );

    const methodObject = _.pipe(
            $.val,
            tag => pathsByGroup[tag],
            _.find(([k, v]) => k == $.val($('select.pathdropdown'))),
            ([_, v]) => v,
    )

    const createMethoddropdown = () => _.go(
        $('.path'),
        $.delegate('change', '.pathdropdown', e => _.go(
            _.map($.remove, L.reject(el => $.hasClass("default", el), $.all(`.methoddropdown option`))),
            _ => $('.paramsitem') ? $.remove($('.paramsitem')) : null,
            _ => $('select.tagdropdown'),
            methodObject,
            L.entries,
            L.map(([methodName, _]) => $.el(`<option value="${methodName}">${methodName}</option>`)),
            _.map($.appendTo($('.methoddropdown')))
        ))
    );

    const createParams = () => _.go(
        $('.path'),
        $.delegate('change', '.methoddropdown', e => _.go(
            $('.paramsitem') ? $.remove($('.paramsitem')) : null,
            _ => $('select.tagdropdown'),
            methodObject,
            obj => obj[$.val($('select.methoddropdown'))],
            obj => obj == null ? displayParams({summary:'test', parameters:[], requestBody:null}) : displayParams(obj),
            $.el,
            $.appendTo($('.params'))
        ))
    );

    const lastItem = str => _.go(
        str,
        str => str == undefined ? [] : str.split('/'),
        arr => arr == [] ? null : arr[arr.length - 1]
    );

    const transform = schema => _.go(
        schema['allOf'],
        L.map(({$ref}) => lastItem($ref)),
        L.map(item => schemas[item]),
        _.map(({properties}) => properties),
    );

    const transformReqBody = requestBody => _.go(
        requestBody['$ref'],
        lastItem,
        bodyName => requestBodies[bodyName],
        body => body['content']['application/json']['schema']['$ref'],
        lastItem,
        item => schemas[item],
        schema => schema == undefined ? null : schema.hasOwnProperty('properties') ? [schema.properties] : transform(schema)      
    );
    // key??? allOf??? ??????????????? ????????? ????????? ??????




    const displayParams = ({summary, parameters, requestBody}) => 
        `
        <div class="paramsitem">
        <div class="summary">${summary ? summary : ''}</div>
        ${ parameters ? _.go(
            parameters,
            L.map(
                ({description, in:pathin , name, required, schema}) =>
                `<div class="description">${description}
                <label class="required">${required ? '(required)' : '(option)'}</label>
                </div>
                <label class="paramname">${name}</label>
                <input class="paraminput" name=${name} pathin="${pathin}" type="text" placeholder="(type:${schema['items'] ? `${schema.type} of ${schema['items'].type}` : `${schema.type}`})">
                <span class="pathin">(included in ${pathin})</span>`),
                _.join('')
                ) : '' 
            }
        ${requestBody ? `<div class="requestbody">
        <label class="requestbodylabel">Request body</label>
        ${
                _.go(
                requestBody,
                transformReqBody,
                L.map(
                    schema => _.go(
                        schema,
                        L.entries,
                        L.map(([name, {description, type}]) =>`<div class="description">${description ? description : ''}</div>
                        <label class="requestbodyname">${name}</label>
                        <input class="requestbodyinput" name=${name} type="text" bodytype="${type}" placeholder="(type:${type})">
                        <span class="pathin"></span>
                        `),
                        _.join(''),
                    )
                ),
                _.join('')
            ) 
        }
        </div>` : '<div></div>'
         }
         <label class="requestbodyname">Request Custom Body</label>
         <input class="requestcustombody" name="requestcustombody" type="text" placeholder="Your custom object { &quot;key&quot; : value, &quot;key2&quot; : value2, ... }">
        <button class="button" id="requestparams">Request this</button>
        </div>
        `

    const createUrl = () => _.go(
        $('.serverdropdown'),
        $.val,
        uri => `${uri}${$.val($('.pathdropdown'))}`,
        url => _.go(
            url,
            _ => $.all('.paramsitem .paraminput'),
            L.filter(el => $.attr('pathin', el) == 'path'),
            els => _.reduce(
                (url, el) => _.go(
                    el,
                    el => [$.val(el), $.attr('name', el)],
                    ([qs, name]) => url.replace(`{${name}}`, qs)
                ), url, els)
        )
    );

    const createBody = () => _.go(
        $.all('.paramsitem .paraminput'),
        L.reject(el => $.attr('pathin', el) == 'path'),
        els => _.reduce(
            (body, el) => _.go(
                el,
                el => [$.val(el), $.attr('name', el)],
                ([qs, name]) => qs && (body[name] = qs),
                _ => body
            ), {}, els),
            createRequestBody
    );

    const inputCustomBody = () => _.go(
        $('.requestcustombody'),
        el => el ? $.val(el) : '',
        txt => {
            let customBody = {};
            try {
                customBody = JSON.parse(txt);    
            }
            catch {
                return customBody;
            }
            return customBody;
        },
    );

    const elWrap = el => _.go(
        el,
        el => el ? $.val(el) : '',
        txt => txt && $.attr('bodytype', el) == 'object' ? [JSON.parse(txt), $.attr('name', el)] : [txt, $.attr('name', el)]
    );

    const createRequestBody = body => _.go(
        $.all('.requestbody .requestbodyinput'),
        els => _.reduce(
            (body, el) => _.go(
                el,
                elWrap,
                ([value, key]) => value && (body[key] = value),
                _ => body
            ), {}, els),
        resbody => _.extend(body, resbody),
        resbody => _.extend(resbody, inputCustomBody()),
        hi
    );

    const createHeader = headers => _.go(
        $('.requestheader #accesstoken'),
        hi,
        $.val,
        token => token ? {'x-cupix-auth': token } : {},
        obj => _.extend(headers, obj)
    );

    
    const requestByMethod = ([url, params, header]) => _.go(
        $('.methoddropdown'),
        $.val,
        method => $[method](url, params, header),
        res => new Promise((resolve, reject) => {
            res.ok ? _.go(res.json(), resj => resolve([res.status, resj])).catch(() => resolve([res.status, null])) : _.go(res.json(), resj => reject([res.status, resj]));
        }).catch(a => a)
        );

    const processResponse = res => _.go(
        res,
        hi,
        ([status, res]) => 
        `Status Code ${status} : ${JSON.stringify(res, undefined, 2)}`,
        text => $.setText(text, $('.output #json'))
    );

    //createBody????????? pathin==path??? ???????????????

    const requestButtonClicked = () => _.go(
        $('.params'),
        $.delegate('click', '#requestparams', e => _.go(
            $('pre.responsebody') ? $.remove($('pre.responsebody')) : null,
            () => [createUrl(), createBody(), createHeader({})],
            requestByMethod,
            processResponse
        ))
    )
//x-cupix-auth
        return _.go(
            null,
            createTagdropdown,
            createPathdropdown,
            createMethoddropdown,
            createParams,
            requestButtonClicked
        );


})();