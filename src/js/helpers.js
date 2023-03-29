import { async } from "regenerator-runtime";
import { TIMEOUT_SEC } from "./config.js";

const timeout = function(seconds) {
  return new Promise(function(_, reject) {
    setTimeout(function() {
      reject(new Error(`İstek zaman aşımına uğradı! Sunucu ${seconds} saniye boyunca isteğe cevap vermedi.`));
    }, seconds * 1000)
  })
}

export const AJAX = async function(url, postData = undefined) {
  try {
    const fetchPromise = postData ? fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    }) : fetch(url);

    const response = await Promise.race([fetchPromise, timeout(TIMEOUT_SEC)]);
    const data = await response.json();

    if (!response.ok) throw new Error(`${data.message} (${res.status})`)
    return data;
  } catch(err) {
    throw err;
  }
}