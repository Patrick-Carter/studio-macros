const util = require('util');
const exec = util.promisify(require('child_process').exec);

async function getActiveApplicationName() {
    try {
        switch (process.platform) {
            case 'linux':
                return getLinuxWindow();
            case 'win32':
                return getWinWindow();
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

async function getWinWindow() {
    try {
        const cmd = `
            Add-Type -TypeDefinition '
                public enum ShowWindowCommands : int
                {
                    Hide = 0,
                    Normal = 1,
                    Minimized = 2,
                    Maximized = 3,
                }

                public class Window
                {
                    [DllImport("user32.dll")]
                    [return: MarshalAs(UnmanagedType.Bool)]
                    public static extern bool IsWindowVisible(IntPtr hWnd);

                    [DllImport("user32.dll", EntryPoint = "GetForegroundWindow", CharSet = CharSet.Auto, SetLastError = true)]
                    public static extern IntPtr GetForegroundWindow();

                    [DllImport("user32.dll", EntryPoint = "GetWindowThreadProcessId", CharSet = CharSet.Auto, SetLastError = true)]
                    public static extern int GetWindowThreadProcessId(IntPtr hwnd, out int lpdwProcessId);

                    [DllImport("user32.dll")]
                    public static extern bool ShowWindow(IntPtr hWnd, ShowWindowCommands nCmdShow);
                }
            ';

            $hWnd = [Window]::GetForegroundWindow();
            $PID = 0;
            $null = [Window]::GetWindowThreadProcessId($hWnd, [ref]$PID);
            $proc = Get-Process | ? { $_.Id -eq $PID }
            $proc.Name
        `;

        const { stdout } = await exec(`powershell "${cmd}"`);
        return stdout.trim();
    } catch (error) {
        console.error(`Error: ${error}`);
    }
}

module.exports = {
    getActiveApplicationName,
}