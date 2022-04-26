import { processData } from "./process-data.js";

const withTimer = async (name, func) => {
  console.time(name);
  await func();
  console.timeEnd(name);
};

const start = () => {
  document.getElementById("data").addEventListener(
    "change",
    function () {
      const content = this.files[0];
      if (content.type !== "application/json") {
        alert("Please select a valid json file...");
        return;
      }

      const reader = new FileReader();
      reader.addEventListener("load", () => {
        // FIRST NORMAL JS PROCESSING
        withTimer("Standard", () => {
          const result = processData(reader.result);
          console.log(result);
        });

        const basicWorker = new Worker("./basic-worker.js", {
          type: "module",
        });

        const transferWorker = new Worker("./transfer-worker.js", {
          type: "module",
        });

        const wasmWorker = new Worker("./wasm-worker.js", {
          type: "module",
        });

        // SECOND NORMAL JS WORKER PROCESSING
        console.time("basic-worker");
        basicWorker.onmessage = (e) => {
          console.log(JSON.parse(e.data));
          console.timeEnd("basic-worker");
        };
        const readerResult = reader.result;
        basicWorker.postMessage({ readerResult });

        // SECOND AND A HALF, JS WORKER PROCESSING WITH GLOBAL DATA
        console.log("Start: ", Date.now());
        console.time("transfer-worker");
        transferWorker.onmessage = (e) => {
          const data = new TextDecoder("utf-8").decode(e.data);
          console.log(JSON.parse(data));
          console.timeEnd("transfer-worker");
          console.log("End 3: ", Date.now());
        };
        content.arrayBuffer().then((arrayBuffer) => {
          const byteArray = new Uint8Array(arrayBuffer);
          transferWorker.postMessage(byteArray.buffer, [byteArray.buffer]);
        });

        const go = new Go();
        WebAssembly.instantiateStreaming(
          fetch("./wasm-processor/main.wasm"),
          go.importObject
        ).then((result) => {
          go.run(result.instance);

          // THIRD USING WASM STRAIGHT UP
          console.time("wasm");
          processWithWasm(reader.result, (val) => {
            console.log(val);
            console.timeEnd("wasm");
          });

          // FOURTH USING WASM WITHOUT SENDING THE DATA
          console.time("wasm-by-binaries");
          content.arrayBuffer().then((arrayBuffer) => {
            const byteArray = new Uint8Array(arrayBuffer);
            processWithWasmByStream(byteArray, (val) => {
              console.log(val);
              console.timeEnd("wasm-by-binaries");
            });
          });
        });

        // FOURTH USING WASM IN A WORKER
        console.time("wasm-worker");
        wasmWorker.onmessage = (e) => {
          console.log(JSON.parse(e.data));
          console.timeEnd("wasm-worker");
        };
        wasmWorker.postMessage(reader.result);
      });
      reader.readAsText(content);
    },
    false
  );
};

start();
