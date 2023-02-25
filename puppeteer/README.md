<h1>Puppeteer</h1>
<p>
	This is the script responsible for retrieving, parsing, and formatting data from the game.
</p>

<h1>Local build</h1>
<p>
	If you, for whatever reason, want to run this tool locally, follow the steps below.
</p>
<p><b>
	Note: I run this on Windows. I don't know how this works, if at all, on other platforms.
</b></p>

<h3>Requirements</h3>
<ul>
	<li>Enough disk space to install the required software and/or packages</li>
	<li><a href="https://nodejs.org/">Node.js</a> and <a href="https://docs.npmjs.com/about-npm">npm</a> installed</li>
	<li>A stable internet connection</li>
</ul>

<hr/>

<ol>
	<li>Download and install <a href="https://nodejs.org/">Node.js</a> and <a href="https://docs.npmjs.com/about-npm">npm</a> on your system.</li>
	<li>Create a folder, anywhere, which will serve as the root directory.</li>
	<li>In this root folder, create two additional folders, one named <b>app</b> and another named <b>data</b>.</li>
	<li>Open the command prompt or whatever CLI tool you have. <i>On Windows, press <kbd>WinKey</kbd> and search for <code>cmd</code></i></li>
	<li>Navigate to the <b>app</b> folder's path. <i>On Windows, type <code>cd &lt;path&gt;</code> and press <kbd>Enter</kbd></i></li>
	<li>Type <code>npm install puppeteer</code> and press <kbd>Enter</kbd>. Wait for completion.</li>
	<li>Type <code>npm install prettier</code> and press <kbd>Enter</kbd>. Wait for completion.</li>
	<li>Type <code>npm install prettier-plugin-sort-json</code> and press <kbd>Enter</kbd>. Wait for completion.</li>
	<li>Running these commands will create additional files and folders, you don't need to worry about those.</li>
	<li><a href="https://raw.githubusercontent.com/start-5/TiTS.JS-Save-Editor/main/puppeteer/index.js" target="_blank">Download the <code>index.js</code> file</a> and place it in the <b>app</b> folder.</li>
	<li>Return to the command prompt, still scoped to the <b>app</b> folder, type <code>node index</code> and press <kbd>Enter</kbd>. Wait for completion.</li>
</ol>

<p>
  The resulting files will go in the <b>data</b> folder. If you know what you're doing you can just edit the output in the <code>index.js</code> file.
</p>

<h1><a href="https://github.com/start-5/TiTS.JS-Save-Editor/blob/main/LICENSE">Disclaimer</a></h1>
<p>
  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.
</p>
