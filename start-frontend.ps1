# Start React frontend with increased HTTP header limit and auto-accept different port
$env:BROWSER = 'none'
$env:NODE_OPTIONS = '--max-http-header-size=65536'
echo "Y" | npm start
