import "./wasm-processor/wasm_exec.js";

onmessage = function (e) {
  const { data } = e;
  const go = new self.Go();
  WebAssembly.instantiateStreaming(
    fetch("./wasm-processor/main.wasm"),
    go.importObject
  ).then((result) => {
    go.run(result.instance);
    processWithWasm(data, (val) => {
      postMessage(JSON.stringify(val));
    });
  });
};
