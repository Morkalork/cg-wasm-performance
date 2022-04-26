import { processData } from "./process-data.js";

onmessage = function (e) {
  const data = e.data.readerResult;
  const basicResult = processData(data);
  postMessage(JSON.stringify(basicResult));
};
