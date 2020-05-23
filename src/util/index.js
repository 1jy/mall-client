export const flat2Tree = (json) => {
  let result = [], temp = {}, len = json.length;

  for (let i = 0; i < len; ++i) {
    temp[json[i].id] = json[i]
  }

  for (let i = 0; i < len; ++i) {
    let parent = temp[json[i].parentId];
    if (parent) {
      if (!parent.children) {
        parent.children = []
      }
      parent.children.push(json[i])
    } else {
      result.push(json[i])
    }
  }

  return result
};

export const Storage = {
  get(key) {
    return window.localStorage.getItem(key)
  },
  set(key, str) {
    window.localStorage.setItem(key, str)
  },
  clear() {
    window.localStorage.clear()
  },
  remove(key) {
    window.localStorage.removeItem(key)
  }
};
