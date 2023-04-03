import { WebContainer } from "@webcontainer/api";
import express from 'express';

const reportOutput = (output) => {
  outputPannel.textContent += "\n" + output;
};

window.addEventListener("load", async () => {
  reportOutput(`self.crossOriginIsolated : ${self.crossOriginIsolated}`);
  reportOutput("Booting.....");
  const wc = await WebContainer.boot();
  await wc.spawn("npm", ["init"]);
  await wc.spawn("npm", ["i", "express"]);
  reportOutput("Booting Complete");

  const runCommand = async (cmd, args) => {
    const process = await wc.spawn(cmd, args);

    process.output.pipeTo(
      new WritableStream({
        write: (chunck) => {
          reportOutput(`Process output : ${chunck}`);
        },
      })
    );

    if (await process.exit) {
      reportOutput(`Process failed and exited with code ${process.exit}`);
    }
  };

  await runCommand("echo", ["Start using nodejs on your browser"]);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const cmd = command.value.split(" ")[0];
    const args = command.value.split(" ").slice(1);
    await runCommand(cmd, args);
  });

  // serverBtn.addEventListener('click',()=>{
  //   getServices();
  // })

  createBtn.addEventListener("click", () => {
    createServices();
  });

  const getServices = async () => {
    // try {
    //   await wc.fs.writeFile('/main.js', "import {Bonjour} from 'bonjour-service'; const instance = new Bonjour(); instance.find({ type: 'tms' }, function (service) {console.log('Found an http server:', service)});");

    // } catch (error) {
    //   reportOutput('Encountered an'+"\n" +error)
    // }
    // var browser = new Bonjour();
    // browser.find({ type: "tms" }, function (service) {
    //   reportOutput("Found an http server:", service);
    // });
  };

  const createServices = () => {
    // var instance=new Bonjour();
    // instance.publish({ name: 'Network Discovery Server', type: 'tms',protocol:'tcp', port: 8080,host:'localhost' })
    // var app = express();
    // const port = 8080;
    // app.get("/status", (req, res) => {
    //   res.send({ val: "Connected to local server" });
    // });

    // app.get("/checkConnection", (req, res) => {
    //   res.send({ val: "established connection" });
    // });

    // app.listen(port, () => {
    //   console.log(`Started the local host on port ${port}`);
    // });
  };
});

// Display
document.querySelector("#app").innerHTML = `
<form id="form">
<label> Command 
<input type='text' id='command'/>
</label>
<button>Run</button>
</form>
<button id='startServer'>Discover services</button>

<button id='createServer'>Create services</button>
<pre>
  <code id="outputPannel" style="display: flex;height: 400px;background-color: black;color: white;border-radius: 4px;padding: 8px;width: 80% ; overflow: auto; flex-direction: column-reverse ;"> </code>
</pre>
`;

const form = document.getElementById("form");

const outputPannel = document.getElementById("outputPannel");

const command = document.getElementById("command");
const serverBtn = document.getElementById("startServer");
const createBtn = document.getElementById("createServer");
