import { WebContainer } from "@webcontainer/api";
import { files } from "./files";
import './style.css';


/** @type {import('@webcontainer/api').WebContainer}  */
let wc;



async function installDependencies() {
  // Install dependencies
  const installProcess = await wc.spawn("npm", ["install"]);
  installProcess.output.pipeTo(new WritableStream({
    write(data) {
      console.log(data);
    }
  }));
  // Wait for install command to exit
  return installProcess.exit;
}

async function startDevServer() {
  // Run `npm run start` to start the Express app
  await wc.spawn('npm', ['run', 'start']);

  // Wait for `server-ready` event
  wc.on('server-ready', (port, url) => {
    iframeEl.src = url;
  });
}


window.addEventListener("load", async () => {
  textareaEl.value = files['index.js'].file.contents;
  wc = await WebContainer.boot();
  await wc.mount(files);
  // const packageJSON = await wc.fs.readFile('package.json', 'utf-8');
  // console.log(packageJSON);
  const exitCode = await installDependencies();
  if (exitCode !== 0) {
    throw new Error("Installation failed");
  }

  startDevServer();
  
});
// Display
document.querySelector('#app').innerHTML = `
  <div class="container">
    <div class="editor">
      <textarea>I am a textarea</textarea>
    </div>
    <div class="preview">
      <iframe src="loading.html"></iframe>
    </div>
  </div>
`

/** @type {HTMLIFrameElement | null} */
const iframeEl = document.querySelector('iframe');

/** @type {HTMLTextAreaElement | null} */
const textareaEl = document.querySelector('textarea');