
const baseSel = method => (sel, parent = document) => parent[method](sel);
$ = _.extend(baseSel('querySelector'), $);
$.all = baseSel('querySelectorAll');
const hi = a => (console.log(a), a);
const log = console.log;
const { L, C } = window._;
const resJSON = res => res.ok ? res.json() : _.go1(res.json(), (v) => Promise.reject(v));
const isUndefined = (a) => a === undefined;

const param = _.pipe(
    L.entries,
    L.reject(([_, a]) => isUndefined(a)),
    L.map(_.map(encodeURIComponent)),
    _.map(([k, v]) => `${k}=${v}`),
    (strs) => strs.join("&").replace(/%20/g, "+")
  );
  

const fetchBaseOpt = {
    headers: { "Content-Type": "application/json" },
    credentials: "same-origin",
  };

const fetchBaseOptF = (headers) =>
headers
  ? _.defaults(
      {
        headers: _.defaults(headers, fetchBaseOpt.headers),
      },
      fetchBaseOpt
    )
  : fetchBaseOpt;

const _fetchWithBody = (method) => _.curry((url, data, headers) =>
  _.go(
    fetch(
      url,
      Object.assign(
        {
          method,
          body: JSON.stringify(data),
        },
        fetchBaseOptF(headers)
      )
    )  
)
);




$.get = _.curry((url, data, headers) =>
_.go(
  fetch(
    url + (data === undefined ? "" : "?" + param(data)),
    fetchBaseOptF(headers)
  ),
)
);

$.post = _fetchWithBody("POST");
$.put = _fetchWithBody("PUT");
$.del = _fetchWithBody("DELETE");

