# zackig-webapp


## Prerequisits

```bash
curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -
sudo apt-get install gcc g++ make nodejs
```


## Build Setup

```bash
# install dependencies
npm install

# serve with hot reload at localhost:3000
npm run dev

# build for production and launch server
npm run build
npm run start

# generate static project
npm run generate
```


## Service Setup

Create a systemd file called `zackig-app.service`

```bash
sudo touch /etc/systemd/system/zackig-app.service
```

Insert following content to the `zackig-app.service`

```bash
[Unit]
Description=Nuxtjs instance to serve zackig-app
After=network.target

[Service]
User=<USER>
WorkingDirectory=/home/<USER>/git/zackig-webapp
ExecStart=/usr/bin/node /home/<USER>/git/zackig-webapp/node_modules/.bin/nuxt start --port 3000
Restart=on-failure

[Install]
WantedBy=multi-user.target
```


## Nginx Setup

Create a file under `/etc/nginx/sites-enabled/default.conf` with following content

```bash
server
{
  listen 80;
  server_name app.example.com;

  location /
  {
    proxy_pass http://127.0.0.1:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header X-Forwarded-Host $http_host;
    proxy_set_header X-Forwarded-For $remote_addr;
    proxy_set_header X-Forwarded-Port $server_port;
  }
}
```
