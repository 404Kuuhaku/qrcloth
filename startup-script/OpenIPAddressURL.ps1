# PowerShell Script to Open Default Browser with System IP Address in URL
$ip = (Get-NetIPAddress -InterfaceAlias "Wi-Fi" -AddressFamily IPv4 | Select-Object -First 1).IPAddress
$port = 3000
$path = "table"

# Construct the URL
$url = "http://$ip`:$port/$path"

Start-Process $url

$projectPath = "E:\Workspace\FastWork Project\qrcloth"  # Replace this with the path to your project
Set-Location -Path $projectPath

# Run the 'npm run dev' command
npm run dev