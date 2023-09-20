#!/bin/bash

cd /home

git clone https://github.com/renzofbn/bibot.git
# Instalando Docker

echo -e "\e[34mRemoviendo versiones anteriores de Docker...\e[0m"
sudo apt-get remove docker docker-engine docker.io containerd runc > /dev/null 2>&1


echo -e "\e[34mInstalando paquetes necesarios...\e[0m"
sudo apt-get update
sudo apt-get install -y ca-certificates curl gnupg-agent > /dev/null 2>&1
echo "Hecho."


echo  -e "\e[34mAgregando clave GPG de Docker...\e[0m"
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg
echo "Hecho."


echo -e "\e[34mAgregando repositorio de Docker al sistema...\e[0m"
echo \
  "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
echo "Hecho."


echo -e "\e[33mInstalando Docker...\e[0m"
sudo apt-get update > /dev/null 2>&1
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin > /dev/null 2>&1

if [ $? -eq 0 ]; then
    echo -e "\e[32mDocker instalado correctamente.\e[0m"
else
    echo -e "\e[31mHa ocurrido un error durante la instalación de Docker.\e[0m"
    exit 1
fi

echo -e "\e[0;34mAgregando usuario actual al grupo docker...\e[0m"
sudo usermod -aG docker $USER > /dev/null 2>&1

echo -e "\e[34mHabilitando Docker...\e[0m"
sudo systemctl enable docker.service > /dev/null 2>&1

# Instalando Nginx

echo -e "\e[33mInstalando Nginx...\e[0m"
sudo apt install -y -qq nginx > /dev/null 2>&1

if [ $? -eq 0 ]; then
    echo -e "\e[32mNginx instalado correctamente.\e[0m"
else
    echo -e "\e[31mHa ocurrido un error durante la instalación de Nginx.\e[0m"
    exit 1
fi

# Modificando CRONTAB
echo -e "\e[34mConfigurando para ejecutar bibot despues de un reboot\e[0m"
(crontab -l 2>/dev/null; echo "@reboot cd /home/bibot && docker compose up -d") | crontab -


echo -e "\e[33mReinicia el sistema con el comando 'sudo reboot' para aplicar los cambios.\e[0m"