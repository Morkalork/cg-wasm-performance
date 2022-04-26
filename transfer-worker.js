import { processData } from "./process-data.js";

onmessage = function (e) {
  console.log("End 1: ", Date.now());
  const { data } = e;
  const d = new TextDecoder("utf-8").decode(data);
  const globalResult = processData(d);
  const returnValue = new TextEncoder("utf-8").encode(
    JSON.stringify(globalResult)
  );
  console.log("End 2x: ", Date.now());
  postMessage(returnValue, [returnValue.buffer]);
};
