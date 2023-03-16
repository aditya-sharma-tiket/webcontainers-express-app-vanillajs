import { WebContainer } from "@webcontainer/api";
import Bonjour,{Browser} from 'bonjour-service'

const reportOutput = (output) => {
  outputPannel.textContent += "\n" + output;
};

window.addEventListener("load", async () => {
  reportOutput(`self.crossOriginIsolated : ${self.crossOriginIsolated}`)
  reportOutput("Booting.....");
  const wc = await WebContainer.boot();
  await wc.spawn('npm',['init']);
  await wc.spawn('npm',['i','bonjour-service']);
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


  await runCommand('echo',['Start using nodejs on your browser']);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const cmd = command.value.split(" ")[0];
    const args = command.value.split(" ").slice(1);
    await runCommand(cmd, args);
  });

  serverBtn.addEventListener('click',()=>{
    getServices();
  })

  const getServices=()=>{
    try {
      var browser=new Bonjour();
      browser.find({ type: 'tms' }, function (service) {
        reportOutput('Found an http server:', service)
      });
    } catch (error) {
      reportOutput('Encountered an'+"\n" +error)
    }
    
  }
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
<pre>
  <code id="outputPannel" style="display: flex;height: 400px;background-color: black;color: white;border-radius: 4px;padding: 8px;width: 80% ; overflow: auto; flex-direction: column-reverse ;"> </code>
</pre>
`;


const form = document.getElementById("form");


const outputPannel = document.getElementById("outputPannel");


const command = document.getElementById("command");
const serverBtn = document.getElementById("startServer");
