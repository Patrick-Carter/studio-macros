const activeWindow = require('active-win');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const thing = require('./actions/action-types');

async function getActiveApplicationName() {
    try {
        switch (process.platform) {
            case 'linux':
                return getLinuxWindow();
            case 'win32':
                const process = await activeWindow();
                return process.owner.name;
        }
    } catch (error) {
        console.error(`Error: ${error}`);
    }
}

async function getLinuxWindow() {
    try {
        const { stdout: windowID } = await exec('xdotool getactivewindow');
        const { stdout: wmClass } = await exec(`xprop -id ${windowID.trim()} WM_CLASS`);
        const applicationName = wmClass.split('"')[1];
        return applicationName;
    } catch (error) {
        console.error(`Error: ${error}`);
    }
}

// async function getWinWindow() {
//     try {
//         const cmd = '$hWnd = Add-Type -Name "Win32Window" -Namespace Win32Functions -MemberDefinition "@' +
//             '[DllImport(`"user32.dll`")] public static extern IntPtr GetForegroundWindow();' +
//             '[DllImport(`"user32.dll`", SetLastError = true)] public static extern uint GetWindowThreadProcessId(IntPtr hWnd, out uint lpdwProcessId);' +
//             'public static uint GetWindowProcessId(IntPtr hwnd){ uint pid; GetWindowThreadProcessId(hwnd, out pid); return pid; }' +
//             '"@ -PassThru; $hwnd = $hWnd::GetForegroundWindow(); $proc = Get-Process -Id ($hWnd::GetWindowProcessId($hwnd)); $proc.MainModule.ModuleName;';

//         const { stdout } = await exec(`powershell -Command "${cmd}"`);
//         return stdout.trim();
//     } catch (error) {
//         console.error(`Error: ${error}`);
//     }
// }

module.exports = {
    getActiveApplicationName,
}