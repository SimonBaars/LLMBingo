export async function fetchJson(url, callback) {
  url = getUrl(url);

  const response = await fetch(url);

  if (!response.ok) {
    throw response.statusText;
  }

  if (callback) {
    return callback(await response.json());
  }
  try {
    return await response.json();
  } catch (e) {
    throw e.message;
  }
}

export function getUrl(url) {
  if (window.location.hostname === "localhost") {
    url = "http://127.0.0.1:5001/llmbingo/us-central1/" + url;
  }
  return url;
}

export async function updateRequest(url, body, callback, noJson = false) {
  url = getUrl(url);

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw response.statusText;
  }

  if (callback) {
    try {
      return callback(noJson ? response : await response.json());
    } catch (e) {
      throw e.message;
    }
  }
  return response;
}

export async function deleteRequest(url, body, callback, noJson = false) {
  const response = await fetch(url, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw response.statusText;
  }

  if (callback) {
    try {
      return callback(noJson ? response : await response.json());
    } catch (e) {
      throw e.message;
    }
  }
  return response;
}

export function convertToObject(array, key) {
  const result = {};
  array.forEach((item) => {
    result[item[key]] = item;
  });
  return result;
}
