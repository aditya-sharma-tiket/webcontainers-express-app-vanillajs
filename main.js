import './style.css';
import { WebContainer } from '@webcontainer/api';
import { files } from './files';
import Bonjour from 'bonjour-service';
import  {Client}  from 'node-ssdp';


/** @type {import('@webcontainer/api').WebContainer}  */
let webcontainerInstance;

window.addEventListener('load', async () => {
  textareaEl.value = files['index.js'].file.contents;

  textareaEl.addEventListener('input', (e) => {
    writeIndexJS(e.currentTarget.value);
  });
  // Call only once
  webcontainerInstance = await WebContainer.boot();
  await webcontainerInstance.mount(files);

  /**
   * To confirm that it worked, 
   * let's read the contents of package.json from WebContainer
   * using the fs.readFile method provided by webcontainerInstance 
   * and log it into the console: 
  **/
  // const packageJSON = await webcontainerInstance.fs.readFile('package.json', 'utf-8');
  // console.log(packageJSON);
  const exitCode = await installDependencies();
  if (exitCode !== 0) {
    throw new Error('Installation failed');
  };
  
  startDevServer();
});



async function installDependencies() {
  // Install dependencies
  const installProcess = await webcontainerInstance.spawn('npm', ['install']);

  //read the output of this command.
  // installProcess.output.pipeTo(new WritableStream({
  //   write(data) {
  //     console.log('help',data);
  //   }
  // }));


  // Wait for install command to exit
  return installProcess.exit;
}
async function bonjour(){
  // var bonjour = require('bonjour')();
  // var bonjour=new Bonjour();
  // bonjour.find({ type: 'tms',protocol:'tcp' }, function (service) {
  //   console.log('Found an HTTP server:', service)
  // })
  // var Client = require('node-ssdp').Client
      var client =new Client();
      client.on('response', function (headers, statusCode, rinfo) {
        console.log('Got a response to an m-search.');
      });client.search('urn:schemas-upnp-org:service:ContentDirectory:1');


}

async function startDevServer() {
  // Run `npm run start` to start the Express app
  await webcontainerInstance.spawn('npm', ['run', 'start']);

bonjour();
  // Wait for `server-ready` event
  webcontainerInstance.on('server-ready', (port, url) => {
    iframeEl.src = url;
  });
}

/** @param {string} content*/

async function writeIndexJS(content) {
  await webcontainerInstance.fs.writeFile('/index.js', content);
};




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



/*
const instance = new Bonjour()
instance.find({ type: 'tms' }, function (service) {
  console.log('Found an http server:', service)
});
*/