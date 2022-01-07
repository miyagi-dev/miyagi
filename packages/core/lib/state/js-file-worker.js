import { workerData, parentPort } from "worker_threads";

async function executeModule({ fileName }) {
  const mod = await import(fileName); //.then((module) => module.default);

  parentPort.postMessage(mod.default);
}

executeModule(workerData);
