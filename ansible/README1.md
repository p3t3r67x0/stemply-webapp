# zackig deployment

> Here are some handy information for deployment


## Prerequisits

```bash
sudo apt install ansible
```


Create a `secrets.json` file in `ansible` directory

```json
{
  "mail_recipient": "XXX",
  "mail_server": "XXX",
  "mail_port": "XXX",
  "mail_username": "XXX",
  "mail_password": "XXX",
  "ansible_sudo_pass": "XXX",
  "admin_user_name": "XXX",
  "admin_mail_address": "XXX"
}
```


## Deployment

Run the following commands in this particular order

`ansible-playbook ansible/playbooks/webserver.yml --extra-vars "@ansible/secrets.json"`
`ansible-playbook ansible/playbooks/backend.yml --extra-vars "@ansible/secrets.json"`
`ansible-playbook ansible/playbooks/webapp.yml --extra-vars "@ansible/secrets.json"`
