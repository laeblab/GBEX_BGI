import TreeNode from "primereact/treenode";

export function climb_tree(qq: TreeNode[], key: string) : TreeNode|undefined {
    for (const e of qq) {
        if (e.key === key) {
            return e
        } else if (e.hasOwnProperty("children") && e.children !== undefined) {
            const deep: TreeNode|undefined = climb_tree(e.children, key)
            if (deep) {
                return deep
            }
        }
    }
}

export function getCookie(name: string) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

export function deepEqual(obj1: any, obj2: any) {

    if(obj1 === obj2) // it's just the same object. No need to compare.
        return true;

    if(isPrimitive(obj1) && isPrimitive(obj2)) // compare primitives
        return obj1 === obj2;

    if(Object.keys(obj1).length !== Object.keys(obj2).length)
        return false;

    // compare objects with same number of keys
    for(let key in obj1)
    {
        if(!(key in obj2)) return false; //other object doesn't have this prop
        if(!deepEqual(obj1[key], obj2[key])) return false;
    }

    return true;
}

//check if value is primitive
function isPrimitive(obj: any)
{
    return (obj !== Object(obj));
}

export function isValidHttpUrl(maybe_url: string) {
    if (typeof maybe_url !== "string") return false
    let url;
    try { url = new URL(maybe_url); } catch (_) { return false; }
    return url.protocol === "http:" || url.protocol === "https:";
}

export function doApiCall(target: string|number, kind: string, method: "get"|"post"|"put"|"patch"|"delete", body: object): Promise<{[key: string]: any}> {
    /* doApiCall
        target: Either id or url of target object, if there is no target (e.g. when you want to list Vials), then just pass an empty string and
        kind: If target is an id then you must also supply a model name
        method: HTML get, post, patch or delete
        body: put, patch and post requires a body
     */
    const csrftoken = "DEVELOPMENT" //getCookie('csrftoken')

    if (typeof csrftoken === 'string') {
        const requestHeaders: HeadersInit = new Headers();
        requestHeaders.set('X-CSRFToken', csrftoken)
        requestHeaders.set('Content-Type', 'application/json')

        let url = String(target)
        if (!isValidHttpUrl(url)) { // if the url is not a valid url, we naively assume its id+kind
            url = "http://127.0.0.1:8000/api/" + kind + "/"
            if (['patch', 'put', 'delete'].includes(method) || (method==="get" && String(target) !== "")) {
                url += target + "/"
            }
        }

        return fetch(url, {
            mode: 'cors',
            method: method,
            body: Object.keys(body).length === 0 ? null: JSON.stringify(body),
            headers: requestHeaders
        }).then(res => {
            if (method !== 'delete') { // no return on delete
                return res.json()
            }
        }).catch(error => console.log(error))
    }
    return new Promise(() => {})
}
